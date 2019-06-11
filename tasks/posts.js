// HTML Rendering of Nunjucks and Markdown to form a blog style website

const gulp = require('gulp')
const data = require('gulp-data')
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const jsoncombine = require("gulp-jsoncombine")
const log = require('fancy-log')
const markdownToJSON = require('gulp-markdown-to-json')
const marked = require('marked')
const nunjucksRender = require('gulp-nunjucks-render')
const plumber = require('gulp-plumber')
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

marked.setOptions({
  pedantic: true,
  smartypants: true
})

// Create JSON files from any markdown files
gulp.task('markdown_json', () => {
   return gulp.src('./default/src/markdown/**/*.md')
 		.pipe(plumber())
    .pipe(markdownToJSON(marked))
    .pipe(gulp.dest('./default/src/test'))
})

// Combine markdown JSON to form the blog posts JSON data file
gulp.task('json_concat', () => {
   return gulp.src(options.root+'/src/test/**/*.json')
 		.pipe(plumber())
    .pipe(jsoncombine("bundled.json",function(data, meta){
      return Buffer.from(JSON.stringify(data))
    }))
    .pipe(gulp.dest(options.root+'/src/test/'))
})

// Pass the data files to the nunjuck templates to render as HTML
gulp.task('json_nunjucks', (done) => {
  const postsData = JSON.parse(fs.readFileSync(options.root + '/src/test/bundled.json'))
  const jucksData = JSON.parse(fs.readFileSync(options.root+'/src/nunjucks/data.json'))
  let tags = {}

  // Pass navigation info to the posts and tags archives
  if (jucksData.navigation) {
    postsData.navigation = jucksData.navigation
    tags.navigation = jucksData.navigation
  } else {
    postsData.navigation = ['index']
    tags.navigation = ['index']
  }

  // Create Posts
  if (postsData) {
    for ( let post in postsData) {
      // Skip Navigation
      if (post === 'navigation') {
        continue
      }
      // Create data for Tag Archives
      for ( let index in postsData[post].tags) {
        const tag = postsData[post].tags[index]
        if (tags.hasOwnProperty(tag)) {
          tags[tag].posts.push(postsData[post])
        } else {
          tags[tag] = {
            title: tag,
            slug: tag.replace(/[\W]/g, '_').toLowerCase(),
            posts: [postsData[post]]
          }
        }
      }
      postsData[post].navigation = postsData.navigation
      // Send data to posts template
      gulp.src(options.root+'/src/nunjucks/post.nunjucks')
      .pipe(plumber())
      .pipe(nunjucksRender({
        path: [options.root+'/src/nunjucks/'],
        data: postsData[post]
      }))
      .pipe(htmlmin(
        {
          collapseWhitespace: false,
          removeComments: true
        }))
      .pipe(rename('index.html'))
      .pipe(gulp.dest(options.root+'/build/posts/'+postsData[post].slug))
    }

    // Send data to archive template
    for (let index in tags) {
      if (index === 'navigation') {
        continue
      }
      tags[index].navigation = tags.navigation
      gulp.src(options.root+'/src/nunjucks/archive.nunjucks')
      .pipe(plumber())
      .pipe(data(tags[index]))
      .pipe(nunjucksRender({
        path: [options.root+'/src/nunjucks/']
      }))
      .pipe(htmlmin({
        collapseWhitespace: false,
        removeComments: true
      }))
      .pipe(rename(tags[index].slug+'.html'))
      .pipe(gulp.dest(options.root+'/build'))
    }
  // Send an error if Blog task was called without a blog data file
  } else {
    log.error('Posts data file could not be found')
  }

  // Send data to page templates
  if (jucksData) {
    gulp.src(options.root+'/src/*.nunjucks')
      .pipe(plumber())
      .pipe(data(jucksData))
      .pipe(nunjucksRender({
        path: [options.root+'/src/nunjucks/']
      }))
      .pipe(htmlmin({
        collapseWhitespace: false,
        removeComments: true
      }))
      .pipe(gulp.dest(options.root+'/build'))
// Send an error if Blog task was called without a main data file
  } else {
    log.error('Nunjucks data file could not be found')
  }
// End the gulp task
  done()
})


gulp.task('markdown', gulp.series(
  'markdown_json',
  'json_concat',
  'json_nunjucks',
  ()=>{ return del(options.root+'/src/test') }
))
