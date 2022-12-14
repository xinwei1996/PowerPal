function wpda_show_table_actions( schema_name, table_name, rownum, wpnonce, dbo_type, loading ) {
    jQuery('#wpda_admin_menu_actions_' + rownum).toggle();
    wpda_toggle_row_actions(rownum);
    if (jQuery('#wpda_admin_menu_actions_' + rownum).html()===loading) {
        url = location.pathname + '?action=wpda_show_table_actions';
        jQuery.ajax({
            method: 'POST',
            url: url,
            data: {
				wpdaschema_name: schema_name,
				table_name: table_name,
				_wpnonce: wpnonce,
				dbo_type: dbo_type,
				rownum: rownum
			}
        }).done(
            function(msg) {
                jQuery('#wpda_admin_menu_actions_' + rownum).html(msg);
            }
        );
    }
}

function wpda_toggle_row_actions( rownum ) {
    if (jQuery('#wpda_admin_menu_actions_' + rownum).is(":visible")) {
        jQuery("#rownum_" + rownum + " td div").removeClass("row-actions");
	} else {
        jQuery("#rownum_" + rownum + " td div").addClass("row-actions");
	}
}

function wpda_list_table_favourite( schema_name, table_name )  {
	if (jQuery('#span_favourites_'+ table_name).hasClass('dashicons-star-empty')) {
		action = 'wpda_add_favourite';
	} else {
		action = 'wpda_rem_favourite';
	}
	url = location.pathname + '?action=' + action;
	jQuery.ajax({
		method: 'POST',
		url: url,
		data: {
			wpdaschema_name: schema_name,
			table_name: table_name
		}
	}).done(
		function (msg) {
			if (msg === '1') {
				if (jQuery('#span_favourites_' + table_name).hasClass('dashicons-star-empty')) {
					jQuery('#span_favourites_' + table_name)
					.removeClass('dashicons-star-empty')
					.addClass('dashicons-star-filled')
					.prop('title', 'Remove from favourites');
				} else {
					jQuery('#span_favourites_' + table_name)
					.removeClass('dashicons-star-filled')
					.addClass('dashicons-star-empty')
					.prop('title', 'Add to favourites');
				}
				if (jQuery('#wpda_main_favourites_list').val()!=='') {
                    jQuery("#wpda_main_form :input[name='action']").val('-1');
                    jQuery("#wpda_main_form :input[name='action2']").val('-1');
					jQuery('#wpda_main_form').submit();
				}
			} else {
				alert('Adding to favourites failed!');
			}
		}
	);
}

function wpda_main_export_start() {
	jQuery("#wpda_main_export_form").submit();
	jQuery("#wpda_row_export_anchor").empty();

	return false;
}

function wpda_main_export(schemaName, wpnonce, selectedRows) {
	jQuery("#wpda_main_export_form__schema_name").val(schemaName);
	jQuery("#wpda_main_export_form__wpnonce").val(wpnonce);

	rows = JSON.parse(selectedRows);
	for (var i=0; i<rows.length; i++) {
		jQuery("#wpda_main_export_form").append("<input type='hidden' name='table_names[]' value='" + rows[i] + "' />");
	}

	jQuery("#wpda_row_export_anchor").append(
		"<button class='button button-primary wpda_row_export_button' onclick='return wpda_main_export_start();'>Download export</button>"
	);
}

function wpda_table_export(schemaName, tableNames, wpnonce, formatType, includeTableSettings) {
	jQuery("#wpda_table_export_form__schema_name").val(schemaName);
	jQuery("#wpda_table_export_form__table_names").val(tableNames);
	jQuery("#wpda_table_export_form__format_type").val(formatType);
	jQuery("#wpda_table_export_form__wpnonce").val(wpnonce);
	jQuery("#wpda_table_export_form__include_table_settings").val(includeTableSettings);

	jQuery("#wpda_table_export_form").submit();
}

function wpda_row_export_start() {
	jQuery("#wpda_row_export_form").submit();
	jQuery("#wpda_row_export_anchor").empty();

	return false;
}

