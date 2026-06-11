import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ini kunci agar Vite tidak sensitif dan restart terus-menerus karena bug .env
      ignored: ["**/.env", "**/.env.*"],
    },
  },
});
