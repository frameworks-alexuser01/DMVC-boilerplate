var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var templateCache = require('gulp-angular-templatecache');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter')

var build = function (production) {

// BUNDLE APP
  var bundleApp = function (events, done) {

    var start = Date.now();
    gulp.src(['./app/hs.irc.translate.js', './app/main.js', './app/**/*.js'])
    .on('error', gutil.log)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulpIf(production, uglify()))
    .pipe(gulp.dest(production ? './dist' : './build/'))
    .pipe(gulpIf(!production, livereload()))
    .pipe(notify(function () {
      console.log('built APP in ' + (Date.now() - start) + 'ms');
      done && done();
    }));

  };

  var bundleTemplates = function (events, done) {

    var start = Date.now();
    gulp.src('app/**/*.html')
    .on('error', gutil.log)
    .pipe(templateCache({standalone: true}))
    .pipe(gulp.dest(production ? './dist' : './build/'))
    .pipe(gulpIf(!production, livereload()))
    .pipe(notify(function () {
      console.log('built TEMPLATES in ' + (Date.now() - start) + 'ms');
      done && done();
    }));


  };

  if (!production) {
    watch('app/**/*.js', bundleApp);
    watch('app/**/*.html', bundleTemplates);
  }

  bundleApp();
  bundleTemplates();

  // BUNDLE CSS

  var bundleCSS = function (events, done) {
    var start = Date.now();
    gulp.src('./styles/**/*')
    .on('error', gutil.log)
    .pipe(concat('main.css'))
    .pipe(gulp.dest(production ? './dist' : './build/'))
    .pipe(gulpIf(!production, livereload()))
    .pipe(notify(function () {
      console.log('built CSS in ' + (Date.now() - start) + 'ms');
      done && done();
    }));
  };

  if (!production) {
    watch('styles/**/*', bundleCSS);
  }

  bundleCSS();

  // BUNDLE VENDORS

  var bundleVendorJS = function() {
    var start = Date.now();

    // Filter in javscrip but ignore Bootstrap and JQuery since we use angular-bootstrap.
    // Remove jquery exclusion if jquery is wanted
    var jsFilter = gulpFilter(['**/*.js', '!bootstrap.js', '!jquery.js'])

    // BUNDLE VENDOR.JS

    gulp.src(mainBowerFiles())
      .pipe(jsFilter)
      .pipe(sourcemaps.init())
      .pipe(concat('vendors.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build'))
      .pipe(notify(function () {
        console.log('Built VENDOR.JS in ' + (Date.now() - start) + 'ms');
      }));
  };

  var bundleVendorCSS = function() {
    var start = Date.now();

    // BUNDLE VENDOR.CSS

    var files = mainBowerFiles();

    // We also want the bootstrap theme so it look nices on touch devices.
    // Need to add manually since it's not declared in the main section of Bootstrap
    files.push('./bower_components/bootstrap/dist/css/bootstrap-theme.css')


    gulp.src(files)
      .pipe(gulpFilter(['**/*.css']))
      .pipe(concat('vendors.css'))
      .pipe(gulp.dest(production ? './dist' : './build/'))
      .pipe(notify(function () {
        console.log('Built VENDOR.CSS in ' + (Date.now() - start) + 'ms');
      }));
  };

  var bundleVendorFonts = function() {
    var start = Date.now();

    // BUNDLE VENDOR FONTS

    gulp.src(mainBowerFiles())
      .pipe(gulpFilter(['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff']))
      .pipe(gulp.dest(production ? './dist/fonts' : './build/fonts'))
      .pipe(notify(function () {
        console.log('Bundled VENDOR fonts in ' + (Date.now() - start) + 'ms');
      }));
  };


  bundleVendorJS();
  bundleVendorCSS();
  bundleVendorFonts();

  // Copy assets
  gulp.src(['./assets/**/*.*'], { base: './assets' })
  .pipe(gulp.dest(production ? './dist' : './build/'));

};

gulp.task('deploy', function () {
  build(true);
});

gulp.task('default', function () {  
  build(false);
});
