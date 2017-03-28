(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'react', 'lodash', 'draft-js', 'classnames', './Helpers', './RichieView'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('react'), require('lodash'), require('draft-js'), require('classnames'), require('./Helpers'), require('./RichieView'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.lodash, global.draftJs, global.classnames, global.Helpers, global.RichieView);
		global.RichieContainer = mod.exports;
	}
})(this, function (exports, _react, _lodash, _draftJs, _classnames, _Helpers, _RichieView) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _lodash2 = _interopRequireDefault(_lodash);

	var Draft = _interopRequireWildcard(_draftJs);

	var _classnames2 = _interopRequireDefault(_classnames);

	var EditorHelpers = _interopRequireWildcard(_Helpers);

	var _RichieView2 = _interopRequireDefault(_RichieView);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};

	var INLINE_STYLE_FUNCTIONS = [{
		key: 'BOLD',
		label: 'Fet',
		icon: 'bold'
	}, {
		key: 'ITALIC',
		label: 'Kursiv',
		icon: 'italic'
	}];

	var BLOCK_STYLE_FUNCTIONS = [{
		key: 'unordered-list-item',
		label: 'Punktlista',
		icon: 'ul'
	}, {
		key: 'ordered-list-item',
		label: 'Numrerad lista',
		icon: 'ol'
	}];

	var RichieContainer = _react2.default.createClass({
		displayName: 'RichieContainer',


		getDefaultProps: function getDefaultProps() {
			return {
				initialEditorState: {},
				initialHintEditorState: {}
			};
		},

		getInitialState: function getInitialState() {
			return {
				editorState: Draft.EditorState.createEmpty(),
				wordCount: 0,
				charCount: 0,
				errorVisible: false,
				valid: false,
				errorMessage: 'Textytan får inte vara tom.',
				linkEditorVisible: false,
				linkIsSubmitted: false,
				hasEntity: false,
				hasSelection: false
			};
		},

		componentWillMount: function componentWillMount() {
			var _this = this;

			this._afterOnChangeDebounced = _lodash2.default.debounce(this._afterOnChange, 150);
			if (this.props.initialEditorState) {
				this.setState(Object.assign({}, this.state, {
					editorState: this.props.initialEditorState,
					wordCount: EditorHelpers.getWordCount(this.props.initialEditorState),
					charCount: EditorHelpers.getCharCount(this.props.initialEditorState)
				}), function () {
					var isValid = _this.getValid(_this.props.initialEditorState);
					_this._setValid(isValid, false);
				});
			} else {
				var isValid = this.getValid(this.state.editorState);
				this._setValid(isValid, false);
			}
		},

		componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
			if (nextProps.isSubmitted && !this.state.errorVisible && !this.state.valid) {
				this._setValid(this.state.valid, true);
			}

			if (!_lodash2.default.isEmpty(nextProps.newLink) && !_lodash2.default.isEqual(this.props.newLink, nextProps.newLink)) {
				this.addLink(nextProps.newLink);
			}
		},

		getValid: function getValid(editorState) {
			/*Hint editorstate can be null*/
			if (this.props.allowEmpty) {
				return true;
			} else {
				return editorState.getCurrentContent().hasText();
			}
		},

		_setValid: function _setValid(isValid) {
			var _this2 = this;

			var showErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.setState(Object.assign({}, this.state, {
				errorVisible: showErrors,
				valid: isValid
			}), function () {
				if (_this2.props.setValid) {
					_this2.props.setValid(isValid);
				}
			});
		},

		_onChange: function _onChange(editorState) {

			var stateToSet = Object.assign({}, this.state);
			stateToSet.editorState = editorState;

			stateToSet.wordCount = EditorHelpers.getWordCount(editorState);
			stateToSet.charCount = EditorHelpers.getCharCount(editorState);

			this.setState(stateToSet, this._afterOnChangeDebounced);
		},

		_afterOnChange: function _afterOnChange() {
			var stateCopy = Object.assign({}, this.state);
			var isValid = this.getValid(stateCopy.editorState);
			this._setValid(isValid, false);
			this.props.onChange(stateCopy.editorState);
			/*if (stateCopy.hintEditorState) {
    this.props.onChange(stateCopy.hintEditorState, 'hintRichContent');
    }*/
		},

		_handleKeyCommand: function _handleKeyCommand(command) {
			var newState = Draft.RichUtils.handleKeyCommand(this.state.editorState, command);
			if (newState) {
				this._onChange(newState);
				return true;
			}
			return false;
		},
		_handlePastedText: function _handlePastedText(text) {
			var editorState = this.state.editorState;

			var blockMap = Draft.ContentState.createFromText(text.trim()).blockMap;
			var newState = Draft.Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);
			this._onChange(Draft.EditorState.push(editorState, newState, 'insert-fragment'));
			return true;
		},
		onBlur: function onBlur() {
			var isValid = this.getValid(this.state.editorState);
			this._setValid(isValid, true);
		},

		onInlineFunctionClick: function onInlineFunctionClick(key, e) {
			e.preventDefault();
			this._onChange(Draft.RichUtils.toggleInlineStyle(this.state.editorState, key));
		},

		onBlockFunctionClick: function onBlockFunctionClick(key, e) {
			e.preventDefault();
			var state = this.state.editorState;
			this._onChange(Draft.RichUtils.toggleBlockType(state, key));
		},

		checkSelection: function checkSelection(offsetEditor) {
			var state = this.state.editorState;
			var selection = state.getSelection();
			var selectionBlockKey = selection.getEndKey();
			var hasEntity = false;
			var hasSelection = false;

			if (!selection.isCollapsed()) {
				var startOffset = selection.getStartOffset();
				var contentState = state.getCurrentContent();
				var contentBlockMap = contentState.getBlockMap();
				var entityKey = '';
				contentBlockMap.map(function (contentBlock) {
					if (contentBlock.getEntityAt(startOffset) && selectionBlockKey == contentBlock.getKey()) {
						entityKey = contentBlock.getEntityAt(startOffset);
					}
				});
				hasEntity = !!entityKey;
				hasSelection = true;
			} else {
				hasSelection = false;
				hasEntity = false;
			}

			this.setState(Object.assign({}, this.state, {
				hasEntity: hasEntity,
				hasSelection: hasSelection
			}));
		},

		_openLinkEditor: function _openLinkEditor(e) {
			e.preventDefault();
			var state = this.state.editorState;
			var selection = state.getSelection();
			var stateToSet = Object.assign({}, this.state);
			var selectionBlockKey = selection.getStartKey();

			if (!selection.isCollapsed()) {
				stateToSet.linkEditorVisible = !this.state.linkEditorVisible;
				var startOffset = selection.getStartOffset();
				var contentState = state.getCurrentContent();
				var contentBlockMap = contentState.getBlockMap();
				var entityKey = '';
				contentBlockMap.map(function (contentBlock) {
					if (contentBlock.getEntityAt(startOffset) && selectionBlockKey == contentBlock.getKey()) {
						entityKey = contentBlock.getEntityAt(startOffset);
					}
				});
				if (entityKey != '') {
					var linkInstance = Draft.Entity.get(entityKey);
					var link = linkInstance.getData();
					this.props.openLinkEditor({
						value: link.url,
						target: link.target,
						internalFile: link.internalFile
					});
					/*store.dispatch(linkInEdition({
      value: link.url,
      target: link.target,
      internalFile: link.internalFile,
      }));*/
				} else {
					this.props.openLinkEditor();
				}
				//this.setState(stateToSet);
			}
		},

		insertSpace: function insertSpace(editorState) {
			var selection = editorState.getSelection();
			//insert space after the converted link
			var cs = Draft.Modifier.insertText(editorState.getCurrentContent(), selection, ' ');
			var newEditorState = Draft.EditorState.push(editorState, cs, 'insert-text');
			return newEditorState;
		},

		addLinkToCurrentSelection: function addLinkToCurrentSelection(link) {
			var _this3 = this;

			var editorState = this.state.editorState;
			var selectionState = editorState.getSelection();
			var linkEntity = link.target == "_blank" ? {
				url: link.value,
				target: link.target,
				internalFile: link.internalFile
			} : { url: link.value, internalFile: link.internalFile };
			var entityKey = Draft.Entity.create('LINK', 'MUTABLE', linkEntity);
			var stateToSet = Object.assign({}, this.state);

			stateToSet.editorState = Draft.RichUtils.toggleLink(editorState, selectionState, entityKey);

			stateToSet.editorState = EditorHelpers.collapseSelectionToEnd(selectionState, stateToSet.editorState);
			this.setState(stateToSet, function () {
				setTimeout(function () {
					_this3.richieInnerRef.focusOnEditor();
					var newEditorState = _this3.insertSpace(_this3.state.editorState);
					_this3.setState(Object.assign({}, _this3.state, { editorState: newEditorState }), function () {
						_this3._onChange(_this3.state.editorState);
					});
				}, 10);
			});
		},

		removeLinkFromCurrentSelection: function removeLinkFromCurrentSelection() {
			var editorState = this.state.editorState;
			var selection = editorState.getSelection();
			if (!selection.isCollapsed()) {
				this.setState({
					editorState: Draft.RichUtils.toggleLink(editorState, selection, null)
				});
			}
		},

		editorBlockStyles: function editorBlockStyles(contentBlock) {
			var type = contentBlock.getType();
			if (type === 'unstyled') {
				return 'richie_paragraph';
			} else if (type === 'unordered-list-item') {
				return 'richie_ul-li';
			} else if (type === 'ordered-list-item') {
				return 'richie_ol-li';
			} else if (type === 'atomic') {
				return 'richie_ol-li';
			}
			return null;
		},

		focusOnEditor: function focusOnEditor() {
			if (this.richieInnerRef) this.richieInnerRef.focusOnEditor();
		},

		render: function render() {
			var _this4 = this;

			var currentState = this.state.editorState;
			var selection = currentState.getSelection();
			var blockType = currentState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
			var currentStyle = currentState.getCurrentInlineStyle();
			var addLinkClass = (0, _classnames2.default)('rich-editor_add-link', {
				'rich-editor_add-link--active': this.state.linkEditorVisible
			});

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(_RichieView2.default, _extends({}, this.state, {
					//currentState={currentState}
					ref: function ref(el) {
						return _this4.richieInnerRef = el;
					},
					fixedToolbarIsSticky: this.props.fixedToolbarIsSticky,
					fixedToolbarStyle: this.props.fixedToolbarStyle,
					currentStyle: currentStyle,
					handleKeyCommand: this._handleKeyCommand,
					handlePastedText: this._handlePastedText,
					onChange: this._onChange,
					onBlur: this.onBlur,
					onInlineFunctionClick: this.onInlineFunctionClick,
					onBlockFunctionClick: this.onBlockFunctionClick,
					openLinkEditor: this._openLinkEditor,
					inlineStyleFunctions: INLINE_STYLE_FUNCTIONS,
					blockStyleFunctions: BLOCK_STYLE_FUNCTIONS,
					blockType: blockType,
					checkSelection: this.checkSelection,
					addLinkClass: addLinkClass,
					editorBlockStyles: this.editorBlockStyles
				}))
			);
		}
	});

	exports.default = RichieContainer;
});