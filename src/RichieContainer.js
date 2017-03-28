import React from 'react'
import _ from 'lodash'
import * as Draft from 'draft-js'
import classnames from 'classnames'
import * as EditorHelpers from './Helpers'

import RichieView from './RichieView'


const INLINE_STYLE_FUNCTIONS = [
	{
		key: 'BOLD',
		label: 'Fet',
		icon: 'bold'
	},
	{
		key: 'ITALIC',
		label: 'Kursiv',
		icon: 'italic'
	}
];

const BLOCK_STYLE_FUNCTIONS = [
	{
		key: 'unordered-list-item',
		label: 'Punktlista',
		icon: 'ul'
	},
	{
		key: 'ordered-list-item',
		label: 'Numrerad lista',
		icon: 'ol'
	}
];

const RichieContainer = React.createClass({

	getDefaultProps: function () {
		return {
			initialEditorState: {},
			initialHintEditorState: {}
		}
	},

	getInitialState: function () {
		return {
			editorState: EditorHelpers.createEmptyEditorState(),
			wordCount: 0,
			charCount: 0,
			errorVisible: false,
			valid: false,
			errorMessage: 'Textytan får inte vara tom.',
			linkEditorVisible: false,
			linkIsSubmitted: false,
			hasEntity: false,
			hasSelection: false
		}
	},

	componentWillMount: function () {
		this._afterOnChangeDebounced = _.debounce(this._afterOnChange, 150);
		if (this.props.initialEditorState) {
			this.setState(Object.assign({}, this.state, {
				editorState: this.props.initialEditorState,
				wordCount: EditorHelpers.getWordCount(this.props.initialEditorState),
				charCount: EditorHelpers.getCharCount(this.props.initialEditorState)
			}), () => {
				let isValid = this.getValid(this.props.initialEditorState);
				this._setValid(isValid, false);
			})
		} else {
			let isValid = this.getValid(this.state.editorState);
			this._setValid(isValid, false);
		}
	},

	componentWillReceiveProps: function (nextProps) {
		if (nextProps.isSubmitted && !this.state.errorVisible && !this.state.valid) {
			this._setValid(this.state.valid, true);
		}

		if(!_.isEmpty(nextProps.newLink) && !_.isEqual(this.props.newLink, nextProps.newLink)){
			this.addLink(nextProps.newLink);
		}

	},



	getValid: function (editorState) {
		/*Hint editorstate can be null*/
		if (this.props.allowEmpty) {
			return true;
		} else {
			return editorState.getCurrentContent().hasText();
		}
	},

	_setValid: function (isValid, showErrors = false) {
		this.setState(Object.assign({}, this.state, {
			errorVisible: showErrors,
			valid: isValid
		}), () => {
			if (this.props.setValid) {
				this.props.setValid(isValid);
			}
		})
	},

	_onChange: function (editorState) {

		let stateToSet = Object.assign({}, this.state);
		stateToSet.editorState = editorState;

		stateToSet.wordCount = EditorHelpers.getWordCount(editorState);
		stateToSet.charCount = EditorHelpers.getCharCount(editorState);

		this.setState(stateToSet, this._afterOnChangeDebounced);
	},

	_afterOnChange: function () {
		let stateCopy = Object.assign({}, this.state);
		let isValid = this.getValid(stateCopy.editorState);
		this._setValid(isValid, false);
		this.props.onChange(stateCopy.editorState);
		/*if (stateCopy.hintEditorState) {
		 this.props.onChange(stateCopy.hintEditorState, 'hintRichContent');
		 }*/
	},

	_handleKeyCommand: function (command) {
		const newState = Draft.RichUtils.handleKeyCommand(this.state.editorState, command);
		if (newState) {
			this._onChange(newState);
			return true;
		}
		return false;
	},
	_handlePastedText: function (text) {
		//const {editorState} = this.state.showHint? this.state.hintEditorState : this.state.editorState;
		const {editorState} = this.state;
		const blockMap = Draft.ContentState.createFromText(text.trim()).blockMap;
		const newState = Draft.Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);
		this._onChange(Draft.EditorState.push(editorState, newState, 'insert-fragment'));
		return true;
	},
	onBlur: function () {
		let isValid = this.getValid(this.state.editorState);
		this._setValid(isValid, true);
	},

	onInlineFunctionClick: function (key, e) {
		e.preventDefault();
		this._onChange(Draft.RichUtils.toggleInlineStyle(this.state.editorState, key));
	},

	onBlockFunctionClick: function (key, e) {
		e.preventDefault();
		let state = this.state.editorState;
		this._onChange(Draft.RichUtils.toggleBlockType(state, key));
	},

	checkSelection: function (offsetEditor) {
		let state = this.state.editorState;
		let selection = state.getSelection();
		let selectionBlockKey = selection.getEndKey();
		let hasEntity = false;
		let hasSelection = false;

		if (!selection.isCollapsed()) {
			let startOffset = selection.getStartOffset();
			let contentState = state.getCurrentContent();
			let contentBlockMap = contentState.getBlockMap();
			let entityKey = '';
			contentBlockMap.map(contentBlock => {
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

	_openLinkEditor: function (e) {
		e.preventDefault();
		let state = this.state.editorState;
		let selection = state.getSelection();
		let stateToSet = Object.assign({}, this.state);
		let selectionBlockKey = selection.getStartKey();

		if (!selection.isCollapsed()) {
			stateToSet.linkEditorVisible = !this.state.linkEditorVisible;
			let startOffset = selection.getStartOffset();
			let contentState = state.getCurrentContent();
			let contentBlockMap = contentState.getBlockMap();
			let entityKey = '';
			contentBlockMap.map(contentBlock => {
				if (contentBlock.getEntityAt(startOffset) && selectionBlockKey == contentBlock.getKey()) {
					entityKey = contentBlock.getEntityAt(startOffset);
				}
			});
			if (entityKey != '') {
				let linkInstance = Draft.Entity.get(entityKey);
				let link = linkInstance.getData();
				this.props.openLinkEditor({
					value: link.url,
					target: link.target,
					internalFile: link.internalFile,
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


	insertSpace: function (editorState) {
		let selection = editorState.getSelection();
		//insert space after the converted link
		let cs = Draft.Modifier.insertText(
			editorState.getCurrentContent(),
			selection,
			' '
		);
		let newEditorState = Draft.EditorState.push(
			editorState,
			cs,
			'insert-text'
		);
		return newEditorState;
	},

	addLinkToCurrentSelection: function (link) {
		let editorState = this.state.editorState;
		let selectionState = editorState.getSelection();
		let linkEntity = link.target == "_blank" ? {
			url: link.value,
			target: link.target,
			internalFile: link.internalFile
		} : {url: link.value, internalFile: link.internalFile};
		let entityKey = Draft.Entity.create(
			'LINK',
			'MUTABLE',
			linkEntity
		);
		let stateToSet = Object.assign({}, this.state);

		stateToSet.editorState = Draft.RichUtils.toggleLink(
			editorState,
			selectionState,
			entityKey
		);

		stateToSet.editorState = EditorHelpers.collapseSelectionToEnd(selectionState, stateToSet.editorState);
		this.setState(stateToSet, () => {
			setTimeout(() => {
				this.richieInnerRef.focusOnEditor();
				const newEditorState = this.insertSpace(this.state.editorState);
				this.setState(Object.assign({}, this.state, {editorState: newEditorState}), () => {
					this._onChange(this.state.editorState);
				});
			}, 10);
		});

	},

	removeLinkFromCurrentSelection: function () {
		let editorState = this.state.editorState;
		const selection = editorState.getSelection();
		if (!selection.isCollapsed()) {
			this.setState({
				editorState: Draft.RichUtils.toggleLink(editorState, selection, null),
			});
		}
	},

	editorBlockStyles: function(contentBlock) {
		const type = contentBlock.getType();
		if (type === 'unstyled') {
			return 'richie_paragraph';
		} else if(type === 'unordered-list-item'){
			return 'richie_ul-li';
		} else if(type === 'ordered-list-item'){
			return 'richie_ol-li';
		} else if(type === 'atomic'){
			return 'richie_ol-li';
		}
		return null;
	},

	focusOnEditor: function(){
		if(this.richieInnerRef) this.richieInnerRef.focusOnEditor();
	},


	render: function () {

		let currentState = this.state.editorState;
		let selection = currentState.getSelection();
		let blockType = currentState
			.getCurrentContent()
			.getBlockForKey(selection.getStartKey())
			.getType();
		let currentStyle = currentState.getCurrentInlineStyle();
		let addLinkClass = classnames('rich-editor_add-link', {
			'rich-editor_add-link--active': this.state.linkEditorVisible
		});

		return (
			<div>
				<RichieView
					{...this.state}
					//currentState={currentState}
					ref={el => this.richieInnerRef = el}
					fixedToolbarIsSticky={this.props.fixedToolbarIsSticky}
					fixedToolbarStyle={this.props.fixedToolbarStyle}
					currentStyle={currentStyle}
					handleKeyCommand={this._handleKeyCommand}
					handlePastedText={this._handlePastedText}
					onChange={this._onChange}
					onBlur={this.onBlur}
					onInlineFunctionClick={this.onInlineFunctionClick}
					onBlockFunctionClick={this.onBlockFunctionClick}
					openLinkEditor={this._openLinkEditor}
					inlineStyleFunctions={INLINE_STYLE_FUNCTIONS}
					blockStyleFunctions={BLOCK_STYLE_FUNCTIONS}
					blockType={blockType}
					checkSelection={this.checkSelection}
					addLinkClass={addLinkClass}
					editorBlockStyles={this.editorBlockStyles}
				/>

			</div>
		)
	}
});

export default RichieContainer;