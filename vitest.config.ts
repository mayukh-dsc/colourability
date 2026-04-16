import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/types.ts', 'src/**/*.test.ts'],
      thresholds: {
        statements: 90,
        branches: 85,
      },
    },
    include: ['src/**/*.test.ts'],
  },
});
