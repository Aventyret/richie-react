(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'react'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('react'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react);
		global.SvgIcon = mod.exports;
	}
})(this, function (exports, _react) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var SvgIcon = _react2.default.createClass({
		displayName: 'SvgIcon',


		render: function render() {

			return _react2.default.createElement(
				'span',
				null,
				this.props.iconId
			);
		}

	});

	exports.default = SvgIcon;
});