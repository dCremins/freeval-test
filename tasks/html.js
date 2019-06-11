// HTML Rendering of Nunjucks to form a static website

const gulp = require('gulp')
const data = require('gulp-data')
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const nunjucksRender = require('gulp-nunjucks-render')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')

const fs = require('fs')


gulp.task('html', ()=> {
  return gulp.src('./src/*.nunjucks')
		.pipe(plumber())
    .pipe(data(() => {
			return JSON.parse(fs.readFileSync('./src/nunjucks/data.json'))
		}))
    .pipe(nunjucksRender({
      path: ['./src/nunjucks/']
    }))
    .pipe(htmlmin(
      {
        collapseWhitespace: false,
        removeComments: true
      }))
    .pipe(gulp.dest('./build'))
})
