 import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'LooceriTools',
      fileName: (format) => `looceri-tools.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'quasar'],
      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});