function wpda_row_export(pid, schemaName, tableNames, wpnonce, formatType, mysqlSet, showCreate, showComments, selectedRows) {
	jQuery("#wpda_row_export_form__pid").val(pid);
	jQuery("#wpda_row_export_form__schema_name").val(schemaName);
	jQuery("#wpda_row_export_form__table_names").val(tableNames);
	jQuery("#wpda_row_export_form__mysql_set").val(mysqlSet);
	jQuery("#wpda_row_export_form__show_create").val(showCreate);
	jQuery("#wpda_row_export_form__show_comments").val(showComments);
	jQuery("#wpda_row_export_form__format_type").val(formatType);
	jQuery("#wpda_row_export_form__wpnonce").val(wpnonce);

	rows = JSON.parse(selectedRows);
	for (var column in rows) {
		for (var i=0; i<rows[column].length; i++) {
			jQuery("#wpda_row_export_form").append("<input type='hidden' name='" + column + "[]' value='" + rows[column][i] + "' />");
		}
	}

	jQuery("#wpda_row_export_anchor").append(
		"<button class='button button-primary wpda_row_export_button' onclick='return wpda_row_export_start();'>Download " + (formatType==='' ? 'SQL' : formatType) + " export</button>"
	);
}

function wpda_show_notice( value ) {
    if (
    	value==='bulk-delete' ||
		value==='bulk-drop' ||
		value==='bulk-truncate'
	) {
        return confirm('You are about to permanently delete these items from your site.\nThis action cannot be undone.\n\'Cancel\' to stop, \'OK\' to delete.');
    }
}

function wpda_action_button() {
    action1 = jQuery("#wpda_main_form :input[name='action']").val();
    if (action1!=="-1") {
		return wpda_show_notice(action1);
    }
    action2 = jQuery("#wpda_main_form :input[name='action2']").val();
    if (action2!=="-1") {
        return wpda_show_notice(action2);
    }
    return true;
}

// Source: https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

// Source: https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
function escapeHtml(string) {
	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}

function submit_table_settings(rownum, jsonstring, submitform, table_name) {
	table_settings = {};

	if (jQuery("input:radio[name ='" + table_name + "_row_count_estimate']:checked").val() === "true") {

		table_settings['row_count_estimate'] = true;
	} else if (jQuery("input:radio[name ='" + table_name + "_row_count_estimate']:checked").val() === "false") {
		table_settings['row_count_estimate'] = false;
	} else {
		table_settings['row_count_estimate'] = null;
	}

	table_settings['row_count_estimate_value'] = jQuery("input:radio[name ='" + table_name + "_row_count_estimated_value']:checked").val();
	table_settings['row_count_estimate_value_hard'] = jQuery("#" + table_name + "_row_count_estimated_value_hard").val();

	table_settings['query_buffer_size'] =
		jQuery('#' + table_name + '_query_buffer_size').val();

	table_settings['row_level_security'] =
		jQuery('#' + table_name + '_row_level_security').is(':checked') ? 'true' : 'false';

	table_settings['hyperlink_definition'] =
		jQuery('#' + table_name + 'table_top_setting_hyperlink_definition_json').is(':checked') ? 'json' : 'text';

	jsonData = {};
	jsonData['request_type'] = 'table_settings';
	jsonData['table_settings'] = table_settings;
	jsonData['unused'] = jQuery('#wpda_' + rownum + '_sql_dml').val();

	// console.log(JSON.stringify(jsonData));
	jQuery('#' + jsonstring).val(JSON.stringify(jsonData));
	jQuery('#' + submitform).submit();
	return false;
}

