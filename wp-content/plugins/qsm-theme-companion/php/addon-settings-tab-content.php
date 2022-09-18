<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers your tab in the addon  settings page
 *
 * @since 1.0.0
 * @return void
 */
function qsm_addon_theme_companion_register_stats_tabs() {
	global $mlwQuizMasterNext;
	if ( ! is_null( $mlwQuizMasterNext ) && ! is_null( $mlwQuizMasterNext->pluginHelper ) && method_exists( $mlwQuizMasterNext->pluginHelper, 'register_quiz_settings_tabs' ) ) {
		$mlwQuizMasterNext->pluginHelper->register_addon_settings_tab( 'QSM Theme Companion', 'qsm_addon_theme_companion_addon_settings_tabs_content' );
	}
}

/**
 * Generates the content for your addon settings tab
 *
 * @since 1.0.0
 * @return void
 */
function qsm_addon_theme_companion_addon_settings_tabs_content() {
	global $mlwQuizMasterNext;

	// If nonce is correct, update settings from passed input
	if ( isset( $_POST['theme_companion_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['theme_companion_nonce'] ) ), 'theme_companion' ) ) {

		// Load previous license key
		$theme_data = get_option( 'qsm_addon_theme_companion_settings', '' );
		if ( isset( $logic_data['license_key'] ) ) {
			$license = trim( $theme_data['license_key'] );
		} else {
			$license = '';
		}

		// Save settings
		$saved_license = isset( $_POST['license_key'] ) ? sanitize_text_field( wp_unslash( $_POST['license_key'] ) ) : '';
		$theme_data    = array(
			'license_key' => $saved_license,
		);
		update_option( 'qsm_addon_theme_companion_settings', $theme_data );

		// Checks to see if the license key has changed
		if ( $license != $saved_license ) {

			// Prepares data to activate the license
			$api_params = array(
				'edd_action' => 'activate_license',
				'license'    => $saved_license,
				'item_name'  => rawurlencode( 'Companion' ), // the name of our product in EDD
				'url'        => home_url(),
			);

			// Call the custom API.
			$response = wp_remote_post(
				'http://quizandsurveymaster.com',
				array(
					'timeout'   => 15,
					'sslverify' => false,
					'body'      => $api_params,
				)
			);

			// If previous license key was entered
			if ( ! empty( $license ) ) {

				// Prepares data to deactivate changed license
				$api_params = array(
					'edd_action' => 'deactivate_license',
					'license'    => $license,
					'item_name'  => rawurlencode( 'Companion' ), // the name of our product in EDD
					'url'        => home_url(),
				);

				// Call the custom API.
				$response = wp_remote_post(
					'http://quizandsurveymaster.com',
					array(
						'timeout'   => 15,
						'sslverify' => false,
						'body'      => $api_params,
					)
				);
			}
		}
		$mlwQuizMasterNext->alertManager->newAlert( 'Your settings has been saved successfully! You can now analyze your results on the Results page.', 'success' );
	}

	// Load settings
	$theme_data     = get_option( 'qsm_addon_theme_companion_settings', '' );
	$theme_defaults = array(
		'license_key' => '',
	);
	$theme_data     = wp_parse_args( $theme_data, $theme_defaults );

	// Show any alerts from saving
	$mlwQuizMasterNext->alertManager->showAlerts();
	?>
<form action="" method="post">
	<table class="form-table" style="width: 100%;">
		<tr valign="top">
			<th scope="row"><label for="license_key"><?php esc_html_e('Addon License Key', 'qsm-companion'); ?></label></th>
			<td><input type="text" name="license_key" id="license_key"
					value="<?php echo esc_attr( $theme_data['license_key'] ); ?>"></td>
		</tr>
	</table>
	<?php wp_nonce_field( 'theme_companion', 'theme_companion_nonce' ); ?>
	<button class="button-primary"><?php esc_html_e('Save Changes', 'qsm-companion'); ?></button>
</form>
<?php
}
?>