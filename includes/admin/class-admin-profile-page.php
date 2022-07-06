<?php
/**
 * Class: YANN_Profile_Page
 * Simple additional profile page fields.
 */
class YANN_Profile_Page {
	private $errors;

	/**
	 * Set up the hooks and default values
	 */
	public function __construct() {
		$this->errors = False;
		$this->YANN_root_user_id = 1;

		$this->joystick_upload_area = 'thesis';
		$this->posttype_upload_area = 'thesis';
		$this->joystick_types_arr = array('thesis');
		$this->postid_userid_upload_area = 'userid';
		$this->table_for_uploaded_file_upload_area = 'CPT_thesis_table_for_uploaded_file';

		$this->add_hooks();
	}

	/**
	 * Register actions and filters.
	 */
	public function add_hooks() {
		add_action( 'show_user_profile', array( $this, 'YANN_NTNUSMIL_profile_page_extra_user_profile_fields' ) );
		add_action( 'edit_user_profile', array( $this, 'YANN_NTNUSMIL_profile_page_extra_user_profile_fields' ) );
		add_action( 'personal_options_update', array( $this, 'YANN_NTNUSMIL_profile_page_save_extra_user_profile_fields' ) );
		add_action( 'edit_user_profile_update', array( $this, 'YANN_NTNUSMIL_profile_page_save_extra_user_profile_fields' ) );
		add_filter( 'user_contactmethods', array( $this, 'YANN_NTNUSMIL_profile_page_modify_user_contact_methods' ) );

		foreach ( array( 'profile.php', 'user-edit.php' ) as $hook ) {
			add_action( "admin_print_styles-$hook" , array( $this, 'YANN_NTNUSMIL_admin_profile_styles' ) );
		}
		add_action( "admin_enqueue_scripts" , array( $this, 'YANN_NTNUSMIL_admin_profile_enqueue_scripts' ) , 15 , 1 );

		add_action( 'admin_notices' , array( $this, 'YANN_NTNUSMIL_general_profile_notice' ) );
		add_action( 'admin_head' , array( $this, 'YANN_NTNUSMIL_admin_profile_head_recognition' ) );

		add_action( 'wp_ajax_YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_action', array( $this, 'YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_handle' ) );
	}
 
	/**
	 * Add user contact methods
	 *
	 * @param object $profileuser User object
	 */
	public function YANN_NTNUSMIL_profile_page_modify_user_contact_methods( $methods ) {
		// @https://developer.wordpress.org/reference/hooks/user_contactmethods/
		// @https://developer.wordpress.org/reference/functions/wp_get_user_contact_methods/
		$methods['github']   = __( 'GitHub URL', 'YANN_NTNUSMIL' );
		$methods['gitlab'] = __( 'GitLab URL', 'YANN_NTNUSMIL' );
		$methods['phone'] = __( 'Cell Phone Number','YANN_NTNUSMIL' );
		$methods['contactemail'] = __( '聯絡用信箱','YANN_NTNUSMIL' );
		return $methods;
	}

