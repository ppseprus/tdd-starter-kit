module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [],
		exclude: [],
		preprocessors: {},
		reporters: ['mocha'],
		mochaReporter: {
			divider: '-'
		},
		plugins: [
			'karma-jasmine',
			'karma-mocha-reporter',
			'karma-phantomjs-launcher'
		],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['PhantomJS'],
		singleRun: true,
		concurrency: Infinity
	});
};
