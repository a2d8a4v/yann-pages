/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const Save = ( props ) => {

	const {
		attributes: { phone, fax, address },
	} = props;

	const blockProps = useBlockProps.save();
	return (
		<div { ...blockProps }>
			<section className={ 'yann_contact' }>
				<div className='social-box clr'>
					<ul className='clr'>
						<li>
							<span className='mark'>
								<span className='fa fa-phone' aria-hidden='true' >{ " TEL: " }</span>
								<RichText.Content tagName="p" className={'phone'} value={ phone } />
							</span>
						</li>
						<li>
							<span className='mark'>
								<span className='fa fa-fax' aria-hidden='true' >{ ' FAX: ' }</span>
								<RichText.Content tagName="p" className={'fax'} value={ fax } />
							</span>
						</li>
						<li>
							<span className='mark'>
								<span className='fa fa-address-book' aria-hidden='true' >{ ' ADDR: ' }</span>
								<RichText.Content tagName="p" className={'address'} value={ address } />
							</span>
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
};

export default Save;
