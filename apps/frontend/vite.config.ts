import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"

const serverAddress = `http://localhost:${process.env.SERVER_PORT ?? 3000}`

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    proxy: {
      "/api": serverAddress,
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
