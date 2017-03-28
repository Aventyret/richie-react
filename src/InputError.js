import React from 'react'
import classnames from 'classnames'

const InputError = React.createClass({

	propTypes: {
		className: React.PropTypes.string,
		errorMessage: React.PropTypes.string.isRequired,
		visible: React.PropTypes.bool
	},

	render: function(){
		let errorClass = classnames(this.props.className, {
			'error_container':   true,
			'visible':           this.props.visible,
			'invisible':         !this.props.visible
		});

		return (
			<div className={errorClass}>
				<span>{this.props.errorMessage}</span>
			</div>
		)
	}

});

export default InputError