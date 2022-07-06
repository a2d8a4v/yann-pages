<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Gutenberg Blocks for Yann_Professor Class
 *
 * @since 1.0.0
 */
class Yann_Professor {

	/**
	 * This plugin's instance.
	 *
	 * @var Yann_Professor
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Yann_Professor();
		}
	}

	/**
	 * The base directory path (without trailing slash).
	 *
	 * @var string $_url
	 */
	private $_dir;

	/**
	 * The base URL path (without trailing slash).
	 *
	 * @var string $_url
	 */
	private $_url;

	/**
	 * The Plugin version.
	 *
	 * @var string $_version
	 */
	private $_version;

	/**
	 * The Plugin version.
	 *
	 * @var string $_slug
	 */
	private $_slug;

	/**
	 * The Constructor.
	 */
	private function __construct() {

		$this->_version = '0.0.1';
		$this->_slug    = 'yann';
		$this->_dir     = untrailingslashit( plugin_dir_path( '/', __FILE__ ) );
		$this->_url     = untrailingslashit( plugins_url( '/', __FILE__ ) );
		$this->_media_id = 122;

		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'editor_assets' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'localization' ) );
		add_action( 'body_class', array( $this, 'body_class' ) );
	}

	/**
	 * Add actions to enqueue assets.
	 *
	 * @access public
	 */
	public function register_blocks() {

		// Return early if this function does not exist.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		// Shortcut for the slug.
		$slug = $this->_slug;

		register_block_type(
			$slug . '/professor', array(
				'editor_script' => $slug . '-professor-block-editor',
				'editor_style'  => $slug . '-professor-block-editor',
				'style'         => $slug . '-professor-block-frontend',
			)
		);
	}

	/**
	 * Add a custom class to let Yann know we're activated.
	 *
	 * @param array $classes Classes for the body element.
	 * @return array (Maybe) filtered body classes.
	 */
	public function body_class( $classes ) {
		global $post;

		$classes[] = 'has-yann-professor-blocks';

		return $classes;
	}

	/**
	 * Enqueue block assets for use within Gutenberg.
	 *
	 * @access public
	 */
	public function editor_assets() {

		// Styles.
		wp_register_style(
			$this->_slug . '-professor-block-editor',
			$this->_url . '/dist/yann-professor-block.css',
			array(),
			time()
		);

		// Fronted Styles.
		wp_register_style(
			$this->_slug . '-professor-block-frontend',
			$this->_url . '/dist/yann-professor-block-fronted.css',
			array(),
			time()
		);

		// Scripts.
		wp_register_script(
			$this->_slug . '-professor-block-editor',
			$this->_url . '/dist/yann-professor-block.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-plugins', 'wp-components', 'wp-edit-post', 'wp-api' ),
			time(),
			false
		);
	}

	/**
	 * Enqueue Jed-formatted localization data.
	 *
	 * @access public
	 */
	public function localization() {

		// Check if this function exists.
		if ( ! function_exists( 'gutenberg_get_jed_locale_data' ) ) {
			return;
		}

		$locale  = gutenberg_get_jed_locale_data( $this->_slug );
		$content = 'wp.i18n.setLocaleData( ' . wp_json_encode( $locale ) . ' );';

		wp_script_add_data( $this->_slug . '-professor-block-editor', 'data', $content );
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'yann-professor', false, dirname( plugin_basename( $this->_dir ) ) . '/languages/' );
	}

}

Yann_Professor::register();
