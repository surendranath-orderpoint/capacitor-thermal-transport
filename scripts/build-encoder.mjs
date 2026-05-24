import * as esbuild from 'esbuild';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'dist/encoder');
const emptyShim = path.join(rootDir, 'src/encoder/shims/empty.js');
const globalsInject = path.join(rootDir, 'src/encoder/shims/globals.js');

await mkdir(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(rootDir, 'src/encoder/bundle-entry.js')],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  outfile: path.join(outDir, 'encoder.mjs'),
  alias: {
    fs: emptyShim,
    net: emptyShim,
    stream: 'stream-browserify',
    zlib: 'browserify-zlib',
    util: 'util/',
    assert: 'assert/',
    events: 'events/',
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
  },
  logLevel: 'info',
});

console.log('Built dist/encoder/encoder.mjs');
