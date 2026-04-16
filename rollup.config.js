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
        file: 'dist/colourability.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/colourability.umd.cjs',
        format: 'umd',
        name: 'Colourability',
        exports: 'default',
        sourcemap: true,
      },
      {
        file: 'dist/colourability.min.js',
        format: 'iife',
        name: 'Colourability',
        exports: 'default',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [tsPlugin],
  },
];
