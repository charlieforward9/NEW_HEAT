import { defineConfig, loadEnv } from "vite";
import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_MAP_KEY = "" } = env;

  return {
    plugins: [MillionLint.vite(), react()],
    define: {
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(VITE_MAP_KEY),
    },
  };
});
