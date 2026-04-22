import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      'packages/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'apps/*/lib/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/*.bak',
    ],
    coverage: {
      reporter: ['text', 'html'],
      include: ['packages/**/*.js', 'apps/*/lib/**/*.js'],
      exclude: ['**/*.test.js', '**/node_modules/**'],
    },
  },
});
