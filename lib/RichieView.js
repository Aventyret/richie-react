import React from 'react'
import ReactDOM from 'react-dom'
import * as Draft from 'draft-js'
import classnames from 'classnames'

//import SvgIcon from '../svg-icon/svg-icon'

import InputError from './InputError'


const RichieView = React.createClass({

	handleSelection: function(event){
		this.props.checkSelection(ReactDOM.findDOMNode(this.editorRef).getBoundingClientRect());
	},
	focusOnEditor: function(){
		this.editorRef.focus();
	},
	render: function(){
		let Editor = Draft.Editor;

		let fixedToolbarCls = classnames('richie_buttons richie_buttons--fixed', {
			'richie_buttons--sticky': this.props.fixedToolbarIsSticky
		});

		return (
			<div>

				<div className="richie">


					{this.props.fixedToolbarIsSticky ?
						<div className="richie_fixed-toolbar-ghost">&nbsp;</div>
						: null}
					<div className={fixedToolbarCls} style={this.props.fixedToolbarIsSticky ? this.props.fixedToolbarStyle : null}>
						<div className="richie_wrapper-buttons">
							{this.props.inlineStyleFunctions.map((option, index) => {
								let classNameInline = classnames('richie_buttons_button', {
									'richie_buttons_button--active': this.props.currentStyle.has(option.key),
									'richie_buttons_button--first': index === 0
								});
								return (
									<button key={option.key} className={classNameInline} type="button" onMouseDown={this.props.onInlineFunctionClick.bind(null, option.key)} title={option.label}>
										<SvgIcon iconId={option.icon} />
									</button>
								)
							})}
							{this.props.blockStyleFunctions.map((option, index) => {
								let classNameBlock = classnames('richie_buttons_button', {
									'richie_buttons_button--active': this.props.blockType === option.key,
									'richie_buttons_button--first': index === 0
								});
								return (
									<button key={option.key} className={classNameBlock} type="button" onMouseDown={this.props.onBlockFunctionClick.bind(null, option.key)} title={option.label}>
										<SvgIcon iconId={option.icon} />
									</button>
								)
							})}
							<button className="richie_buttons_button" type="button" onMouseDown={this.props.openLinkEditor} title={ !this.props.hasEntity ? "Add link" : "Edit link" }>
								{ !this.props.hasEntity ?
									<SvgIcon iconId="editorlink" />
									: <SvgIcon iconId="editorunlink" />
								}
							</button>

						</div>
					</div>


					<div className="richie_editor"
						 onClick={this.handleSelection}>
						<Editor
							ref={el => { this.editorRef = el }}
							editorState={this.props.editorState}
							handleKeyCommand={this.props.handleKeyCommand}
							handlePastedText={this.props.handlePastedText}
							onChange={this.props.onChange}
							blockStyleFn={this.props.editorBlockStyles}
							onBlur={this.props.onBlur}
						/>
						<div className="l-gutter">
							<InputError
								visible={this.props.errorVisible}
								errorMessage={this.props.errorMessage} />
						</div>
					</div>


					<div className="richie_inforow">
						<div className="richie_inforow_wordcounter">Ord: {this.props.wordCount}</div>
						<div className="richie_inforow_charcounter">Tecken: {this.props.charCount}</div>
					</div>

				</div>
			</div>
		)
	}
});

export default RichieView