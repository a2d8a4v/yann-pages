/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const Save = ( props ) => {

	const {
		attributes: { title, description },
	} = props;
	const blockProps = useBlockProps.save();
	return (
		<div { ...blockProps }>
			<RichText.Content tagName="h3" className="mb-5 yannyann-gpumonitor-h3" value={ title } />
			<p className="yannyann-gpumonitor-description">
				<RichText.Content tagName="span" className="yannyann-gpumonitor-span" value={ description } />	
			</p>
			<div className="yannyann-gpumonitor-box">
				<div class="yannyann-gpumonitor-tab start"/>
				<div class="yannyann-gpumonitor-console-pages start"/>
			</div>
		</div>
	);
};

export default Save;
