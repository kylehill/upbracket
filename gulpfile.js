var gulp = require("gulp")
var babel = require("gulp-babel")
var babelCompiler = require("babel/register")
var mocha = require("gulp-mocha")
var gutil = require("gulp-util")

gulp.task("babel", function () {
  return gulp.src("src/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist/js"))
})

gulp.task("mocha", function () {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ 
      reporter: 'min',
      recursive: true,
      compilers: {
        js: babelCompiler
      }
    }))
    .on('error', gutil.log);
})

gulp.task("default", ["mocha"])

gulp.task("watch", function (){
  gulp.watch(["formats/**", "test/**"], ["default"]);
})