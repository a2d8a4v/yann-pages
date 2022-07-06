<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Gutenberg Blocks for Yann_GPU_Monitor Class
 *
 * @since 1.0.0
 */
class Yann_GPU_Monitor {

	/**
	 * This plugin's instance.
	 *
	 * @var Yann_GPU_Monitor
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Yann_GPU_Monitor();
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
		$this->_media_id = array("");
		$this->_save_rdm = array();
		$this->add_hooks();
	}


	/**
	 * Register actions and filters.
	 */
	public function add_hooks() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'editor_assets' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'localization' ) );
		add_action( 'body_class', array( $this, 'body_class' ) );
		add_action( 'wp_enqueue_scripts' , array( $this , 'YANN_NTNUSMIL_PAGE_gpumonitor_enqueue_script' ) , 15 , 0 );
		add_action( 'wp_ajax_YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_action', array( $this , 'YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_handle' ) );
		add_action( 'wp_ajax_nopriv_YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_action', array( $this , 'YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_handle' ) );
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

		$classes[] = 'has-yann-gpumonitor-blocks';

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
			$this->_slug . '-gpumonitor-block-editor',
			$this->_url . '/build/index.css',
			array(),
			$this->_version
		);

		// Fronted Styles.
		wp_register_style(
			$this->_slug . '-gpumonitor-block-frontend',
			$this->_url . '/build/style-index.css',
			array(),
			time()
		);

		// Scripts.
		wp_register_script(
			$this->_slug . '-gpumonitor-block-editor',
			$this->_url . '/build/index.js',
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

		wp_script_add_data( $this->_slug . '-gpumonitor-block-editor', 'data', $content );
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'yann-gpumonitor', false, dirname( plugin_basename( $this->_dir ) ) . '/languages/' );
	}

	/**
	 * Add JS library for gpumonitor
	 * 
	 */
	// @https://codepen.io/steveschoger/pen/YbQXGq
	public function YANN_NTNUSMIL_PAGE_gpumonitor_enqueue_script() {
		if ( is_page("gpu-monitor") ) {
			wp_enqueue_script( 'progressbar-min-js' , plugins_url( 'yann_gpu_monitor/dist/progressbar.min.js' , dirname( __FILE__ ) ) , array() , false , true );
			wp_enqueue_style( 'block-CPT-gpumonitor-ajax-css', plugins_url( 'yann_gpu_monitor/dist/ajax-block-gpumonitor.css' , dirname( __FILE__ ) ), array(), time() , 'all' );
			// wp_enqueue_script( 'react' );
			// wp_enqueue_script( 'react-dom' );
			// wp_enqueue_script( 'block-CPT-gpumonitor-ajax-js' , plugins_url( 'yann_gpu_monitor/frontend/build/static/js/main.js' , dirname( __FILE__ ) ) , array() , false , true );
			wp_enqueue_script( 'block-CPT-gpumonitor-ajax-js' , plugins_url( 'yann_gpu_monitor/dist/ajax-block-gpumonitor.js' , dirname( __FILE__ ) ) , array() , false , true );
			wp_localize_script( 'block-CPT-gpumonitor-ajax-js' , 'YANN' , array(
				'ajaxurl' => admin_url( 'admin-ajax.php' ) ,
				'nonce'   => wp_create_nonce( 'YANN-ajax-nonce' ) ,
				'action' => "YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_action" ,
				'img_for_gpu_util' => $this->generateimgURLforGPUutilities(),
			));
		}
	}


	/**
	 * Get Profiles from backend
	 * 
	 */
	public function YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_handle() {

		// security check
		$nonce = ( isset( $_POST[ 'nonce' ] ) ) ? wc_clean( wp_unslash( $_POST[ 'nonce' ] ) ) : '';
		if ( ! wp_verify_nonce( $nonce , 'YANN-ajax-nonce' ) ) {
			wp_send_json_error( array( 'error' => true , 'errmessage' => '驗證失敗' ) );
			wp_die();
		}

		$V = $this->YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_call( $_POST );
		if ( array_key_exists( 'success' , $V ) ) {
			wp_send_json_success( $V );
			wp_die();
		} else if ( array_key_exists( 'error' , $V ) ) {
			wp_send_json_error( $V );
			wp_die();
		} else {
			wp_send_json_error( array( 'error' => true , 'errmessage' => '哪裡怪怪的，請檢察程式碼修正錯誤' ) );
			wp_die();
		}
	}
	
	/**
	 * Function for YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_handle
	 * 
	 */
	public function YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_call( $POST ) {
		$tmp_GPU_MONITOR_API = new GPU_MONITOR_API();
		$data = $tmp_GPU_MONITOR_API->GPU_MONITOR_API_handle();

		// if error occured
		if ( array_key_exists( 'error' , $data ) ) {
			return $data;
		}
		
		$update_time = $data["update_time"];
		$data = $data["data"];
		$rtn  = array();

		// Filter the data
		foreach( $data as $host_data ) {
			$host_name = $host_data["name"];
			if ( array_key_exists($host_name, $this->_save_rdm) ) {
				$host_data["rdm"] = $this->_save_rdm[$host_name];
			} else {
				// $host_data["rdm"] = $this->generateRandomString();
				// $host_data["rdm"] = strval(mb5($host_name));
				$host_data["rdm"] = $host_name;
				$this->_save_rdm[] = $host_data["rdm"];
			}
			$rtn[] = $host_data;	
		}
		
		return array( 'success' => true, 'data' => $rtn, 'update_time' => $update_time );
	}


	/**
	 * Function for YANN_NTNUSMIL_PAGE_GPUMonitor_fronted_ajax_handle
	 * 
	 */
	public function generateRandomString($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	public function generateimgURLforGPUutilities() {

		// get image url
		$url = $this->_url . '/imgs/cloud.svg';

		return $url;
	}
}

Yann_GPU_Monitor::register();
