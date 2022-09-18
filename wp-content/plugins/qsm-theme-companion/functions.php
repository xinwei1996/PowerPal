<?php

/**
 * Include style and script for quiz theme
 */
add_action( 'qsm_enqueue_script_style', 'qsm_theme_quiz_companion_style' );
if ( ! function_exists( 'qsm_theme_quiz_companion_style' ) ) {
	/**
	 * QSM companion theme style
	 *
	 * @since 1.0.0
	 * @param object $qmn_quiz_options Quiz options.
	 * @return void
	 */
	function qsm_theme_quiz_companion_style( $qmn_quiz_options ) {
		global $mlwQuizMasterNext;
		$quiz_id              = $qmn_quiz_options->quiz_id;
		$featured_image       = get_option( "quiz_featured_image_$quiz_id" );
		$randomness_order = $qmn_quiz_options->randomness_order;
		$saved_quiz_theme     = $mlwQuizMasterNext->theme_settings->get_active_quiz_theme_path( $quiz_id );
		$quiz_settings        = isset( $qmn_quiz_options->quiz_settings ) ? maybe_unserialize( $qmn_quiz_options->quiz_settings ) : array();
		$get_saved_quiz_theme = isset( $quiz_settings['quiz_new_theme'] ) ? $quiz_settings['quiz_new_theme'] : '';
		$progress_bar         = $qmn_quiz_options->progress_bar;
		$folder_slug          = QSM_THEME_SLUG . $saved_quiz_theme;
		wp_enqueue_script( 'qsm_theme_companion_js', QSM_THEME_COMPANION_JS_URL . '/qsm_theme.js', array( 'jquery' ), QSM_THEME_COMPANION_VERSION, true );
		wp_enqueue_style( 'qsm_theme_companion_css', QSM_THEME_COMPANION_CSS_URL . '/style.css', array(), QSM_THEME_COMPANION_VERSION );
		$theme_id           = $mlwQuizMasterNext->theme_settings->get_active_quiz_theme( $quiz_id );
		$get_theme_settings = $mlwQuizMasterNext->theme_settings->get_active_theme_settings( $quiz_id, $theme_id );
		$color_data         = array();
		foreach ( $get_theme_settings as $data ) {
			$color_data[ $data['id'] ] = $data['default'];
		}

		wp_localize_script(
			'qsm_theme_companion_js',
			'qsm_theme_companion_object_'.$quiz_id,
			array(
				'featured_image'   => $featured_image,
				'randomness_order' => $randomness_order,
			)
		);

		$get_theme_settings     = $color_data;
		$css_root           = ':root {';
		if ( isset( $get_theme_settings['background_color'] ) && '' !== $get_theme_settings['background_color'] ) {
			$css_root .= '--companion-background-color: ' . $get_theme_settings['background_color'] . ' !important;';
		}
		if ( isset( $get_theme_settings['primary_color'] ) && '' !== $get_theme_settings['primary_color'] ) {
			$css_root .= '--companion-primary-color: ' . $get_theme_settings['primary_color'] . ' !important;';
		}
		if ( isset( $get_theme_settings['secondary_color'] ) && '' !== $get_theme_settings['secondary_color'] ) {
			$css_root .= '--companion-secondary-color: ' . $get_theme_settings['secondary_color'] . ' !important;';
		}
		if ( isset( $get_theme_settings['title_color'] ) && '' !== $get_theme_settings['title_color'] ) {
			$css_root .= '--companion-title-color: ' . $get_theme_settings['title_color'] . ' !important;';
		}
		if ( isset( $get_theme_settings['text_color'] ) && '' !== $get_theme_settings['text_color'] ) {
			$css_root .= '--companion-text-color: ' . $get_theme_settings['text_color'] . ' !important;';
		}
		$css_root .= '}';
		if ( isset( $get_theme_settings['primary_color'] ) && '' !== $get_theme_settings['primary_color'] ) {
			$css_root .= '.qsm-svg-holder svg path {
				fill : ' . $get_theme_settings['primary_color'] . ';
			}';
		}
		wp_add_inline_style( 'qsm_theme_companion_css', $css_root );
		$font_color = isset( $get_theme_settings['font_color'] ) && '' !== $get_theme_settings['font_color'] ? $get_theme_settings['font_color'] : '';
	}
}

add_filter( 'qmn_begin_shortcode', 'companion_footer', 10, 3 );
if ( ! function_exists( 'companion_footer' ) ) {
	function companion_footer( $return_display, $qmn_quiz_options, $qmn_array_for_variables ) {
		global $mlwQuizMasterNext;
		$saved_quiz_theme = $mlwQuizMasterNext->quiz_settings->get_setting( 'quiz_new_theme' );
		$quiz_settings    = isset( $qmn_quiz_options->quiz_settings ) ? maybe_unserialize( $qmn_quiz_options->quiz_settings ) : array();
		return $return_display;
	}
}