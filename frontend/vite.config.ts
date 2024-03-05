import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "/",
    plugins: [react(), viteTsconfigPaths(), eslint()],
    server: {
        open: true,
        host: "localhost",
        port: 3000,
    },
});
