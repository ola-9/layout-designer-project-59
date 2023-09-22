const { src, dest } = require('gulp');
const { parallel } = require('gulp');
const { watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');

const browserSyncJob = () => {
  browserSync.init({
    server: "build/"
  });
  watch('app/sass/**/*.scss', buildSass);
  watch('app/pages/**/*.pug', buildPug);
  watch('app/images/**/*', destImages);
};

const buildSass = () => {
  console.log('Компиляция SASS');

  return src('app/sass/*.scss')
    .pipe(sass())
    .pipe(dest('build/styles/'))
    .pipe(browserSync.stream());
};

const buildSVG = () => {
  console.log('Компиляция SVG');

  return src('./build/images/icons/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }
    ))
    .pipe(dest('build/svg/'))
};

const buildPug = () => {
    console.log('Компиляция Pug');
  
    return src('app/pages/*.pug')
      .pipe(pug({ pretty: true }))
      .pipe(dest('build/'))
      .pipe(browserSync.stream());
};

const destImages = () => {
  return src('app/images/**/*')
    .pipe(dest('build/images'));
};

const destJs = () => {
  return src('app/bootstrap/dist/js/bootstrap.min.js')
    .pipe(dest('build/js/'));
};

exports.server = browserSyncJob;
exports.build = parallel(buildSass, buildPug, buildSVG, destImages, destJs);