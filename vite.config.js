import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react";
          if (/node_modules\/(react-router-dom|@remix-run\/router)\//.test(id)) return "router";
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return "motion";
          if (/node_modules\/(recharts|d3-[^/]+)\//.test(id)) return "charts";

          const iconModule = id.match(/node_modules\/lucide-react\/dist\/esm\/icons\/([^/]+)\.js/);
          if (iconModule) return `icons-${iconModule[1][0].toLowerCase()}`;
        }
      }
    }
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
