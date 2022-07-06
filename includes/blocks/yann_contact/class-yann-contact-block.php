<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Gutenberg Blocks for Yann_Contact Class
 *
 * @since 1.0.0
 */
class Yann_Contact {

	/**
	 * This plugin's instance.
	 *
	 * @var Yann_Contact
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Yann_Contact();
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
		$this->YANN_root_user_id = 1;

		add_action( 'init', array( $this, 'register_blocks' ) );
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

		register_block_type( __DIR__ );
	}

	/**
	 * Add a custom class to let Yann know we're activated.
	 *
	 * @param array $classes Classes for the body element.
	 * @return array (Maybe) filtered body classes.
	 */
	public function body_class( $classes ) {
		global $post;

		$classes[] = 'has-yann-contact-blocks';

		return $classes;
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

		wp_script_add_data( $this->_slug . '-contact-block-editor', 'data', $content );
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'yann-contact', false, dirname( plugin_basename( $this->_dir ) ) . '/languages/' );
	}
}

Yann_Contact::register();
