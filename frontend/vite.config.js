import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touc-icon.png", "masked-icon.png"],
  manifest: {
    name: "Expense Tracker",
    short_name: "Expense Tracker",
    description: "An app that can track your expenses.",
    icons: [
      {
        src: "./maskable-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/maskable-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "./maskable-icon.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./maskable-icon.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "icon",
      },
      {
        src: "./maskable-icon.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#181818",
    background_color: "#e8eac2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});