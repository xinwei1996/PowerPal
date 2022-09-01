<?php
global $posterity_a13;

$variant         = $posterity_a13->get_option( 'header_horizontal_variant' );

$header_content_width = $posterity_a13->get_option( 'header_content_width' );
$header_width = ' ' . $header_content_width;
if($header_content_width === 'narrow' && $posterity_a13->get_option( 'header_content_width_narrow_bg') === 'on' ){
	$header_width .= ' narrow-header';
}

$header_classes = 'to-move a13-horizontal header-type-one_line a13-'.posterity_horizontal_header_color_variant().'-variant header-variant-' . $variant . $header_width;

$menu_on        = $posterity_a13->get_option( 'header_main_menu' ) === 'on';
$socials        = $posterity_a13->get_option( 'header_socials' ) === 'on';

$icons_no     = 0;
$header_tools = posterity_get_header_toolbar( $icons_no );
if ( ! $icons_no ) {
	$header_classes .= ' no-tools';
} else {
	$header_classes .= ' tools-icons-' . $icons_no; //number of icons
}

//how sticky version will behave
$header_classes .= ' '.$posterity_a13->get_option( 'header_horizontal_sticky' );

//hide until it is scrolled to
$show_header_at = $posterity_a13->posterity_get_meta('_horizontal_header_show_header_at' );
if(strlen($show_header_at) && $show_header_at > 0){
	$header_classes .= ' hide-until-scrolled-to';
}

// top bar
$header_topbar     = $posterity_a13->get_option( 'header_topbar' ) === 'on';
$header_topbar_left_text1     = $posterity_a13->get_option( 'header_topbar_left_text1' );
$header_topbar_left_text2     = $posterity_a13->get_option( 'header_topbar_left_text2' );
$header_topbar_right_text1     = $posterity_a13->get_option( 'header_topbar_right_text1' );
?>

<header id="header" class="<?php echo esc_attr( $header_classes ); ?>"<?php posterity_schema_args( 'header' ); ?>>
	<?php if ( $header_topbar ): ?>
	<div id="topbar">
      <div class="topleft">
        <?php if(!empty($header_topbar_left_text1)){ ?>
        <span class="qstn"><?php echo esc_html($header_topbar_left_text1); ?></span>
        <?php } ?>
        <?php if(!empty($header_topbar_left_text2)){ ?>
        <span class="emltp"> <i class="fa fa-envelope" aria-hidden="true"></i> <?php echo esc_html($header_topbar_left_text2); ?></span>
        <?php } ?>
      </div>
      <div class="topright">
      	<?php if(!empty($header_topbar_right_text1)){ ?>
        <span class="phnnumber"> <i class="fa fa-phone" aria-hidden="true"></i> <?php echo esc_html($header_topbar_right_text1); ?></span>
        <?php } ?>
        <span class="tpsocial">
         <?php if ( $socials ) {
			//check what color variant we use
			$color_variant = posterity_horizontal_header_color_variant();
			$color_variant = $color_variant === 'normal' ? '' : '_'.$color_variant;

			//escaped on creation
			echo wp_kses_post(posterity_social_icons(
				$posterity_a13->get_option( 'header'.$color_variant.'_socials_color' ),
				$posterity_a13->get_option( 'header'.$color_variant.'_socials_color_hover' ),
				'',
				$posterity_a13->get_option( 'header_socials_display_on_mobile' ) === 'off'
			));
		} ?>
        </span></div>
  	  <div class="clear"></div>
	</div> 	
    <?php endif; ?> 	
	<div class="head walker-wraper hdrpart">
		<div class="logo-container"<?php posterity_schema_args('logo'); ?>><?php posterity_header_logo(); ?></div>
		<?php if ( $menu_on ): ?>
        <div id="navigation"><nav id="site-navigation" class="main-navigation">
				<button type="button" class="menu-toggle">
					<span></span>
					<span></span>
					<span></span>
				</button>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'header-menu'
					)
				);
				?>
			</nav></div>
        <?php endif; ?>
		<!-- #access -->
		<?php echo wp_kses_post($header_tools );//escaped layout part ?>
	</div>
</header>