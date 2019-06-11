const gulp = require('gulp')
const concat = require('gulp-concat')
const del = require('del')
const minimist = require('minimist')
const optimizejs = require('gulp-optimize-js')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const composer = require('gulp-uglify/composer')
const uglify = require('uglify-es')
const rev = require('gulp-rev')
const minify = composer(uglify, console)

const knownOptions = {
  string: 'root',
  string: 'home',
  default: {
    root: 'default',
    home: 'itredatalab.org'
  }
}
const options = minimist(process.argv.slice(2), knownOptions)

gulp.task('javascript-concat', () => {
	return gulp.src(options.root+'/src/scripts/*.js')
		.pipe(plumber())
		.pipe(concat({path: 'bundled.js', cwd: ''}))
		.pipe(minify())
    .pipe(optimizejs())
		.pipe(rename('bundled'))
		.pipe(gulp.dest(options.root+'/holder/'))
})

gulp.task('javascript', gulp.series('javascript-concat', ()=>{
  return gulp.src(options.root+'/holder/bundled')
		.pipe(plumber())
    .pipe(rev())
		.pipe(rename({extname: ".js"}))
		.pipe(gulp.dest(options.root+'/build'))
    .pipe(rev.manifest(options.root+'/src/nunjucks/data.json',{
      base:options.root+'/src/nunjucks/',
			merge: true // Merge with the existing manifest if one exists
		}))
		.pipe(gulp.dest(options.root+'/src/nunjucks/'))
}))

gulp.task('javascript-python', gulp.series('javascript-concat', ()=>{
  return gulp.src(options.root+'/holder/bundled')
    .pipe(plumber())
    .pipe(rename('bundled.min.js'))
    .pipe(gulp.dest(options.root+'/build/assets'))
}))
