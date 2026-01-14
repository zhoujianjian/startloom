import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'

function pathResolve(dir) {
  return resolve(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 1024 * 10,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '/@': pathResolve('src'),
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['axios'],
  },
  base: '/',
  build: {
    publicDir: '',
    target: 'modules',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    cors: true,
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/xingzuo': { target: 'http://localhost:8080', changeOrigin: true },
      '/shengxiao': { target: 'http://localhost:8080', changeOrigin: true },
      '/chat': { target: 'http://localhost:8080', changeOrigin: true },
      '/v1': { target: 'http://localhost:8080', changeOrigin: true },
      '/sitemap.xml': { target: 'http://localhost:8080', changeOrigin: true },
      '/robots.txt': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
