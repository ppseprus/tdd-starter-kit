module.exports = function(context) {
	'use strict';

	require('./build')(context);
	var util = require('../util');

	var _ = require('lodash'),
		gulp = require('gulp'),
		watch = require('gulp-watch'),
		connect = context.connect,
		sequence = require('run-sequence'),
		karma = require('karma');

	var testCase = [];

	gulp.task('webserver', function(callback) {
		connect.server(context.configuration.webserver);
		callback();
	});

	gulp.task('watch:static', function(callback) {
		gulp.watch(context.configuration.paths.static, ['copy:static']);
		gulp.watch(context.configuration.paths.images, ['copy:images']);
		callback();
	});

	gulp.task('watch:javascript', function() {
		return watch(context.configuration.karma.include, function(vinyl) {
			testCase = util.createTestCase(vinyl);
			sequence('build:javascript', 'test:single');
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
		sequence('build', 'webserver', 'watch:static', 'watch:javascript', callback);
	});

};