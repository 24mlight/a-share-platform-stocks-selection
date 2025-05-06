import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: 'src/main.js' // 替换为实际入口路径
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          // 增加超时时间到10分钟
          proxy.on("error", (err, req, res) => {
            console.log("代理错误:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            // 设置请求超时
            proxyReq.setSocketKeepAlive(true);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            // 设置响应超时
            proxyRes.socket.setKeepAlive(true);
          });
        },
        // 增加超时时间
        timeout: 600000, // 10分钟
        proxyTimeout: 600000, // 10分钟
      },
    },
    // 增加 Vite 开发服务器的超时时间
    hmr: {
      timeout: 600000, // 10分钟
    },
  },
});
