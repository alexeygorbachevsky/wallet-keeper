import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    isolate: true,
    sequence: {
      concurrent: true,
    },
  },
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'types': path.resolve(__dirname, 'src/types'),
      'constants': path.resolve(__dirname, 'src/constants'),
      'store': path.resolve(__dirname, 'src/store'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
}) 