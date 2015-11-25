var gulp = require('gulp');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var vueify = require('vueify');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');

var filePath = {
  app: ['./index.html', './app.js', './app/**/*.vue', './app/**/*.css'],
  vueify: ['./app/**/*.vue'],
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

gulp.task('vueify', function() {
  return gulp.src('app.js')
    .pipe(browserify({transform: ['vueify']}))
    .pipe(gulp.dest('./app/dist'))
    .pipe(livereload());
});

gulp.task('watch-app', function() {
  gulp.watch(filePath.app, ['vueify']);
});

gulp.task('watch-less', function() {
  gulp.watch(filePath.less, ['less']);
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
  gulp.start('watch-app');
  gulp.start('watch-less');
});
