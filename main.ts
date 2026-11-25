// Yatai Rush — entry build script. Copies game/ + screenshots/ to the output
// directory and writes dossier.json via the make.fun vendor library.
import { buildDossier } from './vendor/makefun-game.ts';
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
function copyDir(src: string, dst: string): void {
  mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dst, entry);
    if (statSync(from).isDirectory()) copyDir(from, to);
    else copyFileSync(from, to);
  }
}

mkdirSync(outDir, { recursive: true });
copyDir(join(root, 'game'), join(outDir, 'game'));
copyDir(join(root, 'screenshots'), join(outDir, 'screenshots'));
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('wrote ' + join(outDir, 'dossier.json') + ' (' + dossier.length + ' bytes)');
