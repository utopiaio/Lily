var path = require('path'),
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    browserify = require('gulp-browserify'),
    babelify = require('babelify');

gulp.task('babel-browser', function() {
  return gulp.src(['!es5/**/*', '**/*.6b.js'])
    .pipe(browserify({transform: 'babelify', debug: false}))
    .pipe(rename({suffix: '.babel'}))
    .pipe(gulp.dest(''))
    .pipe(livereload());
});

gulp.task('watch-browser', function() {
  livereload.listen();
  gulp.watch(['!es5/**/*.js', '**/*.6b.js'], ['babel-browser']);
});

gulp.task('babel-node', function() {
  return gulp.src(['!es5/**/*', '**/*.6.js'])
    .pipe(babel())
    .pipe(rename({suffix: '.babel'}))
    .pipe(gulp.dest(''));
});

gulp.task('watch-node', function() {
  gulp.watch(['!es5/**/*', '**/*.6.js'], ['babel-node']);
});

gulp.task('default', function() {
  gulp.start('watch-browser');
  gulp.start('watch-node');
});
