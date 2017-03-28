var Helpers = require('./dist/Helpers.js');

module.exports = {
	RichieEditor: require('./dist/RichieContainer.js'),
	RichieUtils: {
		createEmptyEditorState: Helpers.createEmptyEditorState,
		createEditorStateWithContent: Helpers.createEditorStateWithContent
	}
};