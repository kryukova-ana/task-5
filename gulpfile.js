'use strict';

const gulp = require( "gulp" );
const rename = require( "gulp-rename" );
const plumber = require( "gulp-plumber" );
const sass = require( "gulp-sass" );
const autoprefixer = require( "gulp-autoprefixer" );
const sourcemaps = require( "gulp-sourcemaps" );
const babel = require('gulp-babel');
const terser = require('gulp-terser');
// const minify = require("gulp-babel-minify");
const imagemin = require( "gulp-imagemin" );
const imageminJpegRecompress = require( "imagemin-jpeg-recompress" );
const pngquant = require( "imagemin-pngquant" );
const cache = require( "gulp-cache" );
const fileinclude = require('gulp-file-include');
const browserSync = require( "browser-sync" ).create();


var path = {
	build: {
		html: 	"build/",
		js: 	"build/assets/js/",
		css: 	"build/assets/css/",
		img: 	"build/assets/img/",
		video: 	"build/assets/video/",
		fonts: 	"build/assets/fonts/"
	},
	src: {
		html: 	"src/**/*.{html,htm}",
		js: 	"src/assets/js/**/*.js",
		css: 	"src/assets/scss/**/*.scss",
		//img: 	"src/assets/img/**/*.*",
		img: 	"src/assets/img/**/**/**/*.{jpg,png,svg,gif,ico}",
		video: 	"src/assets/video/**/*.*",
		fonts: 	"src/assets/fonts/**/*.{eot,ttf,woff,woff2,svg}"
	},
	clean: 		"./build"
};


// HTML
function html ( done ) {
	
	gulp.src( path.src.html )
       	.pipe( plumber() )
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
        .pipe( gulp.dest( path.build.html ) )
		.pipe( browserSync.stream() );
	
	done();	

};


// CSS
function css ( done ) {

	// compressed style
	gulp.src( path.src.css )
		.pipe( plumber() )
		.pipe( sourcemaps.init() )
		.pipe( sass({
			errLogToConsole: true, 
			outputStyle: "compressed"
		}) )
		.on( "error", console.error.bind( console ) )
		.pipe( autoprefixer({
			cascade: true
		}) )
		.pipe( rename({
			suffix: ".min"
		}) )
		//.pipe( sourcemaps.write( "./build/css/" ) )
		.pipe( sourcemaps.write( "." ) )
		.pipe( gulp.dest( path.build.css ) )
		.pipe( browserSync.stream() );

	// expanded style
	gulp.src( path.src.css )
		.pipe( plumber() )
		.pipe( sass({
			errLogToConsole: true, 
			outputStyle: "expanded"
		}) )
		.on( "error", console.error.bind( console ) )
		.pipe( autoprefixer({
			cascade: true
		}) )
		.pipe( gulp.dest( path.build.css ) );

	done();

}


// JS
function js ( done ) {

    gulp.src( path.src.js )
        .pipe( plumber() )
		.pipe( sourcemaps.init() )
        .pipe( gulp.dest( path.build.js ) )
		.pipe( babel() )
		.pipe( terser() )
/*		.pipe(minify({
			mangle: {
			  keepClassName: true
			}
		}))*/
        .pipe( rename({
			suffix: ".min"
		}) )
		.pipe( sourcemaps.write( "." ) )
        .pipe( gulp.dest( path.build.js ) )
		.pipe( browserSync.stream() );
		
	done();

};


// Fonts
function fonts ( done ) {

    gulp.src( path.src.fonts )
       	.pipe( plumber() )
        .pipe( gulp.dest( path.build.fonts ) )
		.pipe( browserSync.stream() );
		
	done();

};


// video
function video ( done ) {

    gulp.src( path.src.video )
       	.pipe( plumber() )
        .pipe( gulp.dest( path.build.video ) )
		.pipe( browserSync.stream() );
		
	done();

};


// IMG
function img ( done ) {

	gulp.src( path.src.img )
		.pipe( plumber() )
		.pipe( gulp.dest( path.build.img ) )
		.pipe( browserSync.stream() );

	gulp.src( path.src.img )
		/*.pipe( plumber() )
		.pipe( cache( imagemin( [
			imagemin.gifsicle( { interlaced: true } ),
			imagemin.jpegtran( { progressive: true } ),
			imageminJpegRecompress( {
				loops: 4,
				min: 70,
				max: 80,
				quality: 'high'
			} ),
			imagemin.svgo(),
			imagemin.optipng( { 
				optimizationLevel: 1 // 0-7
			} ),
			pngquant( { 
				quality: [0.75, 0.95], 
				speed: 5
			} )
		], /*{
			verbose: true
		} ) ) )*/
        .pipe( gulp.dest( path.build.img ) );
	
	done();

};


// browser sync
function sync( done ){

	browserSync.init({
		server: {
			baseDir: path.build.html
		},
		/*
		httpModule: 'http2',
		https: true, 
		*/
		port: 3000, 
		notify: false,
    	open: true
	});

	done();

}

// clear cache
function clearcache( done ){
	cache.clearAll(done);
	done();
}


// watch source files
function watchFiles(){

	gulp.watch( path.src.css, css);
	gulp.watch( path.src.js, js);
	gulp.watch( path.src.html, html);
	gulp.watch( path.src.fonts, fonts);
	gulp.watch( path.src.video, video);
	gulp.watch( path.src.img, img);

}


// exports.default = defaultTask;
// gulp.task( "default", gulp.series( watchSass, sync ) );
gulp.task( "default", gulp.parallel( 
	clearcache,
	css, 
	js, 
	html, 
	fonts, 
	video, 
	img, 
	watchFiles, 
	sync
) );


gulp.task('clearcache', function (done) {
	cache.clearAll(done);
	done();
});