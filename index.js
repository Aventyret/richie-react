var Helpers = require('./dist/Helpers.js');
var RichieEditor = require('./dist/RichieContainer.js').default;

module.exports = {
	RichieEditor: RichieEditor,
	RichieUtils: {
		createEmptyEditorState: Helpers.createEmptyEditorState,
		createEditorStateWithContent: Helpers.createEditorStateWithContent
	}
};