import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    // 통찰 3: law.go.kr DRF API는 브라우저 CORS를 허용하지 않으므로
    // 개발 중에는 dev proxy로 우회한다. (배포 시엔 서버리스 프록시로 대체)
    proxy: {
      "/law-api": {
        target: "https://www.law.go.kr",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/law-api/, ""),
      },
    },
  },
});
