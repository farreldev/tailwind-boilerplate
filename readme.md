# Gulp with TailwindCSS Starter Kit

Gulp with Sass and TailwindCSS Starter Kit ( Updated with TailwindCSS v3 )- A repo which makes your development easier with predefined gulp tasks that help you to use [tailwindcss](https://github.com/tailwindcss/tailwindcss) with simple npm commands 

## Usage

1. Install Dev Depedencies
```sh
npm install // or yarn install
```
2. To start development and server for live preview
```sh
npm run dev // or yarn dev
```
3. To generate minifed files for production server
```sh
npm run prod // or yarn prod
```

# Configuration


To change the path of files and destination/build folder, edit options in **config.js** file
```sh
{
  config: {
      ...
      port: 9050 // browser preview port
  },
  paths: {
    #  root: "./",
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
  ...
}
```
