import minify from "rollup-plugin-babel-minify"
import analyze from "rollup-plugin-analyzer"
import typescript from "rollup-plugin-typescript2"
//import banner from "rollup-plugin-banner"
export default {
	input: ["./src/index.ts"],
	output: {
		name: "Zuckor",
		file: "./dist/zuckor-min.js",
		format: "umd",
		sourcemap: true,
	},
	plugins: [
		typescript({
			tsconfig: "tsconfig.json",
		}),
		minify({
			comments: false,
		}),
		analyze({
			summaryOnly: true,
		}),
		//banner("Zuckor <%= pkg.version %> - <%= pkg.author %>")
	],
}
