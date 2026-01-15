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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcc3Rhcmxvb20tbWFpblxcXFxzdGFybG9vbS1tYWluXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcc3Rhcmxvb20tbWFpblxcXFxzdGFybG9vbS1tYWluXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3Jrc3BhY2Uvc3Rhcmxvb20tbWFpbi9zdGFybG9vbS1tYWluL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuXG5mdW5jdGlvbiBwYXRoUmVzb2x2ZShkaXIpIHtcbiAgcmV0dXJuIHJlc29sdmUoX19kaXJuYW1lLCAnLicsIGRpcilcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgIH0pLFxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICB2ZXJib3NlOiB0cnVlLFxuICAgICAgZGlzYWJsZTogZmFsc2UsXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQgKiAxMCxcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgZXh0OiAnLmd6JyxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnL0AnOiBwYXRoUmVzb2x2ZSgnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsnYXhpb3MnXSxcbiAgfSxcbiAgYmFzZTogJy8nLFxuICBidWlsZDoge1xuICAgIHB1YmxpY0RpcjogJycsXG4gICAgdGFyZ2V0OiAnbW9kdWxlcycsXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBhc3NldEZpbGVOYW1lczogJ3N0YXRpYy9bZXh0XS9bbmFtZV0uW2hhc2hdLltleHRdJyxcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgY29yczogdHJ1ZSxcbiAgICBvcGVuOiB0cnVlLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHsgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0sXG4gICAgICAnL3hpbmd6dW8nOiB7IHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxuICAgICAgJy9zaGVuZ3hpYW8nOiB7IHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxuICAgICAgJy9jaGF0JzogeyB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLCBjaGFuZ2VPcmlnaW46IHRydWUgfSxcbiAgICAgICcvdjEnOiB7IHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxuICAgICAgJy9zaXRlbWFwLnhtbCc6IHsgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0sXG4gICAgICAnL3JvYm90cy50eHQnOiB7IHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVSxTQUFTLG9CQUFvQjtBQUM1VyxTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8scUJBQXFCO0FBTjVCLElBQU0sbUNBQW1DO0FBUXpDLFNBQVMsWUFBWSxLQUFLO0FBQ3hCLFNBQU8sUUFBUSxrQ0FBVyxLQUFLLEdBQUc7QUFDcEM7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxnQkFBZ0I7QUFBQSxNQUNkLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFdBQVcsT0FBTztBQUFBLE1BQ2xCLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxNQUFNLFlBQVksS0FBSztBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxDQUFDO0FBQUEsRUFDbEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxPQUFPO0FBQUEsRUFDbkI7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGNBQWMsQ0FBQyxPQUFPO0FBQ3BCLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRLEVBQUUsUUFBUSx5QkFBeUIsY0FBYyxLQUFLO0FBQUEsTUFDOUQsWUFBWSxFQUFFLFFBQVEseUJBQXlCLGNBQWMsS0FBSztBQUFBLE1BQ2xFLGNBQWMsRUFBRSxRQUFRLHlCQUF5QixjQUFjLEtBQUs7QUFBQSxNQUNwRSxTQUFTLEVBQUUsUUFBUSx5QkFBeUIsY0FBYyxLQUFLO0FBQUEsTUFDL0QsT0FBTyxFQUFFLFFBQVEseUJBQXlCLGNBQWMsS0FBSztBQUFBLE1BQzdELGdCQUFnQixFQUFFLFFBQVEseUJBQXlCLGNBQWMsS0FBSztBQUFBLE1BQ3RFLGVBQWUsRUFBRSxRQUFRLHlCQUF5QixjQUFjLEtBQUs7QUFBQSxJQUN2RTtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
