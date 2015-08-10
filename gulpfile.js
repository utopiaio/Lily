var path = require('path'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload');

gulp.task('reload', function() {
  return gulp
    .src(['./index.html',
          './app/**/*.html',
          './app/**/*.css',
          './app/**/*.js'])
    .pipe(livereload());
});

gulp.task('compile-less', function() {
  return gulp
    .src(['./app/**/*.less'])
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./app/dist/style'));
});

gulp.task('watch-less', function() {
  return gulp
    .watch(['./app/**/*.less'], ['compile-less']);
});

gulp.task('watch-app', function() {
  return gulp
    .watch(['./index.html',
            './app/**/*.html',
            './app/**/*.js',
            './app/**/*.css'], ['reload']);
});

gulp.task('default', function() {
  livereload.listen();
  gulp.start('watch-app');
  gulp.start('watch-less');
});
