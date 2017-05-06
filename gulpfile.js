const gulp = require('gulp'),
  rename = require('gulp-rename'),
  zip = require('gulp-zip'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  less = require('gulp-less'),
  jsmin = require('gulp-jsmin'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  imagemin = require('gulp-imagemin'),
  watch = require('gulp-watch'),
  path = require('path'),
  cssmin = require('gulp-cssmin'),
  notify = require("gulp-notify"),
  clean = require('gulp-clean');
  gutil = require('gulp-util'),
  ftp = require('gulp-ftp'),
browserSync = require('browser-sync').create(),
lib = require('./lib.js');

const zipFiles = ['./**','!./lib/**','!./node_modules/**','!./bower_components/**'],
  jadeFiles = ['./jade/*.jade', './jade/**/*.jade', ],
  pugFiles = ['./pug/*.pug', './pug/**/*.pug'].concat(jadeFiles),
  sassFiles = ['./sass/*.sass', './sass/*.scss', './sass/**/*.scss', './sass/*.scss', './sass/**/*.sass', './sass/*.sass'],
  jsFiles = ['./js/**/*.js', './js/*.js'],
  imgFiles = ['./images/**/*', './images/*/*'];

const libSettingFile = "./lib.js",
libCssFileName = "lib.css",
libJsFileName = "lib.js",
javascriptLibFiles = lib.javascriptLibFiles,
styleLibFiles = lib.styleLibFiles;

const appFolder = "./app/",  
  staticFolder = "Content/",
  serverPort = 4545;

const ftpInFormation ={
  host: "207.154.204.212",
  port: 21,
  user: "enessefa",
  pass: "KAbana343794",
  remotePath: "/public_html/akrenis.com"
};

gulp.task('publish', function () {
    return gulp.src(appFolder+"/**")
        .pipe(ftp(ftpInFormation))
        .pipe(gutil.noop());
});

gulp.task('zip', () => {
    return gulp.src(zipFiles)
        .pipe(zip('project.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task("pug", () => {
  gulp.src(pugFiles)
    .pipe(pug({
      client: false,
      pretty: true
    }))
    .on('error', notify.onError(function (error) {
      return 'An error occurred while compiling jade.\nLook in the console for details.\n' + error;
    }))
    .pipe(gulp.dest(appFolder))
    .pipe(browserSync.stream());
});

gulp.task("sass", () => {
  gulp.src(sassFiles)
    .pipe(sass({
        outputStyle: 'compressed'
      })
      .on('error', sass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(appFolder + staticFolder + "css/"))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  gulp.src(jsFiles)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(appFolder + staticFolder + 'js/'))
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(appFolder + staticFolder + 'js/'))
    .pipe(browserSync.stream());
});

gulp.task('lib-js', () => {
  gulp.src(javascriptLibFiles)
    .pipe(concat(libJsFileName))
    .pipe(gulp.dest(appFolder + staticFolder + 'js/'))
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(appFolder + staticFolder + 'js/'))
    .pipe(browserSync.stream());
});

gulp.task('lib-css', () => {
  gulp.src(styleLibFiles)
    .pipe(concat(libCssFileName))
    .pipe(gulp.dest(appFolder + staticFolder + 'css/'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(appFolder + staticFolder + 'css/'))
    .pipe(browserSync.stream());
});

gulp.task('img', () => {
  gulp.src(imgFiles)
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran([{
        quality: 'low'
      }]),
      imagemin.optipng(),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(appFolder + staticFolder + 'img'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
    port: serverPort,
    server: appFolder
  });
  gulp.watch(pugFiles, ['pug']);
  gulp.watch(sassFiles, ['sass']);
  gulp.watch(jsFiles, ['js']);
  gulp.watch(libSettingFile, ['lib-css']);
  gulp.watch(libSettingFile, ['lib-js']);
  gulp.watch(imgFiles, ['img']);
});

gulp.task('default', ['pug', 'sass', 'js', 'lib-css', 'lib-js', 'img', 'browser-sync']);
