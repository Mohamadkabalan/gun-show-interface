'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;


// Build tasks.
function style() {
  return gulp.src('scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    ;
}

// Watch & Build tasks.
// Use "gulp watch --dev" for sourcemaps
function watchFiles() {
  var files = [
    'css/style.css',
    'js/**/*.js',
    'images/**/*',
    'templates/**/*.twig',
    '*.twig'
  ];
  browserSync.init({
    proxy: "local.lake-geneva.com"
  });
  gulp.watch('scss/**/*.scss', style);
  gulp.watch(files).on('change', browserSync.reload)
}

const watch = gulp.series(style, watchFiles);

exports.style = style;
exports.css = style;
exports.build = style;
exports.watch = watch;
