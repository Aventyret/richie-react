import {EditorState, convertFromRaw, CompositeDecorator, Entity} from 'draft-js'
import React from 'react'


function findLinkEntities(contentBlock, callback) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();
			return (
				entityKey !== null &&
				Entity.get(entityKey).getType() === 'LINK'
			);
		},
		callback
	);
}


export const getWordCount = function(editorState) {
	const plainText = editorState.getCurrentContent().getPlainText('');
	const regex = /(?:\r\n|\r|\n)/g;  // new line, carriage return, line feed
	const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
	const wordArray = cleanString.match(/\S+/g);  // matches words according to whitespace
	return wordArray ? wordArray.length : 0;
};


export const getCharCount = function(editorState){
	//const decodeUnicode = (str) => punycode.ucs2.decode(str); // func to handle unicode characters
	const plainText = editorState.getCurrentContent().getPlainText('');
	const regex = /(?:\r\n|\r|\n)/g;  // new line, carriage return, line feed
	const cleanString = plainText.replace(regex, '').trim();  // replace above characters w/ nothing
	//return decodeUnicode(cleanString).length;
	return cleanString.length;
};


export const collapseSelectionToEnd = function(selectionState, editorState){
	let collapsed = selectionState.merge({
		anchorOffset: selectionState.getEndOffset(),
		focusOffset: selectionState.getEndOffset()
	});
	return EditorState.forceSelection(editorState, collapsed);
};


export const decorator = new CompositeDecorator([
	{
		strategy: findLinkEntities,
		component: ( props ) => {
			if(props.entityKey){
				let href=Entity.get(props.entityKey).getData().url;
				return (
					<a href={href} className="rich-editor_editor_link">{ props.children }</a>
				)
			}else{
				return(
					<a href="" className="rich-editor_editor_link">{ props.children }</a>
				)
			}
		}
	}
]);

export const createEmptyEditorState = function(){
	return EditorState.createEmpty(decorator);
};

export const createEditorStateWithContent = function(content){
	return EditorState.createWithContent(convertFromRaw(content), decorator);
};