	/**
	 * Output new Avatar fields to user editing / profile screen
	 *
	 * @param object $profileuser User object
	 */
	public function YANN_NTNUSMIL_profile_page_extra_user_profile_fields( $user ) {
		global $pagenow;
	?>
		<h3><?php _e("Bachelor Information", "blank"); ?></h3>
		<table class="form-table">
		<tr class="user-en-last-name-wrap">
			<th><label for="EN_Last_Name"><?php _e("English Last Name"); ?></label></th>
			<td>
				<input type="text" autocomplete="off" name="EN_Last_Name" id="EN_Last_Name" placeholder="<?php _e("Please enter your last name."); ?>" value="<?php echo esc_attr( get_the_author_meta( 'EN_Last_Name', $user->ID ) ); ?>" class="regular-text" />
			</td>
		</tr>
		<tr class="user-en-first-name-wrap">
			<th><label for="EN_First_Name"><?php _e("English First Name"); ?></label></th>
			<td>
				<input type="text" autocomplete="off" name="EN_First_Name" id="EN_First_Name" placeholder="<?php _e("Please enter your first name."); ?>" value="<?php echo esc_attr( get_the_author_meta( 'EN_First_Name', $user->ID ) ); ?>" class="regular-text" />
			</td>
		</tr>
		<tr class="user-enrollment-year-wrap">
		<th><label for="Enrollment_Year"><?php _e("Enrollment Year"); ?></label></th>
			<td>
				<?php $_Enrollment_Year = get_the_author_meta( 'Enrollment_Year', $user->ID ); ?>
				<?php if ( empty($_Enrollment_Year) ): ?>
				<input type="text" year="year" autocomplete="off" name="Enrollment_Year" id="Enrollment_Year" value="" class="regular-text" />
				<?php else: ?>
				<input type="text" year="year" name="Enrollment_Year_Lock" id="Enrollment_Year_Lock" value="<?php echo esc_attr( $_Enrollment_Year ); ?>" class="regular-text" readonly/>
				<p class="description"><?php _e("Your enrollment year couldn't be changed."); ?></p>
				<?php endif;?>
			</td>
		</tr>
		<tr class="user-graduate-year-wrap">
		<th><label for="Graduate_Year"><?php _e("Graduate Year"); ?></label></th>
			<td>
				<?php $_Graduate_Year = get_the_author_meta( 'Graduate_Year', $user->ID ); ?>
				<input type="text" year="year" autocomplete="off" name="Graduate_Year" id="Graduate_Year" value="<?php echo esc_attr( $_Graduate_Year ); ?>" class="regular-text"/>
			</td>
		</tr>
		<tr class="user-research-topic-wrap">
		<th><label for="Research_Topic"><?php _e("Research Topic"); ?></label></th>
			<td>
				<?php $_Research_Topic = get_the_author_meta( 'Research_Topic', $user->ID ); ?>
				<input type="text" autocomplete="off" name="Research_Topic" id="Research_Topic" value="<?php echo esc_attr( $_Research_Topic ); ?>" class="regular-text"/>
			</td>
		</tr>
		<tr class="user-bachelor-wrap">
			<?php if ( $pagenow === 'profile.php' ): ?>
			<?php $USER_ID = get_current_user_id(); ?>
			<?php elseif ($pagenow === 'user-edit.php'): ?>
			<?php $USER_ID = $_REQUEST["user_id"]; ?>
			<?php endif; ?>
			<?php $meta_field_data_Bachelor = get_user_meta( $USER_ID , '_Bachelor' , true ) ? get_user_meta( $USER_ID , '_Bachelor' , true ) : ''; ?>
			<th><label for="Bachelor"><?php _e("Bachelor"); ?></label></th>
			<td>
				<select id="Bachelor" name="Bachelor" type="select">
					<option value=""><?php _e("Please select one"); ?></option>
					<option value="Undergraduate_Student" <?php echo selected( 'Undergraduate_Student', $meta_field_data_Bachelor, false ); ?>>Undergraduate Student</option>
					<option value="Master_Student" <?php echo selected( 'Master_Student', $meta_field_data_Bachelor, false ); ?>>Master Student</option>
					<option value="PhD_Student" <?php echo selected( 'PhD_Student', $meta_field_data_Bachelor, false ); ?>>PhD Student</option>
				</select>
			</td>
		</tr>
		<?php if ( !empty($_Enrollment_Year) && !empty($meta_field_data_Bachelor) ): ?>
		<?php if ( $meta_field_data_Bachelor === "Master_Student" ): ?>
		<?php $USER_ID = get_current_user_id(); ?>
		<tr class="user-thesis-wrap">
			<?php $meta_field_data_Thesis_title = get_user_meta( $USER_ID , '_Thesis_title' , true ) ? get_user_meta( $USER_ID , '_Thesis_title' , true ) : ''; ?>
			<th><label for="_Thesis_title"><?php _e("Master Thesis Title"); ?></label></th>
			<td>
			<input type="text" autocomplete="off" name="_Thesis_title" id="_Thesis_title" value="<?php echo esc_url( $meta_field_data_Thesis_title ); ?>" class="regular-text"/>
			</td>
		</tr>
		<?php elseif ( $meta_field_data_Bachelor === "PhD_Student" ): ?>
		<tr class="user-dissertation-wrap">
			<?php $meta_field_data_Dissertation_title = get_user_meta( $USER_ID , '_Dissertation_title' , true ) ? get_user_meta( $USER_ID , '_Dissertation_title' , true ) : ''; ?>
			<th><label for="_Dissertation_title"><?php _e("PhD Dissertation Title"); ?></label></th>
			<td>
			<input type="text" autocomplete="off" name="_Dissertation_title" id="_Dissertation_title" value="<?php echo esc_url( $meta_field_data_Dissertation_title ); ?>" class="regular-text"/>
			</td>
		</tr>
		<?php endif; ?>
		<?php

		$new_UPLOAD_BOX = new UPLOAD_BOX(
			array(
				'_post' => $_POST,
				'posttype' => $this->posttype_upload_area,
				'joystick' => $this->joystick_upload_area,
				'postid_userid' => $this->postid_userid_upload_area,
				'joystick_types_arr' => $this->joystick_types_arr,
				'table_for_uploaded_file' => $this->table_for_uploaded_file_upload_area,
			)
		);
		
		?>
		<tr class="user-thesis-upload-wrap">
			<th><label for="_Thesis_Upload"><?php _e("Thesis Upload"); ?></label></th>
			<td>
				<?php $new_UPLOAD_BOX->UPLOAD_BOX_input_for_files_upload(); ?>
			</td>
		</tr>	
		<?php endif; ?>
		<?php if ( get_user_meta( $USER_ID , 'first_login' , true ) ): ?>
		<input type="text" autocomplete="off" name="first-login-recognition-length" id="first-login-recognition-length" value="" class="regular-text" hidden/>
		<?php endif; ?>
		</table>
	<?php
	}

