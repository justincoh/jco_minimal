const gulp = require('gulp');
// gulp plugins and utils
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');

// postcss plugins
const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-function');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');
const easyimport = require('postcss-easy-import');

const swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

// gulp.task('watch', function () {
const nodemonServerInit = function () {
    livereload.listen(1234);
};

// gulp.task('css', function () {
const css = async () => {
  const processors = [
    easyimport,
    customProperties,
    colorFunction(),
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano()
  ];

  return gulp.src('assets/css/*.css')
    .on('error', swallowError)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/built/'))
    .pipe(livereload());
};

const watch = async () => {
  gulp.watch(['assets/css/**'], {}, css);
};

const build = gulp.series(css, nodemonServerInit);
const dev = gulp.series(build, watch);

module.exports = { default: dev }; // this defines the 'default' task
/*
var gulp = require('gulp');

// gulp plugins and utils
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');

var swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var nodemonServerInit = function () {
    livereload.listen(1234);
};

gulp.task('build', ['css'], function () {
    return nodemonServerInit();
});

gulp.task('css', function () {
    var processors = [
        easyimport,
        customProperties,
        colorFunction(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];

    return gulp.src('assets/css/*.css')
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/built/'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    gulp.watch('assets/css/**', ['css']);
});

gulp.task('zip', ['css'], function () {
    var today = new Date();
    var datestr = "-" + (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear();
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + datestr + '.zip';

    return gulp.src([
        '**',
        '!node_modules', '!node_modules/**',
        '!dist', '!dist/**'
    ])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});


https://codeburst.io/switching-to-gulp-4-0-271ae63530c0
*/