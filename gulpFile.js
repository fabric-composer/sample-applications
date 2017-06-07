let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: [
        'gulp-debug',
        'gulp-install',
        'del'
      ]
    });

// Path settings for Gulp
let config = {
  bowerInstallPaths: [
    '**/bower_components'
  ],
  bowerPaths: [
    'packages/vehicle-lifecycle/*/bower.json'
  ]
};

// Gulp task to remove all bower_components directories
gulp.task('bower-clean', function (cb) {
  return $.del(config.bowerInstallPaths, cb);
});

// Gulp task to install bower packages
gulp.task('bower-install', function () {
  return gulp.src(config.bowerPaths)
    .pipe($.debug())
    .pipe($.install())
});
