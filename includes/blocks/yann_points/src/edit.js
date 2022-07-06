/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

const Edit = ( props ) => {
	
	const {
		attributes: { title_a, text_a, title_b, text_b, title_c, text_c, title_d, text_d, mediaURL_a, mediaID_a, mediaURL_b, mediaID_b, mediaURL_c, mediaID_c, mediaURL_d, mediaID_d },
		setAttributes,
	} = props;
	
	const blockProps = useBlockProps();
	
	const updateTitle_a = ( value ) => {
		setAttributes( { title_a: value } );
	}

	const updateText_a = ( value ) => {
		setAttributes( { text_a: value } );
	}

	const updateSelectImage_a = ( media ) => {
		setAttributes( {
			mediaURL_a: media.url,
			mediaID_a: media.id,
		} );
	};

	const updateTitle_b = ( value ) => {
		setAttributes( { title_b: value } );
	}

	const updateText_b = ( value ) => {
		setAttributes( { text_b: value } );
	}

	const updateSelectImage_b = ( media ) => {
		setAttributes( {
			mediaURL_b: media.url,
			mediaID_b: media.id,
		} );
	};

	const updateTitle_c = ( value ) => {
		setAttributes( { title_c: value } );
	}

	const updateSelectImage_c = ( media ) => {
		setAttributes( {
			mediaURL_c: media.url,
			mediaID_c: media.id,
		} );
	};

	const updateText_c = ( value ) => {
		setAttributes( { text_c: value } );
	}

	const updateTitle_d = ( value ) => {
		setAttributes( { title_d: value } );
	}

	const updateText_d = ( value ) => {
		setAttributes( { text_d: value } );
	}

	const updateSelectImage_d = ( media ) => {
		setAttributes( {
			mediaURL_d: media.url,
			mediaID_d: media.id,
		} );
	};

	return (
		<div { ...blockProps }>
			<div className={ 'point' }>
				<div>
					<MediaUpload
						onSelect={ updateSelectImage_a }
						allowedTypes="image"
						value={ mediaID_a }
						render={ ( { open } ) => (
							<Button
								className={
									mediaID_a ? 'image-button' : 'image-button'
								}
								onClick={ open }
							>
								{ ! mediaID_a ? (
									__( 'Upload Image', 'gutenberg-examples' )
								) : (
									__( 'Change Image', 'gutenberg-examples' )
								) }
							</Button>
						) }
					/>
				</div>
				<RichText
					tagName="span"
					placeholder={ __(
						'Enter Some Big Text…',
						'gutenberg-examples'
					) }
					value={ title_a }
					onChange={ updateTitle_a }
				/>
				<RichText
					tagName="p"
					placeholder={ __(
						'Enter Some Normal Text…',
						'gutenberg-examples'
					) }
					value={ text_a }
					onChange={ updateText_a }
				/>
			</div>
			<br/>
			<div className={ 'point' }>
				<div>
					<MediaUpload
						onSelect={ updateSelectImage_b }
						allowedTypes="image"
						value={ mediaID_b }
						render={ ( { open } ) => (
							<Button
								className={
									mediaID_b ? 'image-button' : 'image-button'
								}
								onClick={ open }
							>
								{ ! mediaID_b ? (
									__( 'Upload Image', 'gutenberg-examples' )
								) : (
									__( 'Change Image', 'gutenberg-examples' )
								) }
							</Button>
						) }
					/>
				</div>
				<RichText
					tagName="span"
					placeholder={ __(
						'Enter Some Big Text…',
						'gutenberg-examples'
					) }
					value={ title_b }
					onChange={ updateTitle_b }
				/>
				<RichText
					tagName="p"
					placeholder={ __(
						'Enter Some Normal Text…',
						'gutenberg-examples'
					) }
					value={ text_b }
					onChange={ updateText_b }
				/>
			</div>
			<br/>
			<div className={ 'point' }>
				<div>
					<MediaUpload
						onSelect={ updateSelectImage_c }
						allowedTypes="image"
						value={ mediaID_c }
						render={ ( { open } ) => (
							<Button
								className={
									mediaID_c ? 'image-button' : 'image-button'
								}
								onClick={ open }
							>
								{ ! mediaID_c ? (
									__( 'Upload Image', 'gutenberg-examples' )
								) : (
									__( 'Change Image', 'gutenberg-examples' )
								) }
							</Button>
						) }
					/>
				</div>
				<RichText
					tagName="span"
					placeholder={ __(
						'Enter Some Big Text…',
						'gutenberg-examples'
					) }
					value={ title_c }
					onChange={ updateTitle_c }
				/>
				<RichText
					tagName="p"
					placeholder={ __(
						'Enter Some Normal Text…',
						'gutenberg-examples'
					) }
					value={ text_c }
					onChange={ updateText_c }
				/>
			</div>
			<br/>
			<div className={ 'point' }>
				<div>
					<MediaUpload
						onSelect={ updateSelectImage_d }
						allowedTypes="image"
						value={ mediaID_d }
						render={ ( { open } ) => (
							<Button
								className={
									mediaID_d ? 'image-button' : 'image-button'
								}
								onClick={ open }
							>
								{ ! mediaID_d ? (
									__( 'Upload Image', 'gutenberg-examples' )
								) : (
									__( 'Change Image', 'gutenberg-examples' )
								) }
							</Button>
						) }
					/>
				</div>
				<RichText
					tagName="span"
					placeholder={ __(
						'Enter Some Big Text…',
						'gutenberg-examples'
					) }
					value={ title_d }
					onChange={ updateTitle_d }
				/>
				<RichText
					tagName="p"
					placeholder={ __(
						'Enter Some Normal Text…',
						'gutenberg-examples'
					) }
					value={ text_d }
					onChange={ updateText_d }
				/>
			</div>
		</div>
	);
};

export default Edit;
