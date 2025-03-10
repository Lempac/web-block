import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const ReactCompilerConfig = {
	target: "19", // '17' | '18' | '19'
};

export default defineConfig({
	preview: {
		port: 3000,
	},
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@/index": path.resolve(__dirname, "./src/index.d.ts"),
			"@": path.resolve(__dirname, "src/"),
		},
	},
});
