<?php
/**
 * Class: YANN_404_Page
 * 404 page
 */
class YANN_404_Page {
	private $errors;
	private $template;

	/**
	 * Set up the hooks and default values
	 */
	public function __construct() {
		$this->errors = False;
		$this->YANN_root_user_id = 1;
		$this->fzf_page_arr = array(
			"post_type" => "page",
			"post_title" => "404page",
			"post_name" => "404page",
			"post_status" => "publish",
		);
		$this->fzf_page_id = "";
		$this->fzf_page_tag = "YANN_NTNUSMIL_fzf_page_tag";
		$this->fzf_page_tag_val = true;
		$this->add_hooks();
	}

	/**
	 * Register actions and filters.
	 */
	public function add_hooks() {
		add_filter( 'wp', array( $this, 'YANN_NTNUSMIL_create_404_page' ), 999 );
		add_filter( '404_template' , array( $this, 'YANN_NTNUSMIL_404_template_replace' ) , 1 , 1 );
		add_action( 'wp_enqueue_scripts' , array( $this, 'YANN_NTNUSMIL_404_enqueue_script' ) , 15 , 0 );
	}

	/**
	 * Register actions and filters.
	 */
	public function YANN_NTNUSMIL_404_template_replace( $template ) {
		
		// @since 4
		// fix for an ugly bbPress problem
		// see https://wordpress.org/support/topic/not-fully-bbpress-compatible/
		// see https://bbpress.trac.wordpress.org/ticket/3161
		// if a bbPress member page is shown and the member has no topics created yet the 404_template filter hook fires
		// this is a bbPress problem but it has not been fixed since 6 months
		// so let's bypass the problem
		if ( function_exists( 'bbp_is_single_user' ) ) {
			if ( bbp_is_single_user() ) {
				return $template;
			}
		}
		  
		$this->YANN_NTNUSMIL_disable_caching();
	
		// Try to locate our custom 404 template
		$new_404_template = load_template( dirname( __FILE__ ) . '/pages/404.php' );
	
		// Override if it was found    
		if ( $new_404_template ) {
			$template = $new_404_template;
		}
		rewind_posts();
		return $template;
	}

    /**
     * disable caching for known caching plugins
     * 
     * @since 11.2.0
     */
    public function YANN_NTNUSMIL_disable_caching() {
      
		// WP Super Cache
		if ( defined( 'WPCACHEHOME' ) ) {
			global $cache_enabled;

			// is caching active?
			if ( $cache_enabled ) {
				define( 'DONOTCACHEPAGE', true );
			}
		}

		// W3 Total Cache
		if ( defined( 'W3TC' ) ) {
			if ( class_exists( 'W3TC\Dispatcher' ) ) {
				
				// is caching active?
				if ( W3TC\Dispatcher::config()->get_boolean( 'pgcache.enabled' ) ) {
					define( 'DONOTCACHEPAGE', true );
				}	
			}
		}
	}


    /**
     * get the id of the 404 page in the current language if WPML or Polylang is active
     * public since v 11.1.0 to use it in pp_404_get_page_id()
     */
	public function YANN_NTNUSMIL_get_page_id() {
	
		$pageid = $this->fzf_page_id;
		
		if ( $pageid > 0 ) {
			if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
				
				// WPML is active
				$pageid = apply_filters( 'wpml_object_id', $pageid, 'page', true ); 
			} elseif ( function_exists( 'pll_get_post' ) ) {
			
				// was defined( 'POLYLANG_VERSION' ) before version 11.2.3
				// Polylang is active
				$translatedpageid = pll_get_post( $pageid );
				if ( !empty( $translatedpageid ) && 'publish' == get_post_status( $translatedpageid ) ) {
					$pageid = $translatedpageid;
				}
			}
		}
		
		return $pageid;
	}

    /**
     * Create a custom 404 page
     *
     */
	public function YANN_NTNUSMIL_create_404_page() {

		// search 404 page
		$search_arr = $this->fzf_page_arr;
		$search_arr['meta_query'] = array(
			array(
				'key'   => $this->fzf_page_tag,
				'value' => $this->fzf_page_tag_val,
				'compare' => 'LIKE'
			),
		);
		$wp_query = new WP_Query($search_arr);
		$posts = $wp_query->posts;
		if (!empty($posts)) {
			foreach($posts as $post) {
				$this->fzf_page_id = $post->ID;
				break;
			}
		}

		// create 404 page
		if (empty($posts)) {
			$tmp_arr =  $this->fzf_page_arr;
			$tmp_arr["post_author"] = $this->YANN_root_user_id;
			$post_id = wp_insert_post( $tmp_arr );
			update_post_meta( $post_id , $this->fzf_page_tag , $this->fzf_page_tag_val );		
			$this->fzf_page_id = $post_id;
		}
	}

    /**
     * Enqueue scripts for 404 page
     *
     */
	// @https://stackoverflow.com/questions/50461666/how-to-disable-fps-display-in-ar-js-three-js
	// @https://codepen.io/FRADAR/pen/dyvrapm
	public function YANN_NTNUSMIL_404_enqueue_script() {
		if ( is_404() ) {
			wp_enqueue_style( '404css' , plugins_url( '', dirname( __FILE__ ) ) . '/includes/css/pages/404css.css' , array() , false , 'all' );
		}
	}
}
