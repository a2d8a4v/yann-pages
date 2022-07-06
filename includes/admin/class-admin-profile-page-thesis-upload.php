<?php
/**
 * Class: THESIS_UPLOAD
 * Adds an avatar upload field to user profiles.
 */

class THESIS_UPLOAD {

	/**
	 * Set up the hooks and default values
	 */
	public function __construct() {
		$this->errors = False;
		$this->YANN_root_user_id = 1;
		
		$this->joystick = "thesis";
		$this->posttype = "thesis";
		$this->upload_dir = "/thesis/";
		$this->postid_userid = "userid";
		$this->postid_useridjs = "useridjs";
		$this->table_for_uploaded_file = "CPT_thesis_table_for_uploaded_file";
		$this->joystick_types_arr = array( "thesis" );
		$this->add_hooks();
	}

	/**
	 * Register actions and filters.
	 */
	public function add_hooks() {

		// DB generating
		if ( class_exists('DB_SQL') ) {
			add_action( 'wp' , array( $this, 'CPT_thesis_uploaded_file_record_table_call' ) );
		}

		// enqueue scripts
		add_action( 'admin_enqueue_scripts' , array( $this, 'CPT_thesis_admin_profile_enqueue_resources' ) , 15 , 1 );

		add_action( "wp_ajax_CPT_{$this->posttype}_upload_action", array( $this, 'CPT_thesis_thesis_upload_handle' ) );
		add_action( "wp_ajax_CPT_{$this->posttype}_delete_file_action", array( $this, 'CPT_thesis_delete_file_handle' ) );
		add_action( "wp_ajax_CPT_{$this->posttype}_html_form_return", array( $this, 'CPT_thesis_html_form_return_handle' ) );
	}


	/**
	 * Registers the thesis post type.
	 * 
	 * @param object $hook, which admin page
	 */
	public function CPT_thesis_admin_profile_enqueue_resources( $hook ) {

		global $cpt_utils;
		if ($cpt_utils->CPT_UTILS_validation_enqueue_resources( 'profile', $hook, $this->posttype, $_GET )) {

			/*** register ***/
			wp_register_style( 'admin-profile-custom-thesis-upload-css' , plugins_url( '/css/admin/admin-profile-custom-thesis-upload.css', dirname( __FILE__ ) ) , array() , time() );
			wp_register_script( 'admin-profile-ajax-thesis-upload-file-js' , plugins_url( '', dirname( __FILE__ ) ) . '/js/admin/admin-profile-ajax-thesis-upload-file-js.js' , array() , time() , true );
			wp_register_script( 'filesaver-js' , plugins_url( '/js/admin/FileSaver.js' , dirname( __FILE__ ) ) , array() , time() , true );

			/*** enqueue ***/
			wp_enqueue_style('admin-profile-custom-thesis-upload-css');
			wp_enqueue_script('admin-profile-ajax-thesis-upload-file-js');
			wp_enqueue_script('filesaver-js');

			/*** localize ***/
			global $thesis_download_api;
			wp_localize_script( 'admin-profile-ajax-thesis-upload-file-js' , 'YANN' , array(
				'ajaxurl' => $cpt_utils->CPT_UTILS_ajax_url(),
				'nonce'   => $cpt_utils->CPT_UTILS_ajax_nonce_generate(),
				$this->postid_userid => get_current_user_id(),
				'action'  => "CPT_{$this->posttype}_upload_action",
				'fixaction' => "CPT_{$this->posttype}_html_form_return",
				'deleteaction' => "CPT_{$this->posttype}_delete_file_action",
				'restapinonce' => $cpt_utils->CPT_UTILS_ajax_restapi_nonce_generate(),
				'restapi' => $thesis_download_api->DONWLOAD_API_restapi_geturl(),
				'restinfoapi' => $thesis_download_api->DONWLOAD_API_restinfoapi_geturl(),
			));
		}
	}


	/**
	 * Function for generating table to recording uploaded files
	 *
	 */
	public function CPT_thesis_uploaded_file_record_table_call() {
		$db_sql = new DB_SQL(
			array(
				'type' => 'record',
				'table_name' => $this->table_for_uploaded_file,
				'postid_userid' => $this->postid_userid,
			)
		);
		$db_sql->DB_SQL_which_kind_table();
		unset($db_sql);
	}


	public function CPT_thesis_thesis_upload_handle(){

		// new a variable
		$new_UPLOAD_FILES = new UPLOAD_FILES(
			array(
				'_post' => $_POST,
				'_files' => $_FILES,
				'_server' => $_SERVER,
				'posttype' => $this->posttype,
				'upload_dir' => $this->upload_dir,
				'joystick_types_arr' => $this->joystick_types_arr,
				'postid_userid' => $this->postid_userid,
				'postid_useridjs' => $this->postid_useridjs,
				'table_for_uploaded_file' => $this->table_for_uploaded_file,
			)
		);
		if ($new_UPLOAD_FILES->UPLOAD_FILES_handle_upload_delete_validation()) {
			$new_UPLOAD_FILES->UPLOAD_FILES_upload_handle_reply();
		}
	}


	public function CPT_thesis_delete_file_handle(){

		// new a variable
		$new_UPLOAD_FILES = new UPLOAD_FILES(
			array(
				'_post' => $_POST,
				'_files' => $_FILES,
				'_server' => $_SERVER,
				'posttype' => $this->posttype,
				'upload_dir' => $this->upload_dir,
				'joystick_types_arr' => $this->joystick_types_arr,
				'postid_userid' => $this->postid_userid,
				'postid_useridjs' => $this->postid_useridjs,
				'table_for_uploaded_file' => $this->table_for_uploaded_file,
			)
		);
		if ($new_UPLOAD_FILES->UPLOAD_FILES_handle_upload_delete_validation()) {
			$new_UPLOAD_FILES->UPLOAD_FILES_delete_file_handle_reply();
		}
	}


	public function CPT_thesis_html_form_return_handle() {
		// new a variable
		$new_UPLOAD_BOX = new UPLOAD_BOX(
			array(
				'_post' => $_POST,
				'posttype' => $this->posttype,
				'joystick' => $this->joystick,
				'postid_userid' => $this->postid_userid,
				'joystick_types_arr' => $this->joystick_types_arr,
				'table_for_uploaded_file' => $this->table_for_uploaded_file,
			)
		);
		if ($new_UPLOAD_BOX->UPLOAD_BOX_handle_html_form_output_validation()) {
			$new_UPLOAD_BOX->UPLOAD_BOX_html_form_handle_reply();
		}
	}

}
