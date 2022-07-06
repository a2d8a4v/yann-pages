/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { BlockControls, AlignmentToolbar } = wp.blockEditor;

export default class Controls extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		const {
			attributes,
			setAttributes,
		} = this.props;

		const {
			contentAlign,
		} = attributes;

		return (
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ ( nextContentAlign ) => setAttributes( { contentAlign: nextContentAlign } ) }
				/>
			</BlockControls>
		);
	}
}
