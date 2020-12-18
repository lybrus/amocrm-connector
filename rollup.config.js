import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
    input: 'src/AmoCRM/index.js',
    output: [
        {
            file: 'dist/bundle.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/bundle.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs(),
        resolve({
            browser: false,
            preferBuiltins: true
        }),
        json()
    ]
}