function submit_column_settings(rownum, jsonstring, submitform) {
	custom_settings = {};
	list_labels = {};
	form_labels = {};
	column_media = {};
	unused = {};

	jQuery('#wpda_table_settings_' + rownum + ' .wpda_table_setting_item').each(function () {
		element_id = jQuery(this).attr('id');
		element_value = jQuery(this).val();
		element_type = jQuery(this).attr('type');
		is_custom_element = false;
		for (i=0; i<custom_column_settings.length; i++) {
			if (element_id.startsWith(custom_column_settings[i])) {
				element_name = element_id.substr(custom_column_settings[i].length);
				if (element_type==="checkbox") {
					element_value = jQuery(this).is(':checked');
				}
				custom_settings[element_id] = element_value;
				is_custom_element = true;
			}
		}
		if (!is_custom_element) {
			if (element_id.startsWith("list_label_")) {
				element_name = element_id.substr(11);
				list_labels[element_name] = element_value;
			} else if (element_id.startsWith("form_label_")) {
				element_name = element_id.substr(11);
				form_labels[element_name] = element_value;
			} else if (element_id.startsWith("column_media_")) {
				element_name = element_id.substr(13);
				element_old_value = jQuery('#column_media_' + element_name + '_old').val();
				if (element_value !== element_old_value) {
					media_dml = jQuery('#column_media_' + element_name + '_dml').val();
					column_media[element_name] = {'value': element_value, 'dml': media_dml};
				}
			}
		}
	});

	unused["sql_dml"] = jQuery('#wpda_' + rownum + '_sql_dml').val();

	jsonData = {};
	jsonData['request_type'] = 'column_settings';
	jsonData['custom_settings'] = custom_settings;
	jsonData['list_labels'] = list_labels;
	jsonData['form_labels'] = form_labels;
	jsonData['column_media'] = column_media;
	jsonData['unused'] = unused;

	//console.log(JSON.stringify(jsonData));
	jQuery('#' + jsonstring).val(JSON.stringify(jsonData));
	jQuery('#' + submitform).submit();
	return false;
}

function submit_hyperlinks(rownum, jsonstring, submitform) {
	hyperlinks = [];
	unused = {};
	isvalid = true;

	no_hyperlink = jQuery('#no_hyperlink_' + rownum).val();
	if (isNaN(no_hyperlink)) {
		return false;
	}

	for (hyperlink_no=0; hyperlink_no<=no_hyperlink;hyperlink_no++) {
		if (jQuery('#' + rownum + '_hyperlink_label_' + hyperlink_no).length) {
			hyperlink_label = jQuery('#' + rownum + '_hyperlink_label_' + hyperlink_no).val();
			hyperlink_html = jQuery('#' + rownum + '_hyperlink_html_' + hyperlink_no).val();

			hyperlink_label_old = jQuery('#' + rownum + '_hyperlink_label_' + hyperlink_no + '_old').val();
			hyperlink_html_old = jQuery('#' + rownum + '_hyperlink_html_' + hyperlink_no + '_old').val();

			if (hyperlink_label != '' && hyperlink_html != '') {
				hyperlink_list = jQuery('#' + rownum + '_hyperlink_list_' + hyperlink_no).is(':checked');
				hyperlink_form = jQuery('#' + rownum + '_hyperlink_form_' + hyperlink_no).is(':checked');
				hyperlink_target = jQuery('#' + rownum + '_hyperlink_target_' + hyperlink_no).is(':checked');

				hyperlink_item = {
					'hyperlink_label': hyperlink_label,
					'hyperlink_list': hyperlink_list,
					'hyperlink_form': hyperlink_form,
					'hyperlink_target': hyperlink_target,
					'hyperlink_html': escapeHtml(hyperlink_html)
				};
				hyperlinks[hyperlink_no] = hyperlink_item;
			} else {
				if (hyperlink_label_old != '' || hyperlink_html_old != '') {
					alert('Hyperlink label and HTML must be entered');
					isvalid = false;
				}
			}
		}
	}

	if (!isvalid) {
		return false;
	}

	unused["sql_dml"] = jQuery('#wpda_' + rownum + '_sql_dml').val();

	jsonData = {};
	jsonData['request_type'] = 'column_settings';
	jsonData['hyperlinks'] = hyperlinks;
	jsonData['unused'] = unused;

	//console.log(JSON.stringify(jsonData));
	jQuery('#' + jsonstring).val(JSON.stringify(jsonData));
	jQuery('#' + submitform).submit();
	return false;
}

