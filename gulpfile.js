
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var maps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

// Sass
gulp.task('sass', function() {
  return gulp.src('app/assets/scss/style.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


// JS
gulp.task('concat', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
    'node_modules/owl.carousel/dist/owl.carousel.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    'node_modules/swiper/dist/js/swiper.js',
    'node_modules/masonry-layout/dist/masonry.pkgd.js',
    'node_modules/imagesloaded/imagesloaded.js',
    'node_modules/skrollr/dist/skrollr.min.js',
    'node_modules/vivus/dist/vivus.min.js',
    'node_modules/video.js/dist/video.min.js',
    'node_modules/videojs-youtube/dist/Youtube.min.js',
    'node_modules/lavalamp/js/jquery.lavalamp.js',
    'node_modules/jquery-background-video/jquery.background-video.js',
    'node_modules/headroom.js/dist/headroom.js',
    'node_modules/headroom.js/dist/jQuery.headroom.js',
    'node_modules/jquery.countdown/jquery.countdown.js',
    'node_modules/jquery-circle-progress/dist/circle-progress.js',
    'node_modules/typed.js/lib/typed.min.js',
    'node_modules/aos/dist/aos.js',
    'node_modules/smooth-scroll/dist/smooth-scroll.js',
    'node_modules/filterizr/dist/jquery.filterizr.min.js',
    'app/assets/js/vendor/jquery.selectric.js',
    'app/assets/js/vendor/jquery.accordion.js',
    'app/assets/js/vendor/prism.js',
    'app/assets/js/vendor/modernizr.js'

    ])
    .pipe(maps.init())
    .pipe(concat('vendor.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('app/assets/js'));
});



// JS Minify
gulp.task('js-minify', ['concat'], function() {
  return gulp.src('app/assets/js/vendor.js')
  .pipe(maps.init())
  .pipe(uglify())
  .pipe(rename('vendor.min.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('app/assets/js'));
});

// CSS
gulp.task('concat-css', function () {
  return gulp.src([
      'node_modules/owl.carousel/dist/assets/owl.carousel.css',
      'node_modules/magnific-popup/dist/magnific-popup.css',
      'node_modules/swiper/dist/css/swiper.css',
      'node_modules/video.js/dist/video-js.css',
      'node_modules/aos/dist/aos.css'
    ])
    .pipe(maps.init({loadMaps: true}))
    .pipe(concat("vendor.css"))
    .pipe(maps.write())
    .pipe(gulp.dest('app/assets/css'));
});


// Watch
gulp.task('default', ['browserSync', 'sass', 'concat-css', 'concat'], function(){
	gulp.watch('app/assets/scss/**/*.scss',['sass']);
	gulp.watch('*.html', browserSync.reload); 
	gulp.watch('app/assets/js/**/*.js', browserSync.reload);
	gulp.watch('gulpfile.js', ['concat-css', 'concat', 'js-minify']);
});


// Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    files: ['**.*', 'ui/**.*'],
    server: {
      baseDir: 'app'
    },
  })
})