// Push blog posts to Algolia so they can be searched on the /blog page.
//
// Run with:  npm run index
// (the npm script loads `.env` via `node --env-file-if-exists`)
//
// Credentials are provisioned by Stripe Projects (`stripe projects add
// algolia/application`) and written to `.env`. The write key is used here for
// writing the index and must never be shipped to the browser — only the
// search-only key is exposed on the client.

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { algoliasearch } from 'algoliasearch';

const appId = process.env.ALGOLIA_APPLICATION_ID;
const adminKey = process.env.ALGOLIA_WRITE_API_KEY;
const indexName = process.env.ALGOLIA_APPLICATION_NAME ?? 'blog';

if (!appId || !adminKey) {
	console.log(
		'[index-posts] ALGOLIA_APPLICATION_ID / ALGOLIA_WRITE_API_KEY not set — skipping indexing.\n' +
			'Provision Algolia with `stripe projects add algolia/application`, then run `npm run index`.',
	);
	process.exit(0);
}

const blogDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'blog');

/** Minimal YAML-ish frontmatter parser (good enough for the starter's flat keys). */
function parseFrontmatter(raw) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
	if (!match) return { data: {}, body: raw };
	const data = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
		if (!kv) continue;
		data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
	}
	return { data, body: match[2] };
}

/** Strip markdown/MDX syntax down to plain text for indexing. */
function toPlainText(markdown) {
	return markdown
		.replace(/import[\s\S]*?from\s+['"].*?['"];?/g, '') // mdx imports
		.replace(/<[^>]+>/g, ' ') // html/jsx tags
		.replace(/```[\s\S]*?```/g, ' ') // code blocks
		.replace(/[#>*_`~\-]/g, ' ') // md symbols
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 5000);
}

const files = (await readdir(blogDir)).filter((f) => /\.(md|mdx)$/.test(f));

const objects = await Promise.all(
	files.map(async (file) => {
		const raw = await readFile(join(blogDir, file), 'utf8');
		const { data, body } = parseFrontmatter(raw);
		const slug = file.replace(/\.(md|mdx)$/, '');
		return {
			objectID: slug,
			slug,
			url: `/blog/${slug}/`,
			title: data.title ?? slug,
			description: data.description ?? '',
			pubDate: data.pubDate ?? '',
			content: toPlainText(body),
		};
	}),
);

const client = algoliasearch(appId, adminKey);
await client.saveObjects({ indexName, objects });

console.log(`[index-posts] Indexed ${objects.length} post(s) into "${indexName}".`);
