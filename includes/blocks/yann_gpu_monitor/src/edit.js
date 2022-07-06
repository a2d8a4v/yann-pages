/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const Edit = ( props ) => {
	
	const {
		attributes: { title, description },
		setAttributes,
	} = props;
	
	const blockProps = useBlockProps();

	const updateTitle = ( value ) => {
		setAttributes( { title: value } );
	}

	const updateDescription = ( value ) => {
		setAttributes( { description: value } );
	};

	return (
		<div { ...blockProps }>

			<div className={ 'yannyann-gpumonitor-box' }>

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
						'Enter Description here…',
						'gutenberg-examples'
					) }
					value={ description }
					onChange={ updateDescription }
				/>

			</div>
		</div>
	);
};

export default Edit;
