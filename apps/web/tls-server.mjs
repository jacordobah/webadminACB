import { readFileSync } from 'node:fs';
import https from 'node:https';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const next = require('next');
const dir = fileURLToPath(new URL('.', import.meta.url));
const certFile = process.env.NEXT_TLS_CERT_FILE;
const keyFile = process.env.NEXT_TLS_KEY_FILE;
if (!certFile || !keyFile) throw new Error('Next.js TLS certificate and key are required');

const config = JSON.parse(readFileSync(new URL('./.next/required-server-files.json', import.meta.url))).config;
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config);
process.chdir(dir);
const app = next({ dev: false, dir, conf: config });
await app.prepare();
const server = https.createServer({ cert: readFileSync(certFile), key: readFileSync(keyFile) }, app.getRequestHandler());
server.listen(Number(process.env.PORT || 3000), process.env.HOSTNAME || '127.0.0.1');
