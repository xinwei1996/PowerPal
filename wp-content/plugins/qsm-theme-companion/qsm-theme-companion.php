<?php
/**
 * Plugin Name: QSM Theme - Companion
 * Plugin URI: https://quizandsurveymaster.com
 * Description: Free quiz theme for Quiz & Survey Master plugin
 * Author: QSM Team
 * Author URI: https://quizandsurveymaster.com
 * Version: 1.0.0
 *
 * @author QSM Team
 * @version 1.0.0
 */

class QSM_Theme_Companion {

	/**
	 * Version Number
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public $version = '1.0.0';

	/**
	 * Main Construct Function
	 *
	 * Call functions within class
	 *
	 * @since 1.0.0
	 * @uses QSMThemeCompanion::load_dependencies() Loads required filed
	 * @uses QSMThemeCompanion::check_license() check license
	 * @uses QSMThemeCompanion::add_hooks() Adds actions to hooks and filters
	 * @return void
	 */
	public function __construct() {
		define( 'QSM_THEME_COMPANION_VERSION', $this->version );
		define( 'QSM_THEME_COMPANION_URL', plugin_dir_url( __FILE__ ) );
		define( 'QSM_THEME_COMPANION_PATH', plugin_dir_path( __FILE__ ) );
		define( 'QSM_THEME_COMPANION_CSS_URL', QSM_THEME_COMPANION_URL . 'css' );
		define( 'QSM_THEME_COMPANION_JS_URL', QSM_THEME_COMPANION_URL . 'js' );
		define( 'QSM_THEME_COMPANION_PHP_DIR', QSM_THEME_COMPANION_PATH . 'php' );
		$this->load_dependencies();
		$this->check_license();
		$this->add_hooks();
	}

	public function load_dependencies() {
		include 'php/addon-settings-tab-content.php';
		include 'php/admin_hooks.php';
	}

	/**
	 * Add Hooks
	 *
	 * Adds functions to relavent hooks and filters
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function add_hooks() {
		add_action( 'admin_init', 'qsm_addon_theme_companion_register_stats_tabs' );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ));
	}

	public function admin_scripts(){
		wp_enqueue_script( 'qsm_theme_admin', QSM_THEME_COMPANION_JS_URL . '/qsm-theme-admin.js', array( 'jquery' ), QSM_THEME_COMPANION_VERSION, true );
	}

	/**
	 * Checks license
	 *
	 * Checks to see if license is active and, if so, checks for updates
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function check_license() {

		if ( ! class_exists( 'EDD_SL_Plugin_Updater' ) ) {
			// Loads our custom updater.
			include 'php/EDD_SL_Plugin_Updater.php';
		}

		// Retrieves our license key from the DB.
		$theme_data = get_option( 'qsm_addon_theme_settings', '' );
		if ( isset( $theme_data['license_key'] ) ) {
			$license_key = trim( $theme_data['license_key'] );
		} else {
			$license_key = '';
		}

		// Sets up the updater.
		$edd_updater = new EDD_SL_Plugin_Updater(
			'https://quizandsurveymaster.com',
			__FILE__,
			array(
				'version'   => $this->version,
				'license'   => $license_key,
				'item_name' => 'Companion', // need to be changed
				'author'    => 'QSM Team', // need to be changed
			)
		);
	}

	/**
	 * Default settings value
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public static function default_setting() {
		$settings   = array();
		$settings[] = array(
			'id'      => 'background_color',
			'label'   => __( 'Background Color', 'qsm-companion' ),
			'type'    => 'color',
			'default' => '#ffffff',
		);
		$settings[] = array(
			'id'      => 'primary_color',
			'label'   => __( 'Primary Color', 'qsm-companion' ),
			'type'    => 'color',
			'default' => '#26BFCA',
		);
		$settings[] = array(
			'id'      => 'secondary_color',
			'label'   => __( 'Secondary Color', 'qsm-companion' ),
			'type'    => 'color',
			'default' => '#ffffff',
		);
		$settings[] = array(
			'id'      => 'title_color',
			'label'   => __( 'Question Color', 'qsm-companion' ),
			'type'    => 'color',
			'default' => '#1D4759',
		);
		$settings[] = array(
			'id'      => 'text_color',
			'label'   => __( 'Text Color', 'qsm-companion' ),
			'type'    => 'color',
			'default' => '#547482',
		);

		return maybe_serialize( $settings );
	}
}

add_action( 'plugins_loaded', 'qsm_addon_companion_load' );

/**
 * Checks if QSM version 7.2.0 or above is installed
 *
 * @since 1.0.0
 * @return void
 */
function qsm_addon_companion_load() {
	$deactivate = true;
	if ( class_exists( 'MLWQuizMasterNext' ) ) {
		global $mlwQuizMasterNext;
			$current_version = $mlwQuizMasterNext->version;
		if ( version_compare( $current_version, '7.2.0', '>=' ) ) {
			new QSM_Theme_Companion();
			$deactivate = false;
		} else {
			add_action( 'admin_notices', 'qsm_addon_companion_version_qsm' );
		}
	} else {
		add_action( 'admin_notices', 'qsm_addon_companion_missing_qsm' );
	}
	if ( $deactivate ) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
		$dir  = basename( dirname( __FILE__ ) );
		$file = basename( __FILE__ );
		deactivate_plugins( $dir . '/' . $file );
	}
}

/**
 * Generates admin notice if QSM is not installed
 *
 * @since 1.0.0
 * @return void
 */
function qsm_addon_companion_missing_qsm() {
	echo '<div class="error"><p>QSM - Themes requires Quiz And Survey Master. Please install and activate the Quiz And Survey Master plugin.</p></div>';
}

/**
 * Genereates admin notice if installed QSM in below 7.2.0
 *
 * @return void
 */
function qsm_addon_companion_version_qsm() {
	echo '<div class="error"><p>QSM - Themes requires at least Quiz And Survey Master V 7.2.0. Please update and reinstall</p></div>';
}

/**
 * Updates theme and default settings
 */
register_activation_hook(
	__FILE__,
	function () {
		if ( class_exists( 'MLWQuizMasterNext' ) ) {
			global $mlwQuizMasterNext;
				$current_version = $mlwQuizMasterNext->version;
			if ( version_compare( $current_version, '7.2.0', '>=' ) ) {
				$name     = 'Companion';
				$settings = QSM_Theme_Companion::default_setting();
				$dir      = basename( dirname( __FILE__ ) );
				$mlwQuizMasterNext->theme_settings->update_theme_status( true, $dir, $name, $settings );
			}
		}
	}
);

/**
 * Deactivates theme
 */
register_deactivation_hook(
	__FILE__,
	function () {
		if ( class_exists( 'MLWQuizMasterNext' ) ) {
			global $mlwQuizMasterNext;
				$current_version = $mlwQuizMasterNext->version;
			if ( version_compare( $current_version, '7.2.0', '>=' ) ) {
				$dir = basename( dirname( __FILE__ ) );
				$mlwQuizMasterNext->theme_settings->update_theme_status( false, $dir );}
		}
	}
);
