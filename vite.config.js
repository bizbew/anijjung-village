import { defineConfig } from 'vite';

// GitHub Pages serves this repository below /anijjung-village/.
// Local development still uses the root URL.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/anijjung-village/' : '/',
}));
