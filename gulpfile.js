const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const sass = require('gulp-sass');
const del = require('del');
const gulpCopy = require('gulp-copy');
const dist = './docs';

function taskClean(cb) {
    return del([dist], cb);
}


function taskInject() {
    const sources = gulp.src(['*.js', '*.css'], {read: false, cwd: dist});
    return gulp.src('./src/index.html')
        .pipe(inject(sources, {relative: true, ignorePath: '../dist'}))
        .pipe(gulp.dest(dist));
}


function taskTransfer() {
    return gulp.src('./src/img/*')
        .pipe(gulpCopy(dist + '/img', {prefix: 2}))
}


function taskBrowserSync() {
    browserSync.init({
        server: {
            baseDir: dist,
        },
    });

    gulp.watch('./src/index.html', ['inject']);
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch(dist + '/*').on('change', browserSync.reload)
}

function taskSass() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist));            
}

function taskWatch() {
    taskTransfer();
    taskSass();
    return taskBrowserSync();
}

gulp.task('clean', taskClean);
gulp.task('sass', taskSass);
gulp.task('transfer', taskTransfer);
gulp.task('browserSync', taskBrowserSync);
gulp.task('watch', taskWatch);
gulp.task('inject', taskInject);

gulp.task('build', [
    'transfer',
    'sass',
    ],
    taskInject
);

gulp.task('default', ['build', 'watch']);