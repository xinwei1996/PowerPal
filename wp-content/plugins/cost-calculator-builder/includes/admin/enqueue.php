<?php

use cBuilder\Classes\CCBTranslations;
use cBuilder\Helpers\CCBConditionsHelper;
use cBuilder\Helpers\CCBFieldsHelper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function cBuilder_admin_enqueue() {
	wp_enqueue_style( 'ccb-global-styles', CALC_URL . '/frontend/dist/css/global.css', array(), CALC_VERSION );
	wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/dist/css/icon/style.css', array(), CALC_VERSION );

	if ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder' ) ) { //phpcs:ignore

		/** Loading wp media libraries **/
		wp_enqueue_media();
		wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
		wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = _.noConflict();' );

		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/dist/css/material-styles.css', array(), CALC_VERSION );

		wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/dist/bundle.js', array( 'ccb-lodash-js' ), CALC_VERSION, true );
		wp_enqueue_script( 'ccb-quick-tour-core-js', CALC_URL . '/frontend/dist/quick-tour/quick-tour-core.js', array( 'cbb-bundle-js' ), CALC_VERSION, true );

		wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/dist/feedback.js', array(), CALC_VERSION, true );
		wp_localize_script(
			'cbb-bundle-js',
			'ajax_window',
			array(
				'ajax_url'          => admin_url( 'admin-ajax.php' ),
				'condition_actions' => CCBConditionsHelper::getActions(),
				'condition_states'  => CCBConditionsHelper::getConditionStates(),
				'dateFormat'        => get_option( 'date_format' ),
				'language'          => substr( get_bloginfo( 'language' ), 0, 2 ),
				'plugin_url'        => CALC_URL,
				'templates'         => CCBFieldsHelper::get_fields_templates(),
				'translations'      => array_merge( CCBTranslations::get_frontend_translations(), CCBTranslations::get_backend_translations() ),
				'pro_active'        => ccb_pro_active(),
			)
		);
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_gopro' ) ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-gopro-css', CALC_URL . '/frontend/dist/css/gopro.css', array(), CALC_VERSION );
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_orders' ) ) { //phpcs:ignore
		wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
		wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = _.noConflict();' );
		wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/dist/feedback.js', array(), CALC_VERSION, true );
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/dist/css/material-styles.css', array(), CALC_VERSION );
		wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/dist/bundle.js', array( 'ccb-lodash-js' ), CALC_VERSION, true );

		wp_localize_script(
			'cbb-bundle-js',
			'ajax_window',
			array(
				'ajax_url'     => admin_url( 'admin-ajax.php' ),
				'plugin_url'   => CALC_URL,
				'language'     => substr( get_bloginfo( 'language' ), 0, 2 ),
				'translations' => CCBTranslations::get_backend_translations(),
			)
		);
	} elseif ( ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-affiliation' ) ) // phpcs:ignore
		|| ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-account' ) ) // phpcs:ignore
		|| ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-contact' ) ) // phpcs:ignore
	) {
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
	}
}

add_action( 'admin_enqueue_scripts', 'cBuilder_admin_enqueue', 1 );
