(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'react', 'react-dom', 'draft-js', 'classnames', './SvgIcon', './InputError'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('react'), require('react-dom'), require('draft-js'), require('classnames'), require('./SvgIcon'), require('./InputError'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.reactDom, global.draftJs, global.classnames, global.SvgIcon, global.InputError);
		global.RichieView = mod.exports;
	}
})(this, function (exports, _react, _reactDom, _draftJs, _classnames, _SvgIcon, _InputError) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var Draft = _interopRequireWildcard(_draftJs);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

	var _InputError2 = _interopRequireDefault(_InputError);

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

	var RichieView = _react2.default.createClass({
		displayName: 'RichieView',


		handleSelection: function handleSelection(event) {
			this.props.checkSelection(_reactDom2.default.findDOMNode(this.editorRef).getBoundingClientRect());
		},
		focusOnEditor: function focusOnEditor() {
			this.editorRef.focus();
		},
		render: function render() {
			var _this = this;

			var Editor = Draft.Editor;

			var fixedToolbarCls = (0, _classnames2.default)('richie_buttons richie_buttons--fixed', {
				'richie_buttons--sticky': this.props.fixedToolbarIsSticky
			});

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'richie' },
					this.props.fixedToolbarIsSticky ? _react2.default.createElement(
						'div',
						{ className: 'richie_fixed-toolbar-ghost' },
						'\xA0'
					) : null,
					_react2.default.createElement(
						'div',
						{ className: fixedToolbarCls, style: this.props.fixedToolbarIsSticky ? this.props.fixedToolbarStyle : null },
						_react2.default.createElement(
							'div',
							{ className: 'richie_wrapper-buttons' },
							this.props.inlineStyleFunctions.map(function (option, index) {
								var classNameInline = (0, _classnames2.default)('richie_buttons_button', {
									'richie_buttons_button--active': _this.props.currentStyle.has(option.key),
									'richie_buttons_button--first': index === 0
								});
								return _react2.default.createElement(
									'button',
									{ key: option.key, className: classNameInline, type: 'button', onMouseDown: _this.props.onInlineFunctionClick.bind(null, option.key), title: option.label },
									_react2.default.createElement(_SvgIcon2.default, { iconId: option.icon })
								);
							}),
							this.props.blockStyleFunctions.map(function (option, index) {
								var classNameBlock = (0, _classnames2.default)('richie_buttons_button', {
									'richie_buttons_button--active': _this.props.blockType === option.key,
									'richie_buttons_button--first': index === 0
								});
								return _react2.default.createElement(
									'button',
									{ key: option.key, className: classNameBlock, type: 'button', onMouseDown: _this.props.onBlockFunctionClick.bind(null, option.key), title: option.label },
									_react2.default.createElement(_SvgIcon2.default, { iconId: option.icon })
								);
							}),
							_react2.default.createElement(
								'button',
								{ className: 'richie_buttons_button', type: 'button', onMouseDown: this.props.openLinkEditor, title: !this.props.hasEntity ? "Add link" : "Edit link" },
								!this.props.hasEntity ? _react2.default.createElement(_SvgIcon2.default, { iconId: 'editorlink' }) : _react2.default.createElement(_SvgIcon2.default, { iconId: 'editorunlink' })
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'richie_editor',
							onClick: this.handleSelection },
						_react2.default.createElement(Editor, {
							ref: function ref(el) {
								_this.editorRef = el;
							},
							editorState: this.props.editorState,
							handleKeyCommand: this.props.handleKeyCommand,
							handlePastedText: this.props.handlePastedText,
							onChange: this.props.onChange,
							blockStyleFn: this.props.editorBlockStyles,
							onBlur: this.props.onBlur
						}),
						_react2.default.createElement(
							'div',
							{ className: 'l-gutter' },
							_react2.default.createElement(_InputError2.default, {
								visible: this.props.errorVisible,
								errorMessage: this.props.errorMessage })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'richie_inforow' },
						_react2.default.createElement(
							'div',
							{ className: 'richie_inforow_wordcounter' },
							'Ord: ',
							this.props.wordCount
						),
						_react2.default.createElement(
							'div',
							{ className: 'richie_inforow_charcounter' },
							'Tecken: ',
							this.props.charCount
						)
					)
				)
			);
		}
	});

	exports.default = RichieView;
});