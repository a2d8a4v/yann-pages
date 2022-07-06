/**
 * WordPress dependencies
 */
const { withColors } = wp.blockEditor;

/**
 * Generate block colors.
 */
const applyWithColors = withColors(
	{ textColor: 'color' },
	{ subHeadingColor: 'color' },
);

export default applyWithColors;