	/**
	 * Generate a head for first-login recognition
	 *
	 */
	public function YANN_NTNUSMIL_admin_profile_head_recognition() {
		global $pagenow;
		if ( !in_array( $pagenow , array( 'profile.php' , 'user-edit.php' ) ) ) {
			return;
		}
		if ( get_user_meta( get_current_user_id() , 'first_login' , true ) ) {
			echo '<div id="first-login-recognition"></div>';
		}
		if ( get_current_user_id() === $this->YANN_root_user_id ) {
			echo '<div id="is-admin-user"></div>';
		} else {
			echo '<div id="is-not-admin-user"></div>';
		}
	}

	/**
	 * Save any changes to the user profile
	 *
	 * @param int $user_id ID of user being updated
	 */
	public function YANN_NTNUSMIL_profile_page_save_extra_user_profile_fields( $user_id ) {

		if ( empty( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], 'update-user_' . $user_id ) ) {
			return;
		}
		
		if ( !current_user_can( 'edit_user', $user_id ) ) { 
			return false; 
		}
	
		// save english name
		if( isset( $_POST[ 'EN_Last_Name' ] ) && !empty($_POST[ 'EN_Last_Name' ]) ) {
			update_user_meta( $user_id, 'EN_Last_Name', sanitize_text_field( $_POST[ 'EN_Last_Name' ] ) );
		} else {
			delete_user_meta( $user_id, 'EN_Last_Name' );
		}
		if( isset( $_POST[ 'EN_First_Name' ] ) && !empty($_POST[ 'EN_First_Name' ]) ) {
			update_user_meta( $user_id, 'EN_First_Name', sanitize_text_field( $_POST[ 'EN_First_Name' ] ) );
		} else {
			delete_user_meta( $user_id, 'EN_First_Name' );
		}

	
		// Enrollment_Year at first
		if( isset( $_POST[ 'Enrollment_Year' ] ) && ! empty($_POST[ 'Enrollment_Year' ]) ) {
			// couldn't be deleted after input
			update_user_meta( $user_id, 'Enrollment_Year', sanitize_text_field( strval($_POST[ 'Enrollment_Year' ]) ) );
		}
	
