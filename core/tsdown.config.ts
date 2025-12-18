import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
  ],
  dts: true,
  exports: true,
  publint: true,
  external: ['cfonts'], // 将cfonts标记为外部依赖
})
