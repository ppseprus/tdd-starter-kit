var _ = require('lodash'),
	fs = require('fs');

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

module.exports = {
	fileExists: fileExists,
	createTestCase: createTestCase
};
