var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require("gulp-rename");
var watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var gcmq = require('gulp-group-css-media-queries');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();
const posthtml = require ('gulp-posthtml')
var prettify = require('gulp-prettify');
var posthtmlAttrsSorter = require('posthtml-attrs-sorter');
var concat = require('gulp-concat');
var babel = require("gulp-babel");
const del = require('del');
var wait = require('gulp-wait')

const dest = './build';
const src = './app';
const server = '../../../Progs/OSPanel/domains/build';

const htmlPrettifyConfig = {
    unformatted: ["pre", "code", "textarea", "script"],
    indent_char: " ",
    indent_size: 4,
    preserve_newlines: true,
    brace_style: "expand",
    end_with_newline: true
};

const posthtmlConfig = {
    plugins: [
        posthtmlAttrsSorter({
            order: [
                "class",
                "id",
                "name",
                "data",
                "ng",
                "src",
                "for",
                "type",
                "href",
                "values",
                "title",
                "alt",
                "role",
                "aria"
            ]
        })
    ],
    options: {}
};

gulp.task('images', function () {
    return gulp.src(src + '/img/**/*')
        .pipe(gulp.dest(dest + '/img'))
});

gulp.task('style', function () {
    return gulp.src([src + '/scss/**/*.sass'])
        .pipe(plumber())
        .pipe(wait(100))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(gulp.dest(dest + '/css'))
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest + '/css'))
        .pipe(browserSync.stream())
})

gulp.task('pug', function () {
    return gulp.src(src + "/*.pug")
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(posthtml(posthtmlConfig.plugins, posthtmlConfig.options))
        .pipe(prettify(htmlPrettifyConfig))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream());
});

gulp.task('concatJs', function () {
    return gulp.src([
            src + '/libs/js/jquery.min.js',
            src + '/libs/js/slick.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            './node_modules/@fortawesome/fontawesome-free/js/all.js',
            './node_modules/swiper/swiper-bundle.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest + '/libs/js'))
        .pipe(browserSync.stream())
})

gulp.task('concatCss', function () {
    return gulp.src(src + '/libs/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest + '/libs/css'))
        .pipe(browserSync.stream())
})

gulp.task('html', function () {
    return gulp.src(src + '/*.html')
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream())
})

gulp.task('php', function () {
    return gulp.src(src + '/**/*.php')
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream())
})

gulp.task('js', function () {
    return gulp.src(src + '/js/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest(dest + '/js'))
        .pipe(browserSync.stream())
})

gulp.task('watch', function () {
    gulp.watch(src + '/scss/**/*.sass', gulp.series('style'));
    gulp.watch(src + '/libs/js/**/*.js', gulp.series('concatJs'));
    gulp.watch(src + '/libs/css/**/*.js', gulp.series('concatCss'));
    gulp.watch(src + '/**/*.pug', gulp.series('pug'));
    gulp.watch(src + '/**/*.html', gulp.series('html'));
    gulp.watch(src + '/js/**/*.js', gulp.series('js'));
    gulp.watch(src + '/**/*.php', gulp.series('php'));
    gulp.watch(src + '/img/**/*', gulp.series('images'))
})

gulp.task('default', gulp.series('concatJs', 'concatCss', 'watch'));
