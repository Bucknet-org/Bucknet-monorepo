import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  tsconfig: './tsconfig.build.json',
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  external: ['jsbi', 'tiny-invariant'],
})
