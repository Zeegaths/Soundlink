import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// More robust package.json reading
let dependencies = {};
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), 'utf-8')
  );
  dependencies = packageJson.dependencies || {};
} catch (error) {
  console.warn('Could not read package.json:', error);
}

const vendorPackages = [
  "react",
  "react-router-dom",
  "react-router",
  "react-dom",
];

function renderChunks(deps) {
  const chunks = {};
  Object.keys(deps).forEach(key => {
    if (!vendorPackages.includes(key)) {
      chunks[key] = [key];
    }
  });
  return chunks;
}

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "brotliCompress",
      filter: /\.(js|mjs|json|css|html|svg)$/i,
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: ["fsevents"],
      output: {
        manualChunks: {
          vendor: vendorPackages,
          ...renderChunks(dependencies),
        },
      },
    },
    // Add these options to help with Vercel deployment
    target: 'es2015',
    modulePreload: false,
    minify: 'terser',
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, "./src/components"),
      Pages: path.resolve(__dirname, "./src/pages"),
      Utils: path.resolve(__dirname, "./src/utils"),
      Assets: path.resolve(__dirname, "./src/assets"),
      Context: path.resolve(__dirname, "./src/context"),
      Routes: path.resolve(__dirname, "./src/routes"),
      Src: path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});