import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        root: './',
        environment: 'node',
        include: ['**/*.spec.ts'],
        exclude: ['node_modules', 'dist'],
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
                maxThreads: 4,
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['**/*.spec.ts', '**/*.module.ts'],
        },
        setupFiles: ['./test/setup.ts'],
        deps: {
            inline: [/@nestjs\/*/],
        },
    },
    plugins: [swc.vite()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
