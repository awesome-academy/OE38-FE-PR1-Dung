// khai báo các module được sử dụng:
const { src, dest, parallel, watch, series } = require("gulp"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass")(require('sass')),
  pug = require("gulp-pug"),
  browserSync = require("browser-sync").create();

// Khai báo đường dẫn của các nhóm files:

const FilesPath = {
  sassFiles: "scss/*.scss",
  htmlFiles: "pug/pages/*.pug",
};
const { sassFiles, htmlFiles } = FilesPath;

// Xử việc biên dịch các file Sass thành file css, nối tất cả các file thành 1 file css và lưu ở thư mục dist/css.
// browserSync.stream() ở đây dùng để gọi event reload trang trong trường hợp chúng ta muốn sử dụng live reload
function sassTask() {
  return src(sassFiles)
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}



// Biên dịch các file pug ở thư mục pages và lưu chúng vào thư mục dist/
function htmlTask() {
  return src(htmlFiles)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

// Copy các file tài nguyên vào thư mục dist
function assetsTask() {
  return src('assets/**')
    .pipe(dest('dist/assets'))
    .pipe(browserSync.stream());
}


// Hỗ trợ việc tạo một server với live reload để thuận lợi trong việc code
function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  watch('scss/**/*.scss', sassTask);
  watch('pug/**/*.pug', htmlTask);
  watch('assets/**', assetsTask);
}


// Cuối cùng, để gọi các task gulp bằng dòng lệnh, ta thêm đoạn code sau:

exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, assetsTask));
