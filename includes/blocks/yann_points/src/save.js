/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import mediaurl_SSP from '../imgs/speech_signal_processing.png';
import mediaurl_IR from '../imgs/information_retrieval.png';
import mediaurl_NLP from '../imgs/natural_language_processing.png';
import mediaurl_AINN from '../imgs/artificial_intelligence_neural_networks.png';

const Save = ( props ) => {

	const {
		attributes: { title_a, text_a, title_b, text_b, title_c, text_c, title_d, text_d, mediaURL_a, mediaURL_b, mediaURL_c, mediaURL_d },
	} = props;

	const blockProps = useBlockProps.save( { className: "yann-points" } );
	return (
		<div { ...blockProps }>
			<div className='yann-points-container'>
				<div className='yann-points-wrapper'>
					<div>
						<div className='point'>
							<div className='thumbnail'>
								<div
									className='thumb-img thumb-img-1'
									style={ {
										"background-image": "url("+(!mediaURL_a?mediaurl_SSP:mediaURL_a)+")",
									}}
								></div>
								<div className='thumb-border'></div>
							</div>
							<h3>
								<RichText.Content tagName="span" className='yann-points-span-a' value={ title_a } />
								<br/>
								<RichText.Content tagName="p" className='yann-points-p-a' value={ text_a } />
							</h3>
						</div>
						<div className='point'>
							<div className='thumbnail'>
								<div
									className='thumb-img thumb-img-2'
									style={ {
										"background-image": "url("+(!mediaURL_b?mediaurl_IR:mediaURL_b)+")",
									}}
								></div>
								<div className='thumb-border'></div>
							</div>
							<h3>
								<RichText.Content tagName="span" className='yann-points-span-b' value={ title_b } />
								<br/>
								<RichText.Content tagName="p" className='yann-points-p-b' value={ text_b } />
							</h3>
						</div>
					</div>
					<div>
						<div className='point'>
							<div className='thumbnail'>
								<div
									className='thumb-img thumb-img-3'
									style={ {
										"background-image": "url("+(!mediaURL_c?mediaurl_NLP:mediaURL_c)+")",
									}}
								></div>
								<div className='thumb-border'></div>
							</div>
							<h3>
								<RichText.Content tagName="span" className='yann-points-span-c' value={ title_c } />
								<br/>
								<RichText.Content tagName="p" className='yann-points-p-c' value={ text_c } />
							</h3>
						</div>
						<div className='point'>
							<div className='thumbnail'>
								<div
									className='thumb-img thumb-img-4'
									style={ {
										"background-image": "url("+(!mediaURL_d?mediaurl_AINN:mediaURL_d)+")",
									}}
								></div>
								<div className='thumb-border'></div>
							</div>
							<h3>
								<RichText.Content tagName="span" className='yann-points-span-d' value={ title_d } />
								<br/>
								<RichText.Content tagName="p" className='yann-points-p-d' value={ text_d } />
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Save;
