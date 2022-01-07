/**
*   Gulp with TailwindCSS - An CSS Utility framework                                
*   Author : Manjunath G                                              
*   URL : manjumjn.com | lazymozek.com
*   Twitter : twitter.com/manju_mjn                                    
**/

/*
  Usage:
  1. npm install //To install all dev dependencies of package
  2. npm run dev //To start development and server for live preview
  3. npm run prod //To generate minifed files for live server
*/

const { src, dest, task, watch, series, parallel } = require('gulp');
const del = require('del'); //For Cleaning build/dist for fresh export
const options = require("./config"); //paths and other options from config.js
const browserSync = require('browser-sync').create();

const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass'); //For Compiling SASS files
const postcss = require('gulp-postcss'); //For Compiling tailwind utilities with tailwind config
const concat = require('gulp-concat'); //For Concatinating js,css files
const uglify = require('gulp-terser');//To Minify JS files
const imagemin = require('gulp-imagemin'); //To Optimize Images
const htmlmin = require("gulp-htmlmin"); //To Optimize HTML
const cleanCSS = require('gulp-clean-css');//To Minify CSS files
const purgecss = require('gulp-purgecss');// Remove Unused CSS from Styles

//Note : Webp still not supported in major browsers including forefox
//const webp = require('gulp-webp'); //For converting images to WebP format
//const replace = require('gulp-replace'); //For Replacing img formats to webp in html
const logSymbols = require('log-symbols'); //For Symbolic Console logs :) :P 

//Load Previews on Browser on dev
function livePreview(done){
  browserSync.init({
    server: {
      baseDir: options.paths.tmp.base
    },
    port: options.config.port || 5000
  });
  done();
} 

// Triggers Browser reload
function previewReload(done){
  console.log("\n\t" + logSymbols.info,"Reloading Browser Preview.\n");
  browserSync.reload();
  done();
}

//Development Tasks
// function devHTML(){
//   return src(`${options.paths.src.base}/**/*.html`).pipe(dest(options.paths.tmp.base));
// } 

// Include HTML
function includeHTML() {
  return src([`${options.paths.src.base}/**/*.html`])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest(options.paths.tmp.base));
}

function devStyles(){
  const tailwindcss = require('tailwindcss'); 
  return src(`${options.paths.src.css}/**/*.scss`).pipe(sass().on('error', sass.logError))
    .pipe(dest(options.paths.src.css))
    .pipe(postcss([
      tailwindcss(options.config.tailwindjs),
      require('autoprefixer'),
    ]))
    .pipe(concat({ path: 'style.css'}))
    .pipe(dest(options.paths.tmp.css));
}

// function devScripts(){
//   return src([
//     `${options.paths.src.js}/libs/**/*.js`,
//     `${options.paths.src.js}/**/*.js`,
//     `!${options.paths.src.js}/**/external/*`
//   ]).pipe(concat({ path: 'scripts.js'})).pipe(dest(options.paths.tmp.js));
// }

function devScripts(){
  return src(`${options.paths.src.js}/**/*.js`)
  .pipe(dest(options.paths.tmp.js));
}

function devImages(){
  return src(`${options.paths.src.img}/**/*`).pipe(dest(options.paths.tmp.img));
}

function watchFiles(){
  watch(`${options.paths.src.base}/**/*.html`,series(includeHTML, devStyles, previewReload));
  watch([options.config.tailwindjs, `${options.paths.src.css}/**/*.scss`],series(devStyles, previewReload));
  watch(`${options.paths.src.js}/**/*.js`,series(devScripts, previewReload));
  watch(`${options.paths.src.img}/**/*`,series(devImages, previewReload));
  console.log("\n\t" + logSymbols.info,"Watching for Changes..\n");
}

function devClean(){
  console.log("\n\t" + logSymbols.info,"Cleaning dist folder for fresh start.\n");
  return del([options.paths.tmp.base, options.paths.dist.base]);
}

//Production Tasks (Optimized Build for Live/Production Sites)
function prodHTML(){
  // return src([`${options.paths.src.base}/**/*.html`, ,`${options.paths.tmp.base}/*.html`]).pipe(dest(options.paths.dist.base));
  return src([`${options.paths.tmp.base}/*.html`])
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest(options.paths.dist.base));
}

function prodStyles(){
  return src(`${options.paths.tmp.css}/**/*`)
  .pipe(purgecss({
    content: ['src/**/*.{html,js}'],
    defaultExtractor: content => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
      return broadMatches.concat(innerMatches)
    }
  }))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(dest(options.paths.dist.css));
}

// function prodScripts(){
//   return src([
//     `${options.paths.src.js}/libs/**/*.js`,
//     `${options.paths.src.js}/**/*.js`
//   ])
//   .pipe(concat({ path: 'scripts.js'}))
//   .pipe(uglify())
//   .pipe(dest(options.paths.dist.js));
// }

function prodScripts(){
  return src(
    `${options.paths.src.js}/**/*.js`)
    // .pipe(uglify())
    .pipe(dest(options.paths.dist.js));
}

function prodImages(){
  return src(options.paths.src.img + '/**/*').pipe(imagemin()).pipe(dest(options.paths.dist.img));
}

function prodClean(){
  console.log("\n\t" + logSymbols.info,"Cleaning build folder for fresh start.\n");
  return del([options.paths.dist.base]);
}

// function prodCleanThemes() {
//   console.log("Cleaning themes folder..!");
//   return del([`${options.paths.dist.base}/themes`]);
// }

function buildFinish(done){
  console.log("\n\t" + logSymbols.info,`Production build is complete. Files are located at ${options.paths.dist.base}\n`);
  done();
}

exports.default = series(
  devClean, // Clean Dist Folder
  includeHTML,
  parallel(devStyles, devScripts, devImages), //Run All tasks in parallel
  livePreview, // Live Preview Build
  watchFiles // Watch for Live Changes
);

exports.prod = series(
  prodClean, // Clean Build Folder
  includeHTML,
  parallel(prodStyles, prodScripts, prodImages, prodHTML), //Run All tasks in parallel
  // prodCleanThemes,
  buildFinish
);