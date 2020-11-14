'use script';

var {src, dest, watch, series} = require('gulp');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var  minify  =  require ('gulp-minify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
// var tinypng = require('gulp-tinypng-compress');

function bs() {
	serveSass();
	browserSync.init({
			server: {
					baseDir: "./"
			},
			socket: {
				domain: "localhost:3001"
			}
	});
	watch("./*.html").on('change', browserSync.reload);
	watch("./sass/**/*.sass", serveSass);
	watch("./sass/**/*.scss", serveSass);
	watch("js/**/*.js").on('change', browserSync.reload);
}

function css(done) {
	src('css/**/**.css')
			.pipe(autoprefixer({
				cascade: false
			}))
			.pipe(cleanCSS ({ совместимость :  'ie8'}))
			.pipe(dest('dist/css'));
	done();
}

	function js(done) {
	src(['js/**.js', '!js/**.min.js'])
		.pipe(minify({
			ext: {
				min: '.js'
			}
		}))
		.pipe(dest('dist/js'));
	src('js/**.min.js').pipe(dest('dist/js'));
	done();
}

function html(done) {
	src('**.html').pipe(htmlmin({ collapseWhitespace: true})).pipe(dest('dist/'));
	done();
}

function php(done) {
	src('**.php').pipe(dest('dist/'));
	src('phpmailer/**/**').pipe(dest('dist/phpmailer/'));
	done();
}

function fonts(done) {
	src('fonts/**/**').pipe(dest('dist/fonts'));
		done();
	}

function imagemin(done) {
	src(['img/**/**/*.jpg', 'img/**/**/*.png'])
	.pipe(tinypng({
		key: 'V2q52Q3BZrYfqFNj1cySy9Gt9n3kRfDQ'
	}))
	.pipe(dest('dist/img/'));
	src('img/**/**/*.svg')
	.pipe(dest('dist/img/'));
	done();
}

function serveSass() {
	return src('./sass/**/*.sass', './sass/**/*.scss')
    .pipe(sass())
		.pipe(dest('./css'))
		.pipe(browserSync.stream());
}


exports.serve = bs;
exports.build = series(css, js, html, php, fonts, imagemin);