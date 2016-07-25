(function(context){
	'use strict';

	require('./gulp_settings/tasks/build')(context);
	require('./gulp_settings/tasks/serve')(context);
	require('./gulp_settings/tasks/test')(context);

	require('./gulp_settings/tasks/default')(context);

})(require('./gulp_settings/context'));