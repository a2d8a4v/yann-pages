/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import YANNimg from '../img/A00_@ntnusmil_ntnu-gongguan-campas@_ori.jpg';

const Save = ( props ) => {

	const {
		attributes: { title, content, mediaURL },
	} = props;

	const blockProps = useBlockProps.save();
	return (
		<div { ...blockProps }>
			<section
				className='yann_banner_block_section'
				style={
					{
						"background-image": "url(" + ( mediaURL ? mediaURL : YANNimg ) + ")"
					}
				}>
				<div className='text-container yann_banner_block_section_text'>
					<div className='yann_banner_block_section_background'></div>
					<div className='text-wrapper'>
						<RichText.Content tagName="span" value={ content } />
						<RichText.Content tagName="h2" value={ title } />
					</div>
				</div>
			</section>
		</div>
	);
};

export default Save;
