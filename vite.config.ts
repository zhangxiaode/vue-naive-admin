import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path")

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [vue()],
  base: "/backend/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    target: 'es2020'
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    https: false,
    open: false,
    proxy: {
      "/apis": {
        target:  loadEnv(mode, process.cwd()).VITE_APP_BASE_API,
        ws: false,
        changeOrigin: true,
      },
    },
  },
})
