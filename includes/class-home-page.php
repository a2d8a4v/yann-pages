<?php
/**
 * Class: YANN_Home_Page
 * Simple additional home page.
 */
class YANN_Home_Page {
	private $errors;

	/**
	 * Set up the hooks and default values
	 */
	public function __construct() {
		$this->errors = False;
		$this->YANN_root_user_id = 1;
		$this->add_hooks();
	}

	/**
	 * Register actions and filters.
	 */
	public function add_hooks() {
	}
 }
