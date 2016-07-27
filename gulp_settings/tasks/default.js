module.exports = function(context) {
	'use strict';

	require('./serve')(context);

	var gulp = require('gulp');

	gulp.task('default', ['serve']);

};
