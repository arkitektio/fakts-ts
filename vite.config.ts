import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ rollupTypes: true }), react()],
  server: {
    host: "127.0.0.1",
    port: 7890,
    strictPort: true,
  },
  build: {
    lib: {
      entry: "src/fakts/index.tsx",
      name: "fakts",
      fileName: "fakts"
    },

    rollupOptions: {
      external: ["react", "react-dom", "any-signal"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "any-signal": "AnySignal",
        },
      },
    },
  },
});
