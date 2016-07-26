module.exports = function(context) {
	'use strict';

	require('./build')(context);

	var _ = require('lodash'),
		fs = require('fs'),
		gulp = require('gulp'),
		watch = require('gulp-watch'),
		connect = context.connect,
		sequence = require('run-sequence'),
		karma = require('karma');

	var testCase = [];

	function fileExists(file) {
		try {
			fs.statSync(file).isFile();
			return true;
		} catch (e) {
			return false;
		}
	}

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

	gulp.task('webserver', function(callback) {
		connect.server({
			port: context.configuration.webserver.port,
			root: context.configuration.webserver.root,
			livereload: context.configuration.webserver.livereload
		});
		callback();
	});

	gulp.task('watch:static', function(callback) {
		gulp.watch(context.configuration.paths.static, ['copy:static']);
		gulp.watch(context.configuration.paths.images, ['copy:images']);
		callback();
	});

	gulp.task('watch:js', function() {
		return watch(context.configuration.paths.jasmine, function(vinyl) {
			testCase = createTestCase(vinyl);
			sequence('build:js', 'test:single');
		});
	});

	gulp.task('test:single', function(callback) {
		if (testCase.length === 2) {
			var singleFileConfig = {
				configFile: __dirname + context.configuration.karma.karmaconf,
				autoWatch: context.configuration.karma.autowatch,
				singleRun: context.configuration.karma.singlerun,
				port: context.configuration.karma.port,
				colors: context.configuration.karma.colors,
				files: testCase
			};
			new karma.Server(singleFileConfig, _.noop).start();
		}
		testCase = [];
		callback();
	});

	gulp.task('serve', function(callback) {
		sequence('build', 'webserver', 'watch:static', 'watch:js', callback);
	});

};