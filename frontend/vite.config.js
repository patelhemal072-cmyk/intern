import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Get all .html files in the frontend folder to ensure Vite serves them all
const htmlFiles = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.html'))
    .reduce((acc, file) => {
        const name = file.replace('.html', '');
        acc[name] = resolve(__dirname, file);
        return acc;
    }, {});

export default defineConfig({
    root: './',
    server: {
        port: 3000,
        strictPort: true,
        host: true, // Allow external access
        proxy: {
            '/api': {
                target: 'http://localhost:5002',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        rollupOptions: {
            input: htmlFiles,
        },
    },
});
