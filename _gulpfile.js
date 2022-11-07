// 'use strict';
var gulp         = require('gulp');
var sass         = require('gulp-sass');
sass.compiler    = require('node-sass');

var plumber      = require('gulp-plumber');
var cssmin       = require('gulp-cssmin');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var watch        = require('gulp-watch');
var notify       = require("gulp-notify");
var sourcemaps   = require("gulp-sourcemaps");
var browserSync  = require('browser-sync').create();

// var spritesmith  = require('gulp.spritesmith');

// var iconfont     = require('gulp-iconfont');
// var iconfontCss  = require('gulp-iconfont-css');
// var runTimestamp = Math.round(Date.now()/1000);

var twig         = require('gulp-twig');

// var fontName     = 'ui-icons';
var $css         = [
'./css/style.css'
];

/* Compile Twig templates to HTML */
gulp.task('templates', function() {
    return gulp.src(['./html/templates/*.html']) // run the Twig template parser on all .html files in the "templates" directory
      .pipe(plumber(({
        errorHandler: notify.onError('TWIG error: <%= error.message %>')
      })))
      .pipe(twig())
      .pipe(gulp.dest('./html')); // output the rendered HTML files to the "dist" directory
});

/* Generate png sprite */
// gulp.task('sprite', function () {
//   var sprite = gulp.src('images/icons-sprite/*.png').pipe(spritesmith({
//     imgName: '../images/sprite.png',
//     cssName: '_sprite.scss',
//     cssFormat: 'scss',
//     algoritm: 'binary-tree',
//     padding: 5
//   }));

//   sprite.img.pipe(rename('sprite.png')).pipe(gulp.dest('images/'));
//   sprite.css.pipe(gulp.dest('scss/components/'));
// });

/* Generate icons font */
// gulp.task('icon_font', function() {
//   return gulp.src(['images/icons/*.svg']) // Source folder containing the SVG images
//     .pipe(iconfontCss({
//       fontName: fontName, // The name that the generated font will have
//       path: 'scss/components/_icons-template.scss', // The path to the template that will be used to create the SASS/LESS/CSS file
//       targetPath: '../../scss/components/_icons.scss', // The path where the file will be generated
//       fontPath: '../fonts/icons/' // The path to the icon font file
//     }))
//     .pipe(iconfont({
//       prependUnicode: false, // Recommended option 
//       fontName: fontName, // Name of the font
//       formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'], // The font file formats that will be created
//       fontHeight: 1000,
//       normalize: true,
//       timestamp: runTimestamp, // Recommended to get consistent builds when watching files
//       appendCodepoints: true,
//       descent: 143
//     }))
//     .pipe(gulp.dest('fonts/icons/'));
// });

/* Min CSS */
gulp.task('css_min', ['scss'], function() {
  gulp.src($css)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css'))
    .pipe(cssmin({path: './css/style.css'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./css'));
});

/* CSS concat */
gulp.task('css_concat', ['scss'], function () {
  gulp.src($css)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css'));
});

/* Main SCSS task */
gulp.task('scss', function () {
  return gulp.src(['./scss/style.scss'])
    .pipe(plumber(({
      errorHandler: notify.onError('SCSS error: <%= error.message %>')
    })))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules'],
      style: 'expanded',
      outputStyle: 'expanded',
    }))
    .pipe(sass.sync())
    .pipe(concat({ path: './style.css'}))
    .pipe(autoprefixer({
      Browserslist: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

/* Watch */
gulp.task('watch', [
  ], function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "./html/index.html"
    }
  });

  watch(['./js/*.js'])
  .on('change', browserSync.reload);

  watch(['./html/templates/**/*.html'], function(event, cb) {
    gulp.start('templates');
  })
  .on('change', browserSync.reload);

  watch(['./scss/**/*.scss'], function(event, cb) {
    gulp.start('css_concat', 'css_min');
  })
  .on('change', browserSync.reload);
});

/* Default task */
gulp.task('default', ['watch']);
