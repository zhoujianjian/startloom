// vite.config.js
import { defineConfig } from "file:///D:/workspace/starloom-main/starloom-main/frontend/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import vue from "file:///D:/workspace/starloom-main/starloom-main/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/workspace/starloom-main/starloom-main/frontend/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/workspace/starloom-main/starloom-main/frontend/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///D:/workspace/starloom-main/starloom-main/frontend/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import viteCompression from "file:///D:/workspace/starloom-main/starloom-main/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\workspace\\starloom-main\\starloom-main\\frontend";
function pathResolve(dir) {
  return resolve(__vite_injected_original_dirname, ".", dir);
}
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 1024 * 10,
      algorithm: "gzip",
      ext: ".gz"
    })
  ],
  resolve: {
    alias: {
      "/@": pathResolve("src")
    }
  },
  define: {
    "process.env": {}
  },
  optimizeDeps: {
    include: ["axios"]
  },
  base: "/",
  build: {
    publicDir: "",
    target: "modules",
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    rollupOptions: {
      output: {
        assetFileNames: "static/[ext]/[name].[hash].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    host: "0.0.0.0",
    cors: true,
    open: true,
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true },
      "/xingzuo": { target: "http://localhost:8080", changeOrigin: true },
      "/shengxiao": { target: "http://localhost:8080", changeOrigin: true },
      "/chat": { target: "http://localhost:8080", changeOrigin: true },
      "/v1": { target: "http://localhost:8080", changeOrigin: true },
      "/sitemap.xml": { target: "http://localhost:8080", changeOrigin: true },
      "/robots.txt": { target: "http://localhost:8080", changeOrigin: true }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcc3Rhcmxvb20tbWFpblxcXFxzdGFybG9vbS1tYWluXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcc3Rhcmxvb20tbWFpblxcXFxzdGFybG9vbS1tYWluXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3Jrc3BhY2Uvc3Rhcmxvb20tbWFpbi9zdGFybG9vbS1tYWluL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5cclxuZnVuY3Rpb24gcGF0aFJlc29sdmUoZGlyKSB7XHJcbiAgcmV0dXJuIHJlc29sdmUoX19kaXJuYW1lLCAnLicsIGRpcilcclxufVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgIH0pLFxyXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgdmVyYm9zZTogdHJ1ZSxcclxuICAgICAgZGlzYWJsZTogZmFsc2UsXHJcbiAgICAgIHRocmVzaG9sZDogMTAyNCAqIDEwLFxyXG4gICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgZXh0OiAnLmd6JyxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJy9AJzogcGF0aFJlc29sdmUoJ3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgJ3Byb2Nlc3MuZW52Jzoge30sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFsnYXhpb3MnXSxcclxuICB9LFxyXG4gIGJhc2U6ICcvJyxcclxuICBidWlsZDoge1xyXG4gICAgcHVibGljRGlyOiAnJyxcclxuICAgIHRhcmdldDogJ21vZHVsZXMnLFxyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxyXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLltoYXNoXS5bZXh0XScsXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxyXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICBjb3JzOiB0cnVlLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzogeyB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLCBjaGFuZ2VPcmlnaW46IHRydWUgfSxcclxuICAgICAgJy94aW5nenVvJzogeyB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLCBjaGFuZ2VPcmlnaW46IHRydWUgfSxcclxuICAgICAgJy9zaGVuZ3hpYW8nOiB7IHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICAnL2NoYXQnOiB7IHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICAnL3YxJzogeyB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLCBjaGFuZ2VPcmlnaW46IHRydWUgfSxcclxuICAgICAgJy9zaXRlbWFwLnhtbCc6IHsgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0sXHJcbiAgICAgICcvcm9ib3RzLnR4dCc6IHsgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1UsU0FBUyxvQkFBb0I7QUFDNVcsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLHFCQUFxQjtBQU41QixJQUFNLG1DQUFtQztBQVF6QyxTQUFTLFlBQVksS0FBSztBQUN4QixTQUFPLFFBQVEsa0NBQVcsS0FBSyxHQUFHO0FBQ3BDO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLElBQ0QsZ0JBQWdCO0FBQUEsTUFDZCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxXQUFXLE9BQU87QUFBQSxNQUNsQixXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxZQUFZLEtBQUs7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsT0FBTztBQUFBLEVBQ25CO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixjQUFjLENBQUMsT0FBTztBQUNwQixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUSxFQUFFLFFBQVEseUJBQXlCLGNBQWMsS0FBSztBQUFBLE1BQzlELFlBQVksRUFBRSxRQUFRLHlCQUF5QixjQUFjLEtBQUs7QUFBQSxNQUNsRSxjQUFjLEVBQUUsUUFBUSx5QkFBeUIsY0FBYyxLQUFLO0FBQUEsTUFDcEUsU0FBUyxFQUFFLFFBQVEseUJBQXlCLGNBQWMsS0FBSztBQUFBLE1BQy9ELE9BQU8sRUFBRSxRQUFRLHlCQUF5QixjQUFjLEtBQUs7QUFBQSxNQUM3RCxnQkFBZ0IsRUFBRSxRQUFRLHlCQUF5QixjQUFjLEtBQUs7QUFBQSxNQUN0RSxlQUFlLEVBQUUsUUFBUSx5QkFBeUIsY0FBYyxLQUFLO0FBQUEsSUFDdkU7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
