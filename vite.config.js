import { defineConfig, loadEnv } from "vite";
import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const { VITE_GOOGLE_MAPS_API_KEY = "" } = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [MillionLint.vite(), react()],
    define: {
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(
        VITE_GOOGLE_MAPS_API_KEY
      ),
    },
    resolve: {
      alias: {
        "@vis.gl/react-google-maps/examples.js":
          "https://visgl.github.io/react-google-maps/scripts/examples.js",
      },
    },
  };
});
