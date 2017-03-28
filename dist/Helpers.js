(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'draft-js', 'react'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('draft-js'), require('react'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.draftJs, global.react);
		global.Helpers = mod.exports;
	}
})(this, function (exports, _draftJs, _react) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createEditorStateWithContent = exports.createEmptyEditorState = exports.decorator = exports.collapseSelectionToEnd = exports.getCharCount = exports.getWordCount = undefined;

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function findLinkEntities(contentBlock, callback) {
		contentBlock.findEntityRanges(function (character) {
			var entityKey = character.getEntity();
			return entityKey !== null && _draftJs.Entity.get(entityKey).getType() === 'LINK';
		}, callback);
	}

	var getWordCount = exports.getWordCount = function getWordCount(editorState) {
		var plainText = editorState.getCurrentContent().getPlainText('');
		var regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
		var cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
		var wordArray = cleanString.match(/\S+/g); // matches words according to whitespace
		return wordArray ? wordArray.length : 0;
	};

	var getCharCount = exports.getCharCount = function getCharCount(editorState) {
		//const decodeUnicode = (str) => punycode.ucs2.decode(str); // func to handle unicode characters
		var plainText = editorState.getCurrentContent().getPlainText('');
		var regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
		var cleanString = plainText.replace(regex, '').trim(); // replace above characters w/ nothing
		//return decodeUnicode(cleanString).length;
		return cleanString.length;
	};

	var collapseSelectionToEnd = exports.collapseSelectionToEnd = function collapseSelectionToEnd(selectionState, editorState) {
		var collapsed = selectionState.merge({
			anchorOffset: selectionState.getEndOffset(),
			focusOffset: selectionState.getEndOffset()
		});
		return _draftJs.EditorState.forceSelection(editorState, collapsed);
	};

	var decorator = exports.decorator = new _draftJs.CompositeDecorator([{
		strategy: findLinkEntities,
		component: function component(props) {
			if (props.entityKey) {
				var href = _draftJs.Entity.get(props.entityKey).getData().url;
				return _react2.default.createElement(
					'a',
					{ href: href, className: 'rich-editor_editor_link' },
					props.children
				);
			} else {
				return _react2.default.createElement(
					'a',
					{ href: '', className: 'rich-editor_editor_link' },
					props.children
				);
			}
		}
	}]);

	var createEmptyEditorState = exports.createEmptyEditorState = function createEmptyEditorState() {
		return _draftJs.EditorState.createEmpty(decorator);
	};

	var createEditorStateWithContent = exports.createEditorStateWithContent = function createEditorStateWithContent(content) {
		return _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(content), decorator);
	};
});