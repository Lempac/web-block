import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/index": path.resolve(__dirname, "./src/index.d.ts"),
      "@": path.resolve(__dirname, "src/"),
    }
  }
})
