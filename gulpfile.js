let gulp = require("gulp"),
  sass = require("gulp-sass"),
  rename = require("gulp-rename"),
  browserSync = require("browser-sync"),
  autoprefixer = require("gulp-autoprefixer"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  cssmin = require("gulp-cssmin"),
  fileInclude = require("gulp-file-include");

gulp.task("sass", function () {
  return gulp
    .src("app/scss/style.scss")
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 8 versions"],
      })
    )
    .pipe(gulp.dest("./docs/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("script", function () {
  return gulp
    .src([
      "node_modules/swiper/swiper-bundle.js",
    ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./docs/js"));
});

gulp.task("style", function () {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      "node_modules/swiper/swiper-bundle.css",
    ])
    .pipe(concat("libs.min.css"))
    .pipe(cssmin())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("html", function () {
  return gulp.src(['app/*.html', '!app/parts/**/*.html'])
    .pipe(fileInclude({
      prefix: "@@",
      basepath: '@file'
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("font", function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('./docs/fonts'));
});

gulp.task("images", function () {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('./docs/images'));
});

gulp.task("js", function () {
  return gulp.src("app/js/**/*.js")
    .pipe(gulp.dest('./docs/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./docs/",
    },
  });
});

gulp.task("watch", function () {
  gulp.watch("app/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("app/**/*.html", gulp.parallel("html"));
  gulp.watch("app/js/**/*.js", gulp.parallel("js"));
  gulp.watch("app/images/**/*.*", gulp.parallel("images"));
  gulp.watch("app/fonts/**/*.*", gulp.parallel("font"));
});

gulp.task(
  "default",
  gulp.parallel("images", "html", "font", "style", "script", "js", "sass", "watch", "browser-sync")
);