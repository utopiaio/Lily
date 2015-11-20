var gulp = require('gulp');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var vueify = require('vueify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');

var watchList = {
  browserify: ['./app/**/*.vue'],
  less: ['./app/**/*.less']
};

gulp.task('less', function() {
  return gulp
    .src(watchList.less)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./app/dist'))
    .pipe(livereload());
});

gulp.task('browserify', function() {
  return gulp.src(['app.js'])
    .pipe(browserify({transform: ['vueify']}))
    .pipe(gulp.dest('./app/dist'))
    .pipe(livereload());
});

gulp.task('watch-browserify', function() {
  gulp.watch(watchList.browserify, ['browserify']);
});

gulp.task('watch-less', function() {
  gulp.watch(watchList.less, ['less']);
});

gulp.task('ugg', function() {
  return gulp.src('./app/dist/app.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./app/dist'));
});

gulp.task('default', function() {
  livereload.listen();
  livereload();
  gulp.start('watch-browserify');
  gulp.start('watch-less');
});