function submit_dashboard_menus(rownum, jsonstring, submitform) {
	menu = {};
	isvalid = true;

	jQuery('#wpda_table_settings_' + rownum + ' .wpda_table_setting_item_menu').each(function () {
		element_id = jQuery(this).attr('id');
		element_value = jQuery(this).val();
		element_type = jQuery(this).attr('type');

		menu_no = element_id.substr(8);
		menu_id = element_value;

		menu_name = jQuery('#menu_name_' + menu_no).val();
		menu_slug = jQuery('#menu_slug_' + menu_no).val();
		menu_role = jQuery('#menu_roles_' + menu_no).val();

		if ('' !== menu_name && '' !== menu_slug) {
			menu_name_old = jQuery('#menu_name_' + menu_no + '_old').val();
			menu_slug_old = jQuery('#menu_slug_' + menu_no + '_old').val();
			menu_role_old = jQuery('#menu_roles_' + menu_no + '_old').val();
			if (Array.isArray(menu_role)) {
				menu_role_str = menu_role.toString();
			} else {
				menu_role_str = menu_role;
			}
			if (menu_name !== menu_name_old || menu_slug !== menu_slug_old || menu_role_old !== menu_role_str) {
				menu_item = {
					'menu_id': menu_id,
					'menu_name': menu_name,
					'menu_slug': menu_slug,
					'menu_role': menu_role
				};
				menu[menu_no] = menu_item;
			}
		} else {
			if (menu_id!=='') {
				alert('Menu name and menu slug must be entered');
				isvalid = false;
			}
		}
	});

	if (!isvalid) {
		return false;
	}

	jsonData = {};
	jsonData['request_type'] = 'dashboard_menus';
	jsonData['menu'] = menu;

	//console.log(JSON.stringify(jsonData));
	jQuery('#' + jsonstring).val(JSON.stringify(jsonData));
	jQuery('#' + submitform).submit();
	return false;
}

function settab(rownum, tab) {
	for (i = 1; i <= 6; i++) {
		jQuery("#" + rownum + "-sel-" + i.toString()).removeClass('nav-tab-active');
		jQuery("#" + rownum + "-tab-" + i.toString()).hide();
	}
	jQuery("#" + rownum + "-sel-" + tab).addClass('nav-tab-active');
	jQuery("#" + rownum + "-tab-" + tab).show();
}

function backup_respository_tables(
	table_settings_table_name,
	media_table_name,
	design_table_name,
	data_projects_project_name,
	data_projects_page_name,
	data_projects_table_name,
	data_publication_table_name,
	menus_table_name,
	csv_import_table_name,
	logging_table_name
) {
	jQuery('#table_settings_table_name').val(table_settings_table_name);
	jQuery('#media_table_name').val(media_table_name);
	jQuery('#design_table_name').val(design_table_name);
	jQuery('#data_projects_project_name').val(data_projects_project_name);
	jQuery('#data_projects_page_name').val(data_projects_page_name);
	jQuery('#data_projects_table_name').val(data_projects_table_name);
	jQuery('#data_publication_table_name').val(data_publication_table_name);
	jQuery('#menus_table_name').val(menus_table_name);
	jQuery('#csv_import_table_name').val(csv_import_table_name);
	jQuery('#logging_table_name').val(logging_table_name);

	jQuery('#wpda-download-backup').submit();
}

function restore_respository_tables() {
	if (!confirm("Restore repository tables? This action cannot be undone!\n\nIt might be wise to backup your actual repository tables first...")) {
		return;
	}

	jQuery('#restore_table_settings_table_name').val(jQuery("input[name='restore_table_settings_table_name']:checked").val());
	jQuery('#restore_media_table_name').val(jQuery("input[name='restore_media_table_name']:checked").val());
	jQuery('#restore_design_table_name').val(jQuery("input[name='restore_design_table_name']:checked").val());
	jQuery('#restore_data_projects_project_name').val(jQuery("input[name='restore_data_projects_project_name']:checked").val());
	jQuery('#restore_data_projects_page_name').val(jQuery("input[name='restore_data_projects_project_name']:checked").val());
	jQuery('#restore_data_projects_table_name').val(jQuery("input[name='restore_data_projects_table_name']:checked").val());
	jQuery('#restore_data_publication_table_name').val(jQuery("input[name='restore_data_publication_table_name']:checked").val());
	jQuery('#restore_menus_table_name').val(jQuery("input[name='restore_menus_table_name']:checked").val());
	jQuery('#restore_csv_import_table_name').val(jQuery("input[name='restore_csv_import_table_name']:checked").val());
	jQuery('#restore_logging_table_name').val(jQuery("input[name='restore_logging_table_name']:checked").val());

	jQuery('#restore_date').val(jQuery('.wpda-restore-repository-backup-selected').data('backupDate'));

	jQuery('#wpda-restore-respository').submit();
}

