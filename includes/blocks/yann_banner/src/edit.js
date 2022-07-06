/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

const Edit = ( props ) => {
	
	const {
		attributes: { title, content, mediaURL, mediaID },
		setAttributes,
	} = props;
	
	const blockProps = useBlockProps();

	const updateTitle = ( value ) => {
		setAttributes( { title: value } );
	}

	const updateContent = ( value ) => {
		setAttributes( { content: value } );
	};

	const updateSelectImage = ( media ) => {
		setAttributes( {
			mediaURL: media.url,
			mediaID: media.id,
		} );
	};

	return (
		<div { ...blockProps }>
			<section className={ 'yann_banner_block_section' } style={{"background-image":"url("+mediaURL+")"}}>
				<div className='text-container yann_banner_block_section_text'>
					<div className='yann_banner_block_section_background'></div>
					<div className='text-wrapper'>
						<MediaUpload
							onSelect={ updateSelectImage }
							allowedTypes="image"
							value={ mediaID }
							render={ ( { open } ) => (
								<Button
									className={
										mediaID ? 'image-button' : 'button button-large'
									}
									onClick={ open }
								>
									{ ! mediaID ? (
										__( 'Upload Image', 'gutenberg-examples' )
									) : (
										__( 'Change Image', 'gutenberg-examples' )
									) }
								</Button>
							) }
						/>
						<RichText
							tagName="span"
							placeholder={ __(
								'Enter Content here…',
								'gutenberg-examples'
							) }
							value={ content }
							onChange={ updateContent }
							style={ {width: '100%'} }
						/>
						<RichText
							tagName="h2"
							placeholder={ __(
								'Enter Title here…',
								'gutenberg-examples'
							) }
							value={ title }
							onChange={ updateTitle }
							style={ {width: '100%'} }
						/>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Edit;
