import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const tsPlugin = typescript({
  tsconfig: './tsconfig.json',
  compilerOptions: {
    noEmit: false,
    declaration: false,
    outDir: undefined,
    module: 'ESNext',
  },
  rootDir: 'src',
});

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/overlay-filter.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/overlay-filter.umd.cjs',
        format: 'umd',
        name: 'OverlayFilter',
        exports: 'default',
        sourcemap: true,
      },
      {
        file: 'dist/overlay-filter.min.js',
        format: 'iife',
        name: 'OverlayFilter',
        exports: 'default',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [tsPlugin],
  },
];
