<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Gutenberg Blocks for Yann_Points Class
 *
 * @since 1.0.0
 */
class Yann_Points {

	/**
	 * This plugin's instance.
	 *
	 * @var Yann_Points
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Yann_Points();
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
		$this->_slug    = 'yannyann-box';
		$this->_dir     = untrailingslashit( plugin_dir_path( '/', __FILE__ ) );
		$this->_url     = untrailingslashit( plugins_url( '/', __FILE__ ) );
		$this->_media_id = array("");

		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'editor_assets' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'localization' ) );
		add_action( 'wp_enqueue_scripts' , array( $this , 'YANN_NTNUSMIL_PAGE_points_enqueue_script' ) , 15 , 0 );
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

		$classes[] = 'has-yann-points-blocks';

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
			$this->_slug . '-points-block-editor',
			$this->_url . '/build/style-index.css',
			array(),
			$this->_version
		);

		// Fronted Styles.
		wp_register_style(
			$this->_slug . '-points-block-frontend',
			$this->_url . '/build/index.css',
			array(),
			$this->_version
		);

		// Scripts.
		wp_register_script(
			$this->_slug . '-points-block-editor',
			$this->_url . '/build/index.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-plugins', 'wp-components', 'wp-edit-post', 'wp-api' ),
			time(),
			false
		);

		wp_register_script(
			$this->_slug . '-points-block-animator',
			$this->_url . '/dist/yann-points-block-motivation.js',
			array('jquery'),
			$this->_version,
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

		wp_script_add_data( $this->_slug . '-points-block-editor', 'data', $content );
	}

	/**
	 * Add JS library for points
	 * 
	 */
	public function YANN_NTNUSMIL_PAGE_points_enqueue_script() {
		if ( is_front_page() || is_page("demo") ) {
			wp_enqueue_script( 'block-CPT-points-ajax-js' , plugins_url( 'yann_points/dist/yann-points-block-motivation.js' , dirname( __FILE__ ) ) , array() , false , true );
		}
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'yann-points', false, dirname( plugin_basename( $this->_dir ) ) . '/languages/' );
	}
}

Yann_Points::register();