		// Enrollment_Year second
		if ( isset( $_POST[ 'Graduate_Year' ] ) && ! empty($_POST[ 'Graduate_Year' ]) ) {
			$_G = intval($_POST[ 'Graduate_Year' ]);
			// input Enrollment_Year at the same time
			if ( isset( $_POST[ 'Enrollment_Year' ] ) && ! empty($_POST[ 'Enrollment_Year' ]) ) {
				$_E = intval($_POST[ 'Enrollment_Year' ]);
				// Graduate_Year should bigger than Enrollment_Year
				if ( $_G > $_E ) {
					update_user_meta( $user_id, 'Graduate_Year', sanitize_text_field( strval($_POST[ 'Graduate_Year' ]) ) );
				} else {
					$this->errors = True;
					$this->graduate_year_small = __( '<strong>ERROR</strong>: Your graduate year is smaller or equal to enrollment year.', 'YANN_NTNUSMIL' );
				}
	
			// before input Enrollment_Year, Enrollment_Year did not be inputed
			} else if ( ! isset( $_POST[ 'Enrollment_Year' ] ) && ! isset( $_POST[ 'Enrollment_Year_Lock' ] ) ) {
				$this->errors = True;
				$this->enrollment_year_none = __( '<strong>ERROR</strong>: Your should input your enrollment year first.', 'YANN_NTNUSMIL' );
			// after input Enrollment_Year
			} else if ( ! isset( $_POST[ 'Enrollment_Year' ] ) && isset( $_POST[ 'Enrollment_Year_Lock' ] ) ) {
				$_E = intval($_POST[ 'Enrollment_Year_Lock' ]);
				// Graduate_Year should bigger than Enrollment_Year
				if ( $_G > $_E ) {
					update_user_meta( $user_id, 'Graduate_Year', sanitize_text_field( strval($_POST[ 'Graduate_Year' ]) ) );
				} else {
					$this->errors = True;
					$this->graduate_year_small = __( '<strong>ERROR</strong>: Your graduate year is smaller or equal to enrollment year.', 'YANN_NTNUSMIL' );
				}
			}
		} else {
			// Enrollment_Year can be deleted
			delete_user_meta( $user_id, 'Graduate_Year' );
		}
	
		if ( isset( $_POST[ 'Bachelor' ] ) && ! empty( $_POST[ 'Bachelor' ] ) ) {
			update_user_meta( $user_id, '_Bachelor', sanitize_text_field( $_POST[ 'Bachelor' ] ) );
		} else {
			delete_user_meta( $user_id, '_Bachelor' );
		}
		
		if ( isset( $_POST[ 'Research_Topic' ] ) && ! empty( $_POST[ 'Research_Topic' ] ) ) {
			update_user_meta( $user_id, 'Research_Topic', sanitize_text_field( $_POST[ 'Research_Topic' ] ) );
		} else {
			delete_user_meta( $user_id, 'Research_Topic' );
		}

		if ( isset( $_POST[ 'github' ] ) && ! empty( $_POST[ 'github' ] ) ) {
			update_user_meta( $user_id, 'github', esc_url_raw( $_POST[ 'github' ] ) );
		} else {
			delete_user_meta( $user_id, 'github' );
		}

		if ( isset( $_POST[ 'gitlab' ] ) && ! empty( $_POST[ 'gitlab' ] ) ) {
			update_user_meta( $user_id, 'gitlab', esc_url_raw( $_POST[ 'gitlab' ] ) );
		} else {
			delete_user_meta( $user_id, 'gitlab' );
		}

		if ( isset( $_POST[ 'phone' ] ) && ! empty( $_POST[ 'phone' ] ) ) {
			update_user_meta( $user_id, 'phone', esc_url_raw( $_POST[ 'phone' ] ) );
		} else {
			delete_user_meta( $user_id, 'phone' );
		}

		if ( isset( $_POST[ 'contactemail' ] ) && ! empty( $_POST[ 'contactemail' ] ) ) {
			update_user_meta( $user_id, 'contactemail', sanitize_text_field( $_POST[ 'contactemail' ] ) );
		} else {
			delete_user_meta( $user_id, 'contactemail' );
		}

		if ( $_Bachelor = get_user_meta( $user_id, '_Bachelor', true ) ) {
			if ( $_Bachelor === "Master_Student" ) {
				if ( isset( $_POST[ '_Thesis_title' ] ) && ! empty( $_POST[ '_Thesis_title' ] ) ) {
					update_user_meta( $user_id , '_Thesis_title' , sanitize_text_field( $_POST[ '_Thesis_title' ] ) );
				} else {
					delete_user_meta( $user_id, '_Thesis_title' );
				}
			} else if ( $_Bachelor === "PhD_Student" ) {
				if ( isset( $_POST[ '_Dissertation_title' ] ) && ! empty( $_POST[ '_Dissertation_title' ] ) ) {
					update_user_meta( $user_id , '_Dissertation_title' , sanitize_text_field( $_POST[ '_Dissertation_title' ] ) );
				} else {
					delete_user_meta( $user_id, '_Dissertation_title' );
				}
			}
		}
		
		// if error
		if ( $this->errors == True ) {
			add_action( 'user_profile_update_errors' , array( $this, 'YANN_NTNUSMIL_profile_page_user_profile_update_errors' ) );
			return;
		}
		
		// Set success message
		global $pagenow;
		if ( in_array( $pagenow , array( 'profile.php' ) ) && get_user_meta( $user_id , 'first_login' , true ) ) {
			$success = new WP_Error();
			$success->add("Profile_admin_page_update_success_{$user_id}","🎉 恭喜成功更新個人檔案，接下來可以開始使用各樣功能。");
			set_transient("Profile_admin_page_update_success_{$user_id}", $success, 45);
		}

