/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';

const Edit = ( props ) => {
	
	const {
		attributes: { id, title, type },
		setAttributes,
	} = props;
	
	const blockProps = useBlockProps();

	const updateType = ( value ) => {
		setAttributes( { type: value } );
	}

	const updateTitle = ( value ) => {
		setAttributes( { title: value } );
	}

	const updateID = ( value ) => {
		setAttributes( { content: value } );
	};

	return (
		<div { ...blockProps }>

			<div className={ 'profilecard-box profilecard-' + type }>

				<SelectControl
					label={ __( 'Select Types' ) }
					value={ type }
					options={ [
						{ label: 'Please Select One', value: 'default', disabled: true },
						{ label: 'Professor', value: 'Teacher'},
						{ label: 'Master Student', value: 'Master_Student'},
						{ label: 'Undergraduate Student', value: 'Undergraduate_Student'},
						{ label: 'PhD Student', value: 'PhD_Student'},
					] }
					onChange={ updateType }
				/>

				<RichText
					tagName="span"
					placeholder={ __(
						'Enter Title here…',
						'gutenberg-examples'
					) }
					value={ title }
					onChange={ updateTitle }
				/>

				<RichText
					tagName="p"
					placeholder={ __(
						'Enter User ID(s) here for Specific Person…',
						'gutenberg-examples'
					) }
					value={ id }
					onChange={ updateID }
				/>

			</div>
		</div>
	);
};

export default Edit;
