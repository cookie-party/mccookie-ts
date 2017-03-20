var gulp   = require('gulp');
var LiveServer = require('gulp-live-server');
var source = require('vinyl-source-stream')
var tsc    = require('gulp-tsc');
var del    = require('del');
var rename = require('gulp-rename');
var git = require('gulp-git');
var bump = require('gulp-bump');
var shell = require('gulp-shell');
 
gulp.task('default',['build-server'], function(done) {
    var server = new LiveServer('./server.js');
    server.start();  
   // return gulp.watch('**/*.{ts,tsx}', ['build-server']);
});

/* Compile Server */
gulp.task('clean-js-server', function () {
  return del(['src/server/**/*.js','src/server/**/*.map']);
});

gulp.task('build-server',['clean-js-server','webpack'], function () {
  return gulp
  .src(['src/server/**/*.{ts,tsx}',
    '!./node_modules/**/*.*'])
  .pipe(tsc({
    module: "commonjs",
    target: "es6",
    jsx: "react",
    emitError: true,
    sourceMap: true
  }))
  .pipe(gulp.dest('./build/server'));
});

/* webpack */
gulp.task('webpack', shell.task([
  'webpack'
]));

/* increment build*/
gulp.task('bump', function () {
  return   gulp.src('./package.json')
               .pipe(bump())
               .pipe(gulp.dest('./'));
});


