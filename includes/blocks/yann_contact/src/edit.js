/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const Edit = ( props ) => {
	
	const {
		attributes: { phone, fax, address },
		setAttributes,
	} = props;
	
	const blockProps = useBlockProps();

	const updatePhone = ( value ) => {
		setAttributes( { phone: value } );
	}

	const updateFax = ( value ) => {
		setAttributes( { fax: value } );
	}

	const updateAddress = ( value ) => {
		setAttributes( { address: value } );
	};

	return (
		<div { ...blockProps }>

			<section className={ 'yann_contact' }>
				<div className='social-box clr'>
					<ul className='clr'>
						<li>
							<RichText
								tagName="p"
								placeholder={ __(
									'Enter Telephone…',
									'gutenberg-examples'
								) }
								onChange={ updatePhone }
								value={ phone }
							/>
						</li>
						<li>
							<RichText
								tagName="p"
								placeholder={ __(
									'Enter Fax Number…',
									'gutenberg-examples'
								) }
								onChange={ updateFax }
								value={ fax }
							/>
						</li>
						<li>
							<RichText
								tagName="p"
								placeholder={ __(
									'Enter Address…',
									'gutenberg-examples'
								) }
								onChange={ updateAddress }
								value={ address }
							/>
						</li>
					</ul>

				</div>
			</section>
		</div>
	);
};

export default Edit;
