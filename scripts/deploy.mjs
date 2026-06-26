// Build the site and deploy it to Netlify.
//
// Run with:  npm run deploy
// (the npm script loads `.env` via `node --env-file-if-exists` so the
// Stripe-Projects-provisioned NETLIFY_NETLIFY_AUTH_TOKEN / NETLIFY_NETLIFY_SITE_ID are available)

import { spawnSync } from 'node:child_process';

if (!process.env.NETLIFY_NETLIFY_AUTH_TOKEN || !process.env.NETLIFY_NETLIFY_SITE_ID) {
	console.error(
		'[deploy] NETLIFY_NETLIFY_AUTH_TOKEN / NETLIFY_NETLIFY_SITE_ID not set.\n' +
			'Provision Netlify with `stripe projects add netlify/project`, then retry.',
	);
	process.exit(1);
}

const run = (cmd, args) => {
	const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
	if (result.status !== 0) process.exit(result.status ?? 1);
};

run('npm', ['run', 'build']);
run('npx', [
	'netlify',
	'deploy',
	'--prod',
	'--dir=dist',
	'--auth',
	process.env.NETLIFY_NETLIFY_AUTH_TOKEN,
	'--site',
	process.env.NETLIFY_NETLIFY_SITE_ID,
]);
