const gulp = require('gulp')
const plumber = require('gulp-plumber')
const autoprefixer = require('autoprefixer')
const cleanCSS = require('gulp-clean-css')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const minimist = require('minimist')
const rev = require('gulp-rev')

const knownOptions = {
  string: 'root',
  string: 'home',
  default: {
    root: 'default',
    home: 'itredatalab.org'
  }
}
const options = minimist(process.argv.slice(2), knownOptions)


gulp.task('sass', ()=> {
  return gulp.src(options.root+'/src/styles/main.scss')
	  .pipe(plumber())
		.pipe(sourcemaps.init())
	  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename('main'))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest(options.root+'/holder'))
})

gulp.task('sass-python', ()=> {
  return gulp.src(options.root+'/src/styles/main.scss')
	  .pipe(plumber())
		.pipe(sourcemaps.init())
	  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename('main.css'))
    .pipe(rev())
		.pipe(sourcemaps.write())
    .pipe(gulp.dest(options.root+'/build/assets'))
})

gulp.task('css', gulp.series('sass', ()=>{
  const plugins = [
    mqpacker({ sort: true }),
    cssnano(({ })),
    autoprefixer()
  ]
  return gulp.src(options.root+'/holder/main')
	  .pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({compatibility: 'ie7'}))
    .pipe(postcss(plugins))
    .pipe(rev())
		.pipe(sourcemaps.write())
		.pipe(rename({extname: ".css"}))
    .pipe(gulp.dest(options.root+'/build/css'))
    .pipe(rev.manifest(options.root+'/src/nunjucks/data.json',{
      base:options.root+'/src/nunjucks/',
			merge: true // Merge with the existing manifest if one exists
		}))
		.pipe(gulp.dest(options.root+'/src/nunjucks/'))
}))
