module.exports = {
	config: {
		tailwindjs: "./tailwind.config.js",
		port: 9050
	},
	paths: {
		// root: "./",
		src: {
			base: "./src",
			css: "./src/css",
			js: "./src/js",
			img: "./src/img"
		},
		tmp: {
			base: "./.tmp",
			css: "./.tmp/assets/css",
			js: "./.tmp/assets/js",
			img: "./.tmp/assets/img"
		},
		dist: {
			base: "./dist",
			css: "./dist/assets/css",
			js: "./dist/assets/js",
			img: "./dist/assets/img"
		}
	}
}