function get_table_row_count(wpnonce, schema_name, table_name) {
	url = location.pathname + '?action=wpda_get_table_row_count';
	jQuery.ajax({
		method: 'POST',
		url: url,
		data: {
			wpda_wpnonce: wpnonce,
			wpdaschema_name: schema_name,
			wpdatable_name: table_name
		}
	}).done(
		function(msg) {
			try {
				json = JSON.parse(msg);
				if (json[0].row_count === undefined) {
					alert('Ajax error: row count failed');
				} else {
					jQuery("#" + table_name + "_row_count_estimated_value_hard").val(json[0].row_count);
				}
			} catch (e) {
				alert('Ajax error: ' + e.message);
			}
		}
	);
}

function expandFieldset(id) {
	if (jQuery("#wpda_table_expand_" + id).is(":visible")) {
		jQuery("#wpda_field_expand_" + id).removeClass("fa-minus-circle");
		jQuery("#wpda_field_expand_" + id).addClass("fa-plus-circle");
		jQuery("#wpda_fieldset_expand_" + id).val("off");
		jQuery("#wpda_table_expand_" + id).css("display", "none");
	} else {
		jQuery("#wpda_field_expand_" + id).removeClass("fa-plus-circle");
		jQuery("#wpda_field_expand_" + id).addClass("fa-minus-circle");
		jQuery("#wpda_fieldset_expand_" + id).val("on");
		jQuery("#wpda_table_expand_" + id).css("display", "table");
	}
}

function wpda_add_icons_to_dialog_buttons() {
	jQuery("div.ui-dialog div.ui-dialog-buttonset button").each(function() {
		switch(jQuery(this).text()) {
			case "OK":
			case "Select":
			case "Close":
				jQuery(this).prepend('<i class="fas fa-check wpda_icon_on_button"></i> ');
				break;
			case "Apply":
				jQuery(this).prepend('<i class="fas fa-code-commit wpda_icon_on_button"></i> ');
				break;
			case "Delete":
				jQuery(this).prepend('<i class="fas fa-trash wpda_icon_on_button"></i> ');
				break;
			case "Keep":
				jQuery(this).prepend('<i class="fas fa-eraser wpda_icon_on_button"></i> ');
				break;
			case "Cancel":
				jQuery(this).prepend('<i class="fas fa-times-circle wpda_icon_on_button"></i> ');
				break;
		}
	});
}

function wpda_dbinit_admin( schema_name, wpnonce ) {
	jQuery.ajax({
		method: 'POST',
		url: wpda_admin_vars.wpda_ajaxurl + '?action=wpda_dbinit_admin',
		data: {
			wpdaschema_name: schema_name,
			wpnonce: wpnonce,
		}
	}).done(
		function(data) {
			msg = JSON.parse(data);
			if (msg.status==="OK") {
				jQuery.notify('Database function wpda_get_wp_user_id() created', 'success');
			} else {
				console.log(msg);
				jQuery.notify(msg.msg, 'error');
			}
		}
	);
}

function wpda_toggle_password(id, e) {
	// Change input type
	let elm = document.getElementById(id);
	if (elm.type === "password") {
		elm.type = "text";
	} else {
		elm.type = "password";
	}

	// Change icon if applicable
	let icn = jQuery(e.target);
	if (icn.hasClass("fa-eye")) {
		icn.addClass("fa-eye-slash").removeClass("fa-eye");
	} else if (icn.hasClass("fa-eye-slash")) {
		icn.addClass("fa-eye").removeClass("fa-eye-slash");
	}
}

function wpda_alert(title, txt) {
	jQuery("<p></p>").append(txt).dialog({
		title: title,
		modal: true,
		buttons: {
			OK: function() {
				jQuery(this).dialog("close");
			}
		}
	});
}

function wpda_confirm(title, txt) {
	var defer = jQuery.Deferred();

	jQuery("<p></p>").append(txt).dialog({
		title: title,
		modal: true,
		buttons: {
			OK: function() {
				defer.resolve(true);
				jQuery(this).dialog("close");
			},
			CANCEL: function() {
				defer.resolve(false);
				jQuery(this).dialog("close");
			}
		}
	});

	return defer.promise();
}