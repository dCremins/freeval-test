
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const del = require('del')
const gzip = require('gulp-gzip')
const log = require('fancy-log')
const plumber = require('gulp-plumber')
const minimist = require('minimist')

const HubRegistry = require('gulp-hub');
const hub = new HubRegistry(['tasks/*.js']);

gulp.registry(hub);

const knownOptions = {
  string: 'root',
  string: 'home',
  string: 'style',
  default: {
    root: 'default',
    home: 'itredatalab.org',
    style: 'static'
  }
}
const options = minimist(process.argv.slice(2), knownOptions)

const tasks = {
  style: true,
  script: true,
  blog: false,
  html: false,
  python: false,
  images: true,
  favicon: true,
  gzip: false
}

switch(options.style) {
  case 'blog':
    tasks.blog = true
    break
  case 'python':
    tasks.python = true
    break
  default:
    tasks.html = true
    tasks.gzip = true
    break
}

gulp.task('skip', (done) => {
  done()
})

gulp.task('gzip', () => {
	return gulp.src([
    options.root+'/build/*.js',
    options.root+'/build/*.html',
    options.root+'/build/css/*.css'
  ])
		.pipe(plumber())
    .pipe(gzip())
		.pipe(gulp.dest(options.root+'/build'))
})

gulp.task('serve', function(done) {
  browserSync.init({
    server: {
      baseDir: options.root+'/build'
    }
  }, function (err, bs) {
    bs.addMiddleware("*", require('connect-gzip-static')(options.root+'/build'), {
      override: false
    })
  })
  gulp.watch(options.root+'/src/nunjucks/**/*', gulp.series('html', 'gzip', 'reload'))
  gulp.watch(options.root+'/src/styles/**/*', gulp.series(()=>{return del([options.root+'/build/css', options.root+'/build/**/*.html', options.root+'/build/**/*.gz'])}, 'css', 'reload'))
  gulp.watch(options.root+'/src/scripts/**/*', gulp.series('javascript', 'reload'))
  done();
})

gulp.task('reload', (done)=> {
  browserSync.reload()
  done();
})

gulp.task('clear', ()=> {
  return del([
    options.root+'/build/css',
    options.root+'/build/**/*.html',
    options.root+'/build/**/*.js',
    options.root+'/build/**/*.gz'
  ])
})

gulp.task('serve-python', ()=> {
  return gulp.src(options.root+'/src/python/**.*')
	  .pipe(plumber())
    .pipe(gulp.dest(options.root+'/build'))
})

gulp.task('compile', gulp.series(
  ()=>{ return del(options.root+'/build') },
  tasks.script ? 'javascript' : 'skip',
  tasks.style ? 'css' : 'skip',
  tasks.images ? 'images' : 'skip',
  tasks.images ? 'imageMin' : 'skip',
  tasks.favicon ? 'favicon' : 'skip',
  tasks.blog ? 'markdown' : 'skip',
  tasks.html ? 'html' : 'skip',
  tasks.gzip ? 'gzip' : 'skip',
  ()=>{ return del(options.root+'/holder') }
))

gulp.task('compile-python', gulp.series(
  ()=>{ return del(options.root+'/build') },
  tasks.script ? 'javascript-python' : 'skip',
  tasks.style ? 'sass-python' : 'skip',
  tasks.images ? 'images' : 'skip',
  tasks.images ? 'imageMin' : 'skip',
  tasks.favicon ? 'favicon' : 'skip',
  'html-python',
  tasks.gzip ? 'gzip' : 'skip'
))

gulp.task('compile-pretty', gulp.series(
  ()=>{ return del(options.root+'/build') },
  'javascript',
  'css',
  'images',
  'imageMin',
  'favicon',
  'html-pretty'
))

gulp.task('quick-compile', gulp.series(()=>{
  return del([
    options.root+'/build/css',
    options.root+'/build/**/*.html',
    options.root+'/build/**/*.js',
    options.root+'/build/**/*.gz'
  ])
}, 'javascript', 'css', 'html', 'gzip'))

gulp.task('build', gulp.series(
  tasks.python ? 'compile-python' : 'compile',
  tasks.python ? 'serve-python' : 'serve'))
