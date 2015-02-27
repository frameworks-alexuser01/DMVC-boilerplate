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

  var start = Date.now();
  gulp.src([
    './bower_components/angular/angular.js', 
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/eventemitter2/lib/eventemitter2.js'
    ])
  .on('error', gutil.log)  
  .pipe(concat('vendors.js'))
  .pipe(gulp.dest(production ? './dist' : './build/'))
  .pipe(notify(function () {
    console.log('built VENDORS in ' + (Date.now() - start) + 'ms');
  }));

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
