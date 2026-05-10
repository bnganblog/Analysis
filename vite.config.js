import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'iOS >= 12'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  base: '/',
  build: {
    target: 'es2015',
    cssTarget: 'chrome61',
  },
  esbuild: {
    target: 'es2015',
  },
})
