const { src, dest, watch, series } = require('gulp');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

function scripts() {
  return src('./js/scripts.js')
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(babel({ presets: [['@babel/env', { modules: false }]] }))
    .pipe(uglify({ output: { comments: '/^!/' } }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('./js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('./scss/styles.scss')
    .pipe(wait(250))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./css'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  watch('./scss/styles.scss', styles);
  watch('./js/scripts.js', scripts);
  watch('./*.html').on('change', browserSync.reload);
}

exports.default = series(styles, scripts, serve);
