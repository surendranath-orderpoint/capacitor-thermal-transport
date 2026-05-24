import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(rootDir, 'dist/encoder/encoder.mjs');
const destDir = path.join(rootDir, 'dist/esm/encoder');
const dest = path.join(destDir, 'encoder.mjs');

await mkdir(destDir, { recursive: true });
await copyFile(src, dest);
console.log('Copied encoder.mjs to dist/esm/encoder/');
