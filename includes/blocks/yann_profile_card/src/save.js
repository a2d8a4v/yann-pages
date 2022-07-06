/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const Save = ( props ) => {

	const {
		attributes: { id, title, type },
	} = props;

	const blockProps = useBlockProps.save();
	return (
		<div { ...blockProps }>
			<section className='yann-profilecard'>

				<p className="yann-profilecard-description">
					<RichText.Content tagName="span" className='yann-profilecard-span' value={ title } />
				</p>

				<div className='yann-profilecard-container'>
					<div className='yann-profilecard-wrapper yann-profilecard-lists flex items-center justify-center'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<RichText.Content
								tagName='div'
								className='yann-profilecard-element'
								id={ 'profilecard-' + type + '-' + id }
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Save;
