(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'react', 'classnames'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('react'), require('classnames'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.classnames);
		global.InputError = mod.exports;
	}
})(this, function (exports, _react, _classnames) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var InputError = _react2.default.createClass({
		displayName: 'InputError',


		propTypes: {
			className: _react2.default.PropTypes.string,
			errorMessage: _react2.default.PropTypes.string.isRequired,
			visible: _react2.default.PropTypes.bool
		},

		render: function render() {
			var errorClass = (0, _classnames2.default)(this.props.className, {
				'error_container': true,
				'visible': this.props.visible,
				'invisible': !this.props.visible
			});

			return _react2.default.createElement(
				'div',
				{ className: errorClass },
				_react2.default.createElement(
					'span',
					null,
					this.props.errorMessage
				)
			);
		}

	});

	exports.default = InputError;
});