import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_MAP_KEY = "" } = env;

  return {
    plugins: [react()],
    define: {
      "process.env": process.env ?? {},
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(VITE_MAP_KEY),
    },
    build: {
      target: "es2020",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
  };
});
