'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

function watchErrors () {
	return $.plumber(function (err) {
		$.util.beep();
		$.util.log($.util.colors.red(err));
		this.emit('end');
	})
}

var settings = {
	files: {
		sass: [
			'./css/custom.scss'
		],
		css: [
			'./css/bootstrap.css',
			'./css/font-awesome.css',
			'./css/custom.css'
		],
		js: [
			// './js/tether.js',
			'./js/jquery.js',
			'./js/bootstrap.js',
			'./js/custom.js'
		],
		fonts: [
			'./fonts/fonts.ini'
		]
	}
};

gulp.task('sass', function () {
	return gulp.src(settings.files.sass)
		.pipe(watchErrors())
		.pipe($.sass())
		.pipe(gulp.dest('./css'));
});

gulp.task('css', ['sass'], function () {
	return gulp.src(settings.files.css)
		.pipe(watchErrors())
		.pipe($.sourcemaps.init({
			loadMaps: true
		}))
		.pipe($.cssretarget({
			root: './dist',
			silent: true
		}))
		.pipe($.concat('styles.css'))
		.pipe($.cssnano({
			discardComments: {removeAll: true},
			autoprefixer: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9', 'Android 2.3'],
				add: true
			}
		}))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function () {
	return gulp.src(settings.files.js)
		.pipe(watchErrors())
		.pipe($.sourcemaps.init({
			loadMaps: true
		}))
		.pipe($.concat('scripts.min.js'))
		.pipe($.stripDebug())
		.pipe($.uglify())
		.pipe($.babel({
			presets: ['es2015'],
			compact: false,
			minified: true,
			comments: false,
		}))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('fonts', function () {
	return gulp.src(settings.files.fonts)
		.pipe($.googleFontsBase64Css())
		.pipe($.concat('fonts.css'))
		.pipe($.cssnano({
			discardComments: {removeAll: true},
			discardUnused: false
		}))
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('browserSync', ['default'], function () {
	browserSync.init({
		proxy: '_brychta-name.mab.loc/'
	});
	gulp.watch(settings.files.sass, ['sass']);
	gulp.watch(settings.files.css, ['css']);
});

gulp.task('default', ['css', 'js', 'fonts'], function () {});