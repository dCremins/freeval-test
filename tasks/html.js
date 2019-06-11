// HTML Rendering of Nunjucks to form a static website

const gulp = require('gulp')
const data = require('gulp-data')
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const nunjucksRender = require('gulp-nunjucks-render')
const plumber = require('gulp-plumber')
const prettyHtml = require('gulp-pretty-html')
const rename = require('gulp-rename')
const minimist = require('minimist')

const fs = require('fs')

const knownOptions = {
  string: 'root',
  string: 'home',
  default: {
    root: 'default',
    home: 'itredatalab.org'
  }
}
const options = minimist(process.argv.slice(2), knownOptions)

gulp.task('html', ()=> {
  return gulp.src(options.root+'/src/*.nunjucks')
		.pipe(plumber())
    .pipe(data(() => {
			return JSON.parse(fs.readFileSync(options.root+'/src/nunjucks/data.json'))
		}))
    .pipe(nunjucksRender({
      path: [options.root+'/src/nunjucks/']
    }))
    .pipe(htmlmin(
      {
        collapseWhitespace: false,
        removeComments: true
      }))
    .pipe(gulp.dest(options.root+'/build'))
})

gulp.task('html-python', ()=> {
  return gulp.src(options.root+'/src/*.nunjucks')
		.pipe(plumber())
    .pipe(data(() => {
			return JSON.parse(fs.readFileSync(options.root+'/src/python/data.json'))
		}))
    .pipe(nunjucksRender({
      path: [options.root+'/src/nunjucks/']
    }))
    .pipe(prettyHtml())
    .pipe(gulp.dest(options.root+'/build'))
})
