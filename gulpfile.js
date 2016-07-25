var _ = require('lodash'),
	fs = require('fs'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	changed = require('gulp-changed'),
	connect = require('gulp-connect'),
	sequence = require('run-sequence'),
	karma = require('karma');


// NOTE: basic functions should be moved to another file
function fileExists(file) {
	try {
		fs.statSync(file).isFile();
		return true;
	} catch (e) {
		return false;
	}
}


const WEBSERVER_PORT = 9000;
const WEBSERVER_ROOT = 'build';
const TEST_FILE_SUFFIX = '.spec';


// NOTE: paths should be moved to another file
var paths = {
	karmaconf: '/karma.conf.js',
	static: { 
		src: './src/**/*.{html,css,json}',
		dest_dir: './build'
	},
	images: {
		src: './src/**/*.{jpg,png,gif}',
		dest_dir: './build'
	},
	js: {
		src: ['./src/**/*.js', `!./src/**/*${TEST_FILE_SUFFIX}.js`],
		dest: './build/**/*.js',
		dest_dir: './build',
	},
	jasmine: {
		src: './src/**/*.js'
	}
};


// lsit of files when a single test is run
var testCase = [];


// livereload
gulp.task('livereload', function(callback) {
	connect.server({
		port: WEBSERVER_PORT,
		root: WEBSERVER_ROOT,
		livereload: true
	});
	callback();
});


// BUILD

gulp.task('copy:static', function() {
	return gulp.src(paths.static.src)
		.pipe(changed(paths.static.dest_dir))
		.pipe(gulp.dest(paths.static.dest_dir))
		.pipe(connect.reload());
});

gulp.task('copy:images', function() {
	return gulp.src(paths.images.src)
		.pipe(changed(paths.images.dest_dir))
		// image conversions comes here
		.pipe(gulp.dest(paths.images.dest_dir))
		.pipe(connect.reload());
});

gulp.task('build:js', function() {
	return gulp.src(paths.js.src)
		.pipe(changed(paths.js.dest_dir, { extension: '.js' }))
		// compile, minification and/or uglification comes here
		.pipe(gulp.dest(paths.js.dest_dir))
		.pipe(connect.reload());
});


// SERVE / WATCH

function createTestCase(vinyl) {
	var files = [];
	if (!_.isUndefined(vinyl.path) && _.includes(['add', 'change'], vinyl.event)) {
		var correspondingFile;
		if (/\.spec/g.test(vinyl.path)) {
			correspondingFile = vinyl.path.replace('.spec','');
		} else {
			correspondingFile = vinyl.path.replace('.js','.spec.js');
		}

		files.push(vinyl.path);
		if (fileExists(correspondingFile)) {
			files.push(correspondingFile);
		}
	}
	return files;
}

gulp.task('watch:js', function() {
	return watch(paths.jasmine.src, function(vinyl) {
		testCase = createTestCase(vinyl);
		sequence('build:js', 'test:single');
	});
});

gulp.task('watch:static', function(callback) {
	gulp.watch(paths.static.src, ['copy:static']);
	gulp.watch(paths.images.src, ['copy:images']);
	callback();
});


// TEST

gulp.task('test:single', function(callback) {
	if (testCase.length === 2) {
		var singleFileConfig = {
			configFile: __dirname + paths.karmaconf,
			autoWatch: true,
			singleRun: true,
			files: testCase
		};
		new karma.Server(singleFileConfig, _.noop).start();
	}
	testCase = [];
	callback();
});

gulp.task('test', function(callback) {
	new karma.Server({
		configFile: __dirname + paths.karmaconf,
		autoWatch: true,
		singleRun: true,
		files: paths.js.src
	}).start();
	callback();
});


// DEFAULTS

gulp.task('build', function(callback) {
	sequence('copy:static', 'copy:images', 'build:js', callback);
});

gulp.task('serve', function(callback) {
	sequence('build', 'livereload', 'watch:static', 'watch:js', callback);
});

gulp.task('default', ['serve']);