<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Gutenberg Blocks for Yann_Profile_Card Class
 *
 * @since 1.0.0
 */
class Yann_Profile_Card {

	/**
	 * This plugin's instance.
	 *
	 * @var Yann_Profile_Card
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Yann_Profile_Card();
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
		add_action( 'wp_enqueue_scripts' , array( $this , 'YANN_NTNUSMIL_PAGE_profilecard_enqueue_script' ) , 15 , 0 );
		add_action( 'wp_ajax_YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_action', array( $this , 'YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_handle' ) );
		add_action( 'wp_ajax_nopriv_YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_action', array( $this , 'YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_handle' ) );
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

		$classes[] = 'has-yann-profilecard-blocks';

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
			$this->_slug . '-profilecard-block-editor',
			$this->_url . '/build/index.css',
			array(),
			$this->_version
		);

		// Fronted Styles.
		wp_register_style(
			$this->_slug . '-profilecard-block-frontend',
			$this->_url . '/build/style-index.css',
			array(),
			time()
		);

		// Scripts.
		wp_register_script(
			$this->_slug . '-profilecard-block-editor',
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

		wp_script_add_data( $this->_slug . '-profilecard-block-editor', 'data', $content );
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'yann-profilecard', false, dirname( plugin_basename( $this->_dir ) ) . '/languages/' );
	}

	/**
	 * Add JS library for profilecard
	 * 
	 */
	public function YANN_NTNUSMIL_PAGE_profilecard_enqueue_script() {
		if ( is_page(array("members")) ) {
			wp_enqueue_script( 'block-CPT-profilecard-ajax-js' , plugins_url( 'yann_profile_card/dist/ajax-block-profilecard.js' , dirname( __FILE__ ) ) , array() , false , true );
			wp_enqueue_style( 'block-CPT-profilecard-ajax-css', plugins_url( 'yann_profile_card/dist/ajax-block-profilecard.css' , dirname( __FILE__ ) ), array(), time() , 'all' );
			wp_localize_script( 'block-CPT-profilecard-ajax-js' , 'YANN' , array(
				'ajaxurl' => admin_url( 'admin-ajax.php' ) ,
				'nonce'   => wp_create_nonce( 'YANN-ajax-nonce' ) ,
				'action' => "YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_action" ,
			));
		}
	}


	/**
	 * Get Profiles from backend
	 * 
	 */
	public function YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_handle() {

		// security check
		$nonce = ( isset( $_POST[ 'nonce' ] ) ) ? wc_clean( wp_unslash( $_POST[ 'nonce' ] ) ) : '';
		$type_user_id = ( isset( $_POST[ 'id' ] ) ) ? wc_clean( wp_unslash( $_POST[ 'id' ] ) ) : '';
		if ( ! wp_verify_nonce( $nonce , 'YANN-ajax-nonce' ) ) {
			wp_send_json_error( array( 'error' => true , 'errmessage' => '驗證失敗' ) );
			wp_die();
		}

		if ( empty( $type_user_id ) ) {
			wp_send_json_error( array( 'error' => true , 'errmessage' => '給予的參數有問題' ) );
			wp_die();
		}

		$V = $this->YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_call( $_POST );
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
	 * Function for YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_handle
	 * 
	 */
	public function YANN_NTNUSMIL_PAGE_Profilecard_fronted_ajax_call( $POST ) {

		// Varaibles
		$_type_user_id = explode( "-", wc_clean( wp_unslash( $POST[ 'id' ] ) ) ); 
		$_type = $_type_user_id[1];
		$_user_id = $_type_user_id[2];

		// Get user data
		if ( is_numeric($_user_id) ) {
			$data = get_user_by('id',$_user_id);
		} else {
			$args = array(
				'meta_key' => '_Bachelor',
				'meta_value' => $_type
			);
			$data = get_users($args);
		}
		if ( empty($data) ) {
			return array( 'error' => true , 'errmessage' => '尚無資料' );
		}

		// Validation
		$rtn_users_data = array();
		foreach ( $data as $user ) {
			$user_id = $user->ID;
			$_useravator_url = esc_url( get_avatar_url( $user_id, array('size' => '1000') ) );
			$_username = get_user_meta( $user_id, 'last_name' , true ).get_user_meta( $user_id, 'first_name' , true );
			$_userenname = get_user_meta( $user_id, 'EN_First_Name' , true ).get_user_meta( $user_id, 'EN_Last_Name' , true );
			$_userenrollment_year = get_user_meta( $user_id, 'Enrollment_Year' , true );
			$_userresearch_topic = get_user_meta( $user_id, 'Research_Topic' , true );
			$_userdescription = get_user_meta( $user_id, 'description' , true );
			$_usergithub = get_user_meta( $user_id, 'github' , true );
			$_usergitlab = get_user_meta( $user_id, 'gitlab' , true );
			$_userurl = get_user_meta( $user_id, 'url' , true );
			$_usercontactemail = get_user_meta( $user_id, 'contactemail' , true );

			#TODO
			# if want to be not shown here pass here

			# push the git urls in
			$_user_git = array();
			if ( !empty($_usergithub) ) {
				$_user_git["github"] = $_usergithub;
			}
			if ( !empty($_usergitlab) ) {
				$_user_git["gitlab"] = $_usergitlab;
			}

			$rtn_users_data[] = array( 
				"userenrollment_year" => $_userenrollment_year,
				"useravator_url" => $_useravator_url,
				"username" => $_username,
				"userenname" => $_userenname,
				"userresearch_topic" => $_userresearch_topic,
				"userdescription" => $_userdescription,
				"usergit" => $_user_git,
				"userurl" => $_userurl,
				"usercontactemail" => $_usercontactemail,
			);
		}
		if ( empty($rtn_users_data) ) {
			return array( 'error' => true , 'errmessage' => '尚無資料' );
		}
		// ReOrder by publish year
		array_multisort(array_column($rtn_users_data, 'userenrollment_year'), SORT_DESC, $rtn_users_data);

		return array( 'success' => true , 'data' => $rtn_users_data );
	}

}

Yann_Profile_Card::register();
