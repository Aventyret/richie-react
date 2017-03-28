var helpers = require('./dist/helpers.js');

module.exports = {
	RichieEditor: require('./dist/RichieContainer.js'),
	RichieUtils: {
		createEmptyEditorState: helpers.createEmptyEditorState,
		createEditorStateWithContent: helpers.createEditorStateWithContent
	}
};