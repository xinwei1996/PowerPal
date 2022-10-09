<?php
$is_settings = isset( $_GET['tab'] ) && sanitize_text_field( $_GET['tab'] ) === 'settings'; // phpcs:ignore WordPress.Security.NonceVerification

?>

<div class="ccb-settings-wrapper calculator-settings">
	<calc-builder inline-template>
		<div class="ccb-main-container">
			<template v-if="!$store.getters.getHideHeader">
				<?php require_once CALC_PATH . '/templates/admin/components/header.php'; ?>
			</template>
			<div class="ccb-tab-content">
				<div class="ccb-tab-sections ccb-loader-section" v-if="loader">
					<loader></loader>
				</div>
				<template v-else>
					<?php if ( $is_settings ) : ?>
						<general-settings inline-template>
							<?php require_once CALC_PATH . '/templates/admin/pages/settings.php'; ?>
						</general-settings>
					<?php else : ?>
						<calculators-page inline-template>
							<?php require_once CALC_PATH . '/templates/admin/pages/calculator.php'; ?>
						</calculators-page>
					<?php endif; ?>
				</template>
			</div>
		</div>
	</calc-builder>
</div>
