/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './styles/editor.scss';
import icons from './components/icons';
import Edit from './components/edit';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText, getColorClassName } = wp.blockEditor;

/**
 * Block registration
 */
registerBlockType( 'yann/hero', {

	title: __( 'Yann Hero' ),

	description: __( 'Hero area for the Yann WordPress theme.' ),

	icon: {
		src: icons.hero,
	},

	category: 'layout',

	keywords: [
		__( 'text' ),
		__( 'paragraph' ),
		__( 'yann' ),
	],

	attributes: {
		firstName: {
			source: 'children',
			selector: '.firstName',
		},
		lastName: {
			source: 'children',
			selector: '.lastName',
		},
		subHeading: {
			source: 'children',
			selector: '.subHeading',
		},
		subHeadingColor: {
			type: 'string',
		},
		customSubHeadingColor: {
			type: 'string',
		},
		textColor: {
			type: 'string',
		},
		customTextColor: {
			type: 'string',
		},
		contentAlign: {
			type: 'string',
			default: 'left',
		},
		values: {
			type: 'array',
			source: 'children',
			selector: '.animated-headline--strings',
			default: [],
		},
	},

	edit: Edit,

	save: function( props ) {

		const {
			firstName,
			lastName,
			subHeading,
			customTextColor,
			textColor,
			values,
			contentAlign,
			subHeadingColor,
			customSubHeadingColor,
		} = props.attributes;

		const textClass = getColorClassName( 'color', textColor );
		const subHeadingClass = getColorClassName( 'color', subHeadingColor );

		const classes = classnames( 'firstName', 'header-font', {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass,
		} );

		const styles = {
			color: textClass ? undefined : customTextColor,
		};

		const lastNameClasses = classnames( 'lastName', 'header-font', {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass,
		} );

		const typedHeadlineClasses = classnames( {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass,
		} );

		const valuesClasses = classnames( 'animated-headline--strings', {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass,
		} );

		const subHeadingClasses = classnames( 'subHeading', 'h5', 'gray', 'medium', 'header-font', {
			'has-text-color': subHeading || customSubHeading,
			[ subHeadingClass ]: subHeadingClass,
		} );

		const subHeadingStyles = {
			color: subHeadingClass ? undefined : customSubHeadingColor,
		};

		return (
			<div
				className={ classnames(
					'yann-hero',
					`has-${ contentAlign }-content`,
				) }
				>
				{ ! RichText.isEmpty( subHeading ) && (
					<RichText.Content
						tagName="h5"
						className={ subHeadingClasses }
						style={ subHeadingStyles }
						value={ subHeading }
					/>
				) }
				<RichText.Content
					tagName="h1"
					className={ classes }
					style={ styles }
					value={ firstName }
				/>
				{ ! RichText.isEmpty( lastName ) && (
					<RichText.Content
						tagName="h1"
						className={ lastNameClasses }
						style={ styles }
						value={ lastName }
					/>
				) }
				{ ! RichText.isEmpty( values ) && (
					<div className="typed-content">
						<h2 className="h2 extra-large extra-important">
							<span id="animated-headline" className={ typedHeadlineClasses } style={ styles }></span>
						</h2>
						<RichText.Content
							tagName={ 'div' }
							className={ valuesClasses }
							value={ values }
							style={ styles }
						/>
					</div>
				) }
			</div>
		);
	},
} );