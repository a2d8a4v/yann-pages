/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import applyWithColors from './colors';
import Controls from './controls';
import Inspector from './inspector';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { compose } = wp.compose;
const { RichText } = wp.blockEditor;

/**
 * Block edit function
 */
export default compose( applyWithColors ) ( class Edit extends Component {

	constructor( props ) {
		super( ...arguments );
		this.setNextValues = this.setNextValues.bind( this );
		this.setNextValues2 = this.setNextValues2.bind( this );
	}

	setNextValues( nextValues ) {
		this.props.setAttributes( { values: nextValues } );
	}

	setNextValues2( nextValues ) {
		this.props.setAttributes( { values2: nextValues } );
	}

	render() {

		const {
			attributes,
			className,
			isSelected,
			setAttributes,
			setTextColor,
			textColor,
			mergeBlocks,
			onReplace,
			subHeadingColor,
			setSubHeadingColor,
		} = this.props;

		const {
			content,
			contentAlign,
			firstName,
			lastName,
			subHeading,
			values,
			values2,
		} = attributes;

		return [
			isSelected && (
				<Controls
					{ ...this.props }
				/>
			),
			isSelected && (
				<Inspector
					{ ...this.props }
				/>
			),
			<div
				className={ classnames(
					'yann-hero',
					`has-${ contentAlign }-content`, {
						'is-selected': isSelected,
					}
				) }
				>
				<RichText
					tagName="h5"
					placeholder={ __( 'Hi, I am' ) }
					value={ subHeading }
					onChange={ ( value ) => setAttributes( { subHeading: value } ) }
					className={ classnames(
						'subHeading',
						'h5',
						'gray',
						'header-font',
						'medium', {
							'has-text-color': subHeadingColor.color,
						}
					) }
					style={ { color: subHeadingColor.color } }
					formattingControls={ [ 'italic' ] }
					keepPlaceholderOnFocus
				/>
				<RichText
					tagName="h1"
					placeholder={ __( 'Rich' ) }
					value={ firstName }
					onChange={ ( value ) => setAttributes( { firstName: value } ) }
					className={ classnames(
						'firstName',
						'header-font', {
							'has-text-color': textColor.color,
						}
					) }
					style={ { color: textColor.color } }
					formattingControls={ [ 'italic' ] }
					keepPlaceholderOnFocus
				/>
				{ ( ! RichText.isEmpty( lastName ) || isSelected ) && (
					<RichText
						tagName="h1"
						placeholder={ __( 'Yann' ) }
						value={ lastName }
						onChange={ ( value ) => setAttributes( { lastName: value } ) }
						className={ classnames(
							'lastName',
							'header-font', {
								'has-text-color': textColor.color,
							}
						) }
						style={ { color: textColor.color } }
						formattingControls={ [ 'italic' ] }
						keepPlaceholderOnFocus
					/>
				) }
				{ ( ! RichText.isEmpty( values ) || isSelected ) && (
					<div className="typed-content">
						<h2 className="h2 extra-large extra-important">
							<span
								id="animated-headline"
								className={ classnames( {
										'has-text-color': textColor.color,
									}
								) }
								style={ { color: textColor.color } }
							>
							</span>
						</h2>
						<RichText
							multiline="p"
							tagName={ 'div' }
							className={ classnames(
								'animated-headline--strings', {
									'has-text-color': textColor.color,
								}
							) }
							onChange={ this.setNextValues }
							style={ { color: textColor.color } }
							value={ values }
							placeholder={ __( 'Add creds...' ) }
							onMerge={ mergeBlocks }
							onRemove={ () => onReplace( [] ) }
							formattingControls={ [ 'italic' ] }
							keepPlaceholderOnFocus
						/>
						<RichText
							multiline="p"
							tagName={ 'span' }
							className={ classnames(
								'homepage_goodnews', {
									'has-text-color': textColor.color,
								}
							) }
							onChange={ this.setNextValues2 }
							style={ { color: textColor.color } }
							value={ values2 }
							placeholder={ __( 'your text...' ) }
							onMerge={ mergeBlocks }
							onRemove={ () => onReplace( [] ) }
							formattingControls={ [ 'italic' ] }
							keepPlaceholderOnFocus
						/>
					</div>
				) }
			</div>
		];
	}
} );
