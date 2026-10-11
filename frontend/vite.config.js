import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configure Vite build tool with React plugin
export default defineConfig({
  plugins: [react()]
});
