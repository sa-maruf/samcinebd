import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "SAMCINEBD",
        short_name: "SAMCINEBD",
        description: "Stream Movies & TV Series",
        theme_color: "#0b0c14",
        background_color: "#0b0c14",
        display: "standalone",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});