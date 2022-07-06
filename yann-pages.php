<?php
/**
 * Plugin Name:       Yann Pages
 * Plugin URI:        https://yannyann.com/
 * Description:       Simple additional profile page fields and 404 pages.
 * Version:           0.0.1
 * Requires at least: 4.6
 * Requires PHP:      5.3
 * Author:            YANNYANN
 * Author URI:        https://yannyann.com/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       yann-pages
 */

require_once dirname( __FILE__ ) . '/includes/admin/class-admin-profile-page-local-avatars.php';
require_once dirname( __FILE__ ) . '/includes/admin/class-admin-profile-page-thesis-upload.php';
require_once dirname( __FILE__ ) . '/includes/admin/class-admin-profile-page.php';
require_once dirname( __FILE__ ) . '/includes/class-home-page.php';
require_once dirname( __FILE__ ) . '/includes/class-404-page.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_hero/class-yann-hero-block.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_banner/class-yann-banner-block.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_points/class-yann-points-block.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_professor/class-yann-professor-block.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_contact/class-yann-contact-block.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_profile_card/class-yann-profile-card-block.php';
require_once dirname( __FILE__ ) . '/includes/blocks/yann_gpu_monitor/class-yann-gpu-monitor-block.php';

/**
 * Profile Page.
 */
global $yann_profile_page;
$yann_profile_page = new YANN_Profile_Page();

/**
 * Avator in Profile Page Section
 */
global $yann_local_avatars;
$yann_local_avatars = new YANN_Local_Avatars();

/**
 * Thesis upload in Profile Page Section
 */
global $thesis_upload;
$thesis_upload = new THESIS_UPLOAD();

/**
 * 404 Page
 */
global $yann_404_page;
$yann_404_page = new YANN_404_Page();

/**
 * Download API
 */
if ( class_exists("DONWLOAD_API") ) {
    global $thesis_download_api;
    $param = array(
        "posttype"=>"thesis",
        "postid_userid"=>"userid",
        "joystick"=>array( "thesis" ),
        "table_for_uploaded_file"=>"CPT_thesis_table_for_uploaded_file",
		"upload_dir"=>"/thesis/",
    );
    $thesis_download_api = new DONWLOAD_API( $param );
} 

/**
 * More efficient to call simple local avatar directly in theme and avoid
 * gravatar setup.
 *
 * Since 2.2, This function is only a proxy for get_avatar due to internal changes.
 *
 * @param int|string|object $id_or_email A user ID,  email address, or comment object
 * @param int               $size        Size of the avatar image
 * @param string            $default     URL to a default image to use if no avatar is available
 * @param string            $alt         Alternate text to use in image tag. Defaults to blank
 * @param array             $args        Optional. Extra arguments to retrieve the avatar.
 *
 * @return string <img> tag for the user's avatar
 */
function get_yann_local_avatar( $id_or_email, $size = 96, $default = '', $alt = '', $args = array() ) {
	return apply_filters( 'yann_local_avatar', get_avatar( $id_or_email, $size, $default, $alt, $args ) );
}

register_uninstall_hook( __FILE__, 'yann_local_avatars_uninstall' );
/**
 * On uninstallation, remove the custom field from the users and delete the local avatars
 */
function yann_local_avatars_uninstall() {
	$yann_local_avatars = new YANN_Local_Avatars();
	$users                = get_users(
		array(
			'meta_key' => 'yann_local_avatar',
			'fields'   => 'ids',
		)
	);

	foreach ( $users as $user_id ) :
		$yann_local_avatars->avatar_delete( $user_id );
	endforeach;

	delete_option( 'yann_local_avatars' );
}
