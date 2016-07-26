module.exports = function(context) {
	'use strict';

	var gulp = require('gulp'),
		changed = require('gulp-changed'),
		connect = context.connect,
		sequence = require('run-sequence');

	gulp.task('copy:static', function() {
		return gulp.src(context.configuration.paths.static)
			.pipe(changed(context.configuration.paths.destination))
			.pipe(gulp.dest(context.configuration.paths.destination))
			.pipe(connect.reload());
	});

	gulp.task('copy:images', function() {
		return gulp.src(context.configuration.paths.images)
			.pipe(changed(context.configuration.paths.destination))
			// image conversions come here
			.pipe(gulp.dest(context.configuration.paths.destination))
			.pipe(connect.reload());
	});

	gulp.task('build:javascript', function() {
		return gulp.src(context.configuration.paths.javascript)
			.pipe(changed(context.configuration.paths.destination, { extension: '.js' }))
			// compile, minification and/or uglification come here
			.pipe(gulp.dest(context.configuration.paths.destination))
			.pipe(connect.reload());
	});

	gulp.task('build', function(callback) {
		sequence('copy:static', 'copy:images', 'build:javascript', callback);
	});

};