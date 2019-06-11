const gulp = require('gulp')
const concat = require('gulp-concat')
const del = require('del')
const optimizejs = require('gulp-optimize-js')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const composer = require('gulp-uglify/composer')
const uglify = require('uglify-es')
const rev = require('gulp-rev')
const minify = composer(uglify, console)


gulp.task('javascript-concat', () => {
	return gulp.src('./src/scripts/*.js')
		.pipe(plumber())
		.pipe(concat({path: 'bundled.js', cwd: ''}))
		.pipe(minify())
    .pipe(optimizejs())
		.pipe(rename('bundled'))
		.pipe(gulp.dest('./holder/'))
})

gulp.task('javascript', gulp.series('javascript-concat', ()=>{
  return gulp.src('./holder/bundled')
		.pipe(plumber())
    .pipe(rev())
		.pipe(rename({extname: ".js"}))
		.pipe(gulp.dest('./build'))
    .pipe(rev.manifest('./src/nunjucks/data.json',{
      base:'./src/nunjucks/',
			merge: true // Merge with the existing manifest if one exists
		}))
		.pipe(gulp.dest('./src/nunjucks/'))
}))