		// Delete First Login
		if ( isset( $_POST[ 'first-login-recognition-length' ] ) && ! empty( $_POST[ 'first-login-recognition-length' ] ) ) {
			if ( ! delete_user_meta( $user_id , 'first_login' ) ) {
				update_user_meta( $user_id , 'first_login' , true );
			}
		}
	}

	/**
	 * Adds errors based on avatar upload problems.
	 *
	 * @param WP_Error $errors Error messages for user profile screen.
	 */
	public function YANN_NTNUSMIL_profile_page_user_profile_update_errors( WP_Error $errors ) {
		if (isset($this->graduate_year_small)) {
			$errors->add( 'graduate_year_small', $this->graduate_year_small );
		}
		if (isset($this->enrollment_year_none)) {
			$errors->add( 'enrollment_year_none', $this->enrollment_year_none );
		}
	}

	/**
	 * Adds stylesheet to Profile Page
	 *
	 */
	// @https://wordpress.stackexchange.com/questions/174753/remove-ability-to-permanently-delete-an-image-from-the-media-library
	public function YANN_NTNUSMIL_admin_profile_styles() {
	?>
		<style>
		.media-sidebar .details .edit-attachment {display: none!important;}
		.media-sidebar .details .delete-attachment {display: none!important;}
		</style>
	<?php
	}

	/**
	 * Admin Notices for First Login in Profile Page
	 *
	 */
	public function YANN_NTNUSMIL_general_profile_notice() {
		global $pagenow;
		if ( in_array( $pagenow , array( 'profile.php' , 'user-edit.php' ) ) ) {
			echo '<div class="notice notice-info is-dismissible"><p>' . __( '<strong>🌟 Notice</strong>: Fields marked (必填) are required.', 'YANN_NTNUSMIL' ) . '</p></div>';
			$current_USERID = get_current_user_id();
			if ( $success = get_transient( "Profile_admin_page_update_success_{$current_USERID}" ) ) { 
				?>
				<div class="notice notice-success is-dismissible">
					<p><?php echo $success->get_error_message(); ?></p>
				</div><?php

				delete_transient("Profile_admin_page_update_success_{$current_USERID}");
			}
		}
	}

	/**
	 * Add scripts to the profile editing page
	 *
	 * @param string $hook_suffix Page hook
	 */
	// @https://wordpress.stackexchange.com/questions/214719/how-do-i-add-a-field-on-the-users-profile-for-example-country-age-etc
	public function YANN_NTNUSMIL_admin_profile_enqueue_scripts( $hook_suffix ) {
		if ( !in_array( $hook_suffix , array( 'profile.php' , 'user-edit.php' ) ) ) {
			return;
		}

		/*** register ***/
		wp_register_script( 'inputmaskjs' , plugins_url( '', dirname( __FILE__ ) ) . '/js/admin/jquery.inputmask.min.js' , array() , false , true );
		wp_register_script( 'profile-first-login-custom-js' , plugins_url( '', dirname( __FILE__ ) ) . '/js/admin/admin-profile-first-login-custom-js.js' , array() , false , true );
		wp_register_style( 'profile-custom-css' , plugins_url( '/css/admin/admin-profile-custom.css', dirname( __FILE__ ) ) );
        wp_register_script( 'profile-validation-and-other-js' , plugins_url( '', dirname( __FILE__ ) ) . '/js/admin/admin-profile-validation-and-other-js.js' , array() , false , true );

		/*** enqueue ***/
        wp_enqueue_style( 'profile-custom-css');
        wp_enqueue_script( 'inputmaskjs' );
        wp_enqueue_script( 'profile-first-login-custom-js' );
        wp_enqueue_script( 'profile-validation-and-other-js' );
		if ( get_current_user_id() !== intval( $this->YANN_root_user_id ) ) {
			if ( get_user_meta( get_current_user_id() , 'first_login' , true ) ) {
				wp_localize_script( 'profile-validation-and-other-js' , 'YANN' , array(
					'ajaxurl' => admin_url( 'admin-ajax.php' ) ,
					'nonce'   => wp_create_nonce( 'YANN-ajax-nonce' ) ,
					'action'  => "YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_action" ,
					'id'      => get_current_user_id(),
				));
			}
		}
	}

	/**
	 * Ajax action for deleting first login after valid submit page
	 *
	 */
	public function YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_handle() {
		$nonce = ( isset( $_POST[ 'nonce' ] ) ) ? wc_clean( wp_unslash( $_POST[ 'nonce' ] ) ) : '';
		if ( ! wp_verify_nonce( $nonce , 'YANN-ajax-nonce' ) ) {
			wp_send_json_error( array( 'error' => true , 'errmessage' => 'Missing parameters' ) );
			wp_die();
		}

		$V = $this->YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_call($_POST);
		if ( array_key_exists( 'success' , $V ) ) {
			wp_send_json_success( $V );
		} else if ( array_key_exists( 'error' , $V ) ) {
			wp_send_json_error( $V );
			wp_die();
		} else {
			wp_send_json_error( array( 'error' => true , 'errmessage' => '哪裡怪怪的，請檢察程式碼修正錯誤' ) );
			wp_die();
		}

	}

	/**
	 * Ajax call for YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_handle function
	 *
	 */
	public function YANN_NTNUSMIL_admin_profile_first_login_delete_ajax_call( $POST ){
		$user_id = ( isset( $POST[ 'id' ] ) ) ? wc_clean( wp_unslash( $POST[ 'id' ] ) ) : '';
		if ( empty( $user_id ) ) {
			return array( 'error' => true , 'errmessage' => 'Missing parameters' );
			wp_die();			
		}
		
		if ( ! delete_user_meta( $user_id , 'first_login' ) ) {
			update_user_meta( $user_id , 'first_login' , true );
			return array( 'error' => true , 'errmessage' => 'Delete first_login failed' );
			wp_die();
		} else {
			return array( 'success' => true , 'data' => 'Delete first_login Successfully' );
		}
	}

}
