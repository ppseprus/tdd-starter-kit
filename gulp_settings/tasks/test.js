module.exports = function(context) {
	'use strict';

	require('./serve')(context);

	var gulp = require('gulp'),
		sequence = require('run-sequence'),
		karma = require('karma');

	gulp.task('test:all', function(callback) {
		new karma.Server({
			configFile: __dirname + context.configuration.karma.karmaconf,
			autoWatch: context.configuration.karma.autowatch,
			singleRun: context.configuration.karma.singlerun,
			port: context.configuration.karma.port,
			colors: context.configuration.karma.colors,
			files: context.configuration.paths.javascript
		}).start();
		callback();
	});

	gulp.task('test', function(callback) {
		sequence('build', 'test:all', callback);
	});

};