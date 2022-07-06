/**
 * Internal dependencies
 */
import Colors from './colors';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;
const { PanelBody, withFallbackStyles, ToggleControl } = wp.components;

/**
 * Fallback styles
 */
const { getComputedStyle } = window;

const FallbackStyles = withFallbackStyles( ( node, ownProps ) => {

	const {
		textColor,
		customTextColor,
		subHeadingColor,
		customSubHeadingColor,
	} = ownProps.attributes;

	const editableNode = node.querySelector( '[contenteditable="true"]' );

	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;

	return {
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		fallbackSubHeadingColor: subHeadingColor || ! computedStyles ? undefined : computedStyles.color,
	};
} );

/**
 * Inspector controls
 */
export default compose( Colors, FallbackStyles ) ( class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		const {
			attributes,
			setAttributes,
			textColor,
			fallbackTextColor,
			setTextColor,
			subHeadingColor,
			setSubHeadingColor,
			fallbackSubHeadingColor,
		} = this.props;

		return (
			<InspectorControls key="inspector">
				<PanelColorSettings
						title={ __( 'Color Settings' ) }
						colorSettings={ [
							{
								value: subHeadingColor.color,
								onChange: setSubHeadingColor,
								label: __( 'Intro Color' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Heading Color' ),
							},
						] }
					>
					</PanelColorSettings>
			</InspectorControls>
		);
	}
} );
