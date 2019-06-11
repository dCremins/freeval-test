const gulp = require('gulp')
const plumber = require('gulp-plumber')
const autoprefixer = require('autoprefixer')
const cleanCSS = require('gulp-clean-css')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const rev = require('gulp-rev')


gulp.task('sass', ()=> {
  return gulp.src('./src/styles/main.scss')
	  .pipe(plumber())
		.pipe(sourcemaps.init())
	  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename('main'))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest('./holder'))
})

gulp.task('css', gulp.series('sass', ()=>{
  const plugins = [
    cssnano(({ })),
    autoprefixer()
  ]
  return gulp.src('./holder/main')
	  .pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({compatibility: 'ie7'}))
    .pipe(postcss(plugins))
    .pipe(rev())
		.pipe(sourcemaps.write())
		.pipe(rename({extname: ".css"}))
    .pipe(gulp.dest('./build/css'))
    .pipe(rev.manifest('./src/nunjucks/data.json',{
      base:'./src/nunjucks/',
			merge: true // Merge with the existing manifest if one exists
		}))
		.pipe(gulp.dest('./src/nunjucks/'))
}))
