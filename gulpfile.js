var _ = require('lodash'),
	fs = require('fs'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	changed = require('gulp-changed'),
	livereload = require('gulp-livereload'),
	sequence = require('run-sequence'),
	karma = require('karma');


// NOTE: paths should be moved to another file
var paths = {
	karmaconf: '/karma.conf.js',
	js: {
		src: ['./src/**/*.js', '!./src/**/*.spec.js'],
		dest: './build/**/*.js',
		dest_dir: './build',
	},
	jasmine: {
		src: './src/**/*.js'
	},
	images: {
		src: './src/**/*.{jpg,png,gif}',
		dest_dir: './build'
	},
	html: { 
		src: './src/**/*.html',
		dest: './build/**/*.html',
		dest_dir: './build'
	}
};


// NOTE: basic functions should be moved to another file
function fileExists(file) {
	try {
		fs.statSync(file).isFile();
		return true;
	} catch (e) {
		return false;
	}
}


// lsit of files when a single test is run
var testCase = [];

// livereload server
var server;
gulp.task('livereload', function(callback) {
	server = livereload();
	callback();
});


// BUILD

gulp.task('copy:images', function() {
	return gulp.src(paths.images.src)
		.pipe(changed(paths.images.dest_dir))
		//.pipe(imagemin())
		.pipe(gulp.dest(paths.images.dest_dir));
});

gulp.task('copy:html', function() {
	return gulp.src(paths.html.src)
		.pipe(changed(paths.html.dest_dir))
		.pipe(gulp.dest(paths.html.dest_dir));
});

gulp.task('build:js', function() {
	return gulp.src(paths.js.src)
		.pipe(changed(paths.js.dest_dir, { extension: '.js' }))
		.pipe(gulp.dest(paths.js.dest_dir));
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
	gulp.watch(paths.images.src, ['copy:images']);
	gulp.watch(paths.html.src, ['copy:html']);
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
	sequence('copy:images', 'copy:html', 'build:js', callback);
});

gulp.task('serve', function(callback) {
	sequence('build', 'livereload', 'watch:js', 'watch:static', callback);
});

gulp.task('default', ['serve']);