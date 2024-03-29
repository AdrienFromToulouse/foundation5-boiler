'use strict';
// Generated on 2014-03-06 using generator-gulp-webapp 0.0.4

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var spritesmith = require("gulp-spritesmith");
var gulpif = require('gulp-if');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

// Load plugins
var $ = require('gulp-load-plugins')();

// Sprite generator
gulp.task('sprites', function () {
  return  gulp.src('app/images/ui/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      styleName: 'sprite.css',
      imgPath: 'app/images/sprite.png'
    }))
    .pipe(gulpif('*.png', gulp.dest('app/images/')))
    .pipe(gulpif('*.css', gulp.dest('app/styles/')));
});

// Styles
gulp.task('styles', function () {
  return gulp.src('app/styles/*.scss')
    .pipe($.rubySass({
      style: 'expanded',
      loadPath: ['app/bower_components']
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('app/styles'))
    .pipe($.size());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(concat('msi_loreal.min.js'))
    .pipe(gulp.dest('app/scripts'));
});

// HTML
gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Clean
gulp.task('clean', function () {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false}).pipe($.clean());
});

// Bundle
gulp.task('bundle', ['styles', 'scripts'], $.bundle('./app/*.html'));

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

// Connect
gulp.task('connect', $.connect.server({
  root: ['app'],
  port: 9000,
  livereload: true
}));

// Inject Bower components
gulp.task('wiredep', function () {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      directory: 'app/bower_components',
      ignorePath: 'app/bower_components/'
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'app/bower_components',
      ignorePath: 'app/'
    }))
    .pipe(gulp.dest('app'));
});

// Watch
gulp.task('watch', ['connect'], function () {
  // Watch for changes in `app` folder
  gulp.watch([
    'app/*.html',
    'app/styles/**/*.css',
    'app/scripts/**/*.coffee',
    'app/images/**/*'
  ], function(event) {
    return gulp.src(event.path)
      .pipe($.connect.reload());
  });
  
  // Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['sprites']);

  // Watch .js files
  gulp.watch('app/scripts/**/*.coffee', ['scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);

  // Watch bower files
  gulp.watch('app/bower_components/*', ['wiredep']);
});
