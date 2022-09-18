let quiz_time = 0;
start_quiz = 0;
quiz_id = 0;
logic_enabled = true;
no_featured_image = false;

jQuery(document).ready(function() {

    if (typeof qmn_quiz_data_new !== 'undefined') {
        jQuery.each(qmn_quiz_data_new, function(quiz_id, data) {
            if (data.length > 0) {
                logic_enabled = true;
            }
        })
    }
    jQuery('.quiz_theme_qsm-theme-companion').each(function() {
        var quiz_id = jQuery(this).find('.qmn_quiz_id').val();
        if (!qmn_quiz_data[quiz_id].hasOwnProperty('pagination') && Object.keys(qmn_quiz_data[quiz_id].qpages).length == 1) {
            addHeader(quiz_id);
        }
        var qsm_theme_companion_object = eval('qsm_theme_companion_object_' + quiz_id);
        if (typeof qsm_theme_companion_object.featured_image !== 'undefined' && qsm_theme_companion_object.featured_image.trim().length > 0) {
            jQuery('.quiz_theme_qsm-theme-companion .quiz_section.quiz_begin').prepend('<img src=' + qsm_theme_companion_object.featured_image + '>');
        } else {
            no_featured_image = true;
        }
        if (parseInt(qsm_theme_companion_object.randomness_order) != 0 && jQuery('.quiz_theme_qsm-theme-companion').find('.qsm-apc-1').length == 0) {
            jQuery(".qsm-quiz-container-" + quiz_id).addClass('qsm_random_quiz');
        }
    });

    jQuery('.ui-slider-handle.ui-state-default ').css('left', '50%');
    jQuery('.qsm_total_questions').html('<span class="que-number">' + jQuery('#total_questions').val() + '</span>' + '<span class="que-text"> Questions</span>');

    if (jQuery('.quiz_theme_qsm-theme-companion').find('.qsm-page-1').length || jQuery('.quiz_theme_qsm-theme-companion').find('.qsm-auto-page-row').length) {
        check_pagination = setInterval(function() {
            if (jQuery('.quiz_theme_qsm-theme-companion .qmn_pagination').length > 0) {
                clearInterval(check_pagination);
            }
        }, 10);
        if (no_featured_image) {
            if (!jQuery('.quiz_theme_qsm-theme-companion').hasClass('qsm_random_quiz')) {
                jQuery('.quiz_theme_qsm-theme-companion').find('.quiz_begin').css({
                    position: 'relative',
                    bottom: '0px'
                });
            }
        }
    }

    if (jQuery('.quiz_theme_qsm-theme-companion').find('.qsm-page-1').length) {
        jQuery('.quiz_theme_qsm-theme-companion').find('.quiz_begin').addClass('qsm-welcome-screen');
    }

    jQuery('.quiz_theme_qsm-theme-companion .mlw_answer_file_upload').each(function() {
        fileUpload = '<div class="companion-file-upload-container">' +
            '<span class="dashicons dashicons-cloud-upload companion-file-upload-logo"></span>' +
            '<div class="companion-file-upload-message"> Drag and Drop File Here or <a class="companion-file-upload-link" href="#">Browse </a>' +
            '</div>' +
            '<div class="companion-file-upload-name"></div>' +
            '<div class="companion-file-upload-error"></div>' +
            '</div>' +
            '</div>';
        jQuery(fileUpload).insertAfter(jQuery(this));
    });

    jQuery('.quiz_theme_qsm-theme-companion .companion-file-upload-container').on('click', function(e) {
        e.preventDefault();
        jQuery(this).prev('.mlw_answer_file_upload').trigger('click');
    });

    jQuery('.mlw_answer_file_upload').on('change', function() {
        jQuery(this).next('.companion-file-upload-container').find('.companion-file-upload-name').html(jQuery(this)[0].files[0].name);
        jQuery(this).next('.companion-file-upload-container').find('.companion-file-upload-error').html('Uploading...').show();
    });

    jQuery('.quiz_theme_qsm-theme-companion .companion-file-upload-container').on(
        'dragover',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            jQuery(this).addClass('file-hover');
        }
    )
    jQuery('.quiz_theme_qsm-theme-companion .companion-file-upload-container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    )
    jQuery('.quiz_theme_qsm-theme-companion .companion-file-upload-container').on(
        'dragleave',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            jQuery(this).removeClass('file-hover');
        }
    )
    jQuery('.quiz_theme_qsm-theme-companion .companion-file-upload-container').on(
        'drop',
        function(e) {
            jQuery(this).removeClass('file-hover');
            jQuery(this).find('.companion-file-upload-name').html(e.originalEvent.dataTransfer.files[0].name).fadeIn();
            // jQuery(this).find('.companion-file-upload-error').fadeOut();
            if (e.originalEvent.dataTransfer) {
                if (e.originalEvent.dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    jQuery(this).prev('.mlw_answer_file_upload').prop('files', e.originalEvent.dataTransfer.files);
                    jQuery(this).prev('.mlw_answer_file_upload').trigger('change');
                }
            }
        }
    );
    jQuery('.quiz_theme_qsm-theme-companion .companion-file-upload-container').on('mouseleave', function() {
        jQuery(this).removeClass('file-hover');
    });

    companionQuizSetup();
    checkHeightForHorizontalElements();

    // Next page
    jQuery(document).on('qsm_next_button_click_after', function(event, quiz_id) {
        current = jQuery('.current_page_hidden').val();
        if (qmn_quiz_data[quiz_id].hasOwnProperty('pagination')) {
            total = jQuery('.total_pages_hidden').val();
            if (2 == current) {
                if (jQuery('.qsm-companion-section-info').length == 0) {
                    addHeader(quiz_id);

                }
            }
        } else {
            total = Object.keys(qmn_quiz_data[quiz_id].qpages).length;
            if (1 == qmn_quiz_data[quiz_id].contact_info_location) {
                total++;
            }
            if (1 == current) {
                if (jQuery('.qsm-companion-section-info').length == 0) {
                    addHeader(quiz_id);
                }
            }
        }

        checkProgressBar(current, total, quiz_id);
        updateTitle(quiz_id);

    });

    // Previews page
    jQuery(document).on('qsm_previous_button_click_after', function(event, quiz_id) {

        current = jQuery('.current_page_hidden').val();
        if (qmn_quiz_data[quiz_id].hasOwnProperty('pagination')) {
            total = jQuery('.total_pages_hidden').val();
            if (1 == current) {
                jQuery('.quiz_theme_qsm-theme-companion .qsm_theme_companion_header, .quiz_theme_qsm-theme-companion .companion_timer').remove();
            }
        } else {
            total = Object.keys(qmn_quiz_data[quiz_id].qpages).length;
            if (1 == qmn_quiz_data[quiz_id].contact_info_location) {
                total++;
            }
            if (0 == current) {
                jQuery('.quiz_theme_qsm-theme-companion .qsm_theme_companion_header, .quiz_theme_qsm-theme-companion .companion_timer').remove();
            }
        }
        checkProgressBar(current, total, quiz_id);
        updateTitle(quiz_id);
    });

    jQuery(document).on('qsm_after_file_upload', function(e, container, response) {
        container.find('.companion-file-upload-error').html(response.message).fadeIn();
        container.find('.mlw_file_upload_hidden_value').val(response.file_url);
    })

    jQuery(document).on('qsm_after_display_result', function(e, current, ui) {

        jQuery('.slider-main-wrapper').find('.ui-slider-handle').append(`<div class="slider-svg-holder"><svg class="left-arrow" width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.26 7.52002L1 4.26002L4.26 1.00002" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="seprator" width="3" height="18" viewBox="0 0 3 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.970947" width="2.68" height="16.3" rx="1.34" fill="white"/>
            </svg>

            <svg class="right-arrow" width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.00001 7.52002L4.26001 4.26002L1.00001 1.00002" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg></div>`);
    });
    jQuery('.ui-slider-handle').append(`<div class="slider-svg-holder"><svg class="left-arrow" width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.26 7.52002L1 4.26002L4.26 1.00002" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg class="seprator" width="3" height="18" viewBox="0 0 3 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="0.970947" width="2.68" height="16.3" rx="1.34" fill="white"/>
        </svg>

        <svg class="right-arrow" width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.00001 7.52002L4.26001 4.26002L1.00001 1.00002" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></div>

        `);

});

function addHeader(quiz_id) {
    header = "<div class='qsm_theme_companion_header'>" + "<div class='companion_header_content'>" + "<span class='page-number'></span>" + "</div>" + "</div>";
    if (0 == jQuery('.qsm_theme_companion_header').length) {
        jQuery(header).insertAfter('#mlw_top_of_quiz');
    }

    initProgressbar(quiz_id);

    if (qmn_quiz_data[quiz_id].hasOwnProperty('first_page') && qmn_quiz_data[quiz_id].first_page == false && qmn_quiz_data[quiz_id].hasOwnProperty('advanced_timer') && qmn_quiz_data[quiz_id].hasOwnProperty('timer_limit_val') && qmn_quiz_data[quiz_id].timer_limit_val > 0) {
        initTimer(quiz_id);
    }

}

function companionQuizSetup() {
    jQuery('.quiz_theme_qsm-theme-companion .mlw_qmn_question_number').each(function() {
        if (jQuery(this).next().hasClass('qsm-featured-image')) {
            number = jQuery(this);
            jQuery(number).insertAfter(jQuery(this).next());
        }
    });
}

function checkHeightForHorizontalElements() {
    childCount = 0;
    e1 = e2 = {};
    jQuery('.quiz_theme_qsm-theme-companion .qmn_radio_answers .mlw_horizontal_choice, .quiz_theme_qsm-theme-companion .qmn_check_answers .mlw_horizontal_multiple').each(function() {
        childCount++
        if (childCount % 2 == 0) {
            e2 = jQuery(this);
            if (e2.height() > e1.height()) {
                e1.height(e2.height());
            } else {
                e2.height(e1.height());
            }
            e1 = e2 = {};
        } else {
            e1 = jQuery(this);
        }
    });
}

function checkProgressBar(current, total, quiz_id) {
    if (qmn_quiz_data[quiz_id].hasOwnProperty('pagination')) {
        current--;
        total--;
    }
    if (jQuery('#quizForm' + quiz_id).closest('.qmn_quiz_container').find('.empty_quiz_end').length) {
        total--;
    }
    width = parseInt(100 * (current / total));
    var left = parseInt(width);
    width += '%'
    jQuery('.companion_progress_bar .indicator').width(width);
    jQuery('.indicator_text').html('<div class="text-holder">' + width + `</div><svg id="progress-box-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="40" height="40">

			<g transform="matrix(1.5384616 0 0 1.5384616 -0 2.3076923)">
				<g>
				</g>
			    <path id="mypath" d="M1 2L1 16C 1 16.5523 1.44772 17 2 17L2 17L8.46482 17C 8.79917 17 9.1114 17.1671 9.29687 17.4453L9.29687 17.4453L12.2036 21.8055C 12.5898 22.3847 13.4349 22.4019 13.8444 21.8389L13.8444 21.8389L16.7219 17.8823C 16.898 17.6403 17.1732 17.4898 17.4719 17.4722L17.4719 17.4722L24.5587 17.0554C 25.0873 17.0243 25.5 16.5866 25.5 16.0571L25.5 16.0571L25.5 2C 25.5 1.44772 25.0523 1 24.5 1L24.5 1L2 1C 1.44772 1 1 1.44772 1 2z" stroke="#26BFCA" stroke-width="1" fill="none" />
			</g>

</svg>`);
    // jQuery('.indicator_text');
    jQuery('.indicator-holder').css('left', left + '%');
}

function updateTitle(quiz_id) {
    if (qmn_quiz_data[quiz_id].hasOwnProperty('pagination')) {
        current = jQuery('.current_page_hidden').val();
        total = jQuery('.total_pages_hidden').val();
        // will be removed after modification in core
        if (current == total) {
            jQuery('.quiz_theme_qsm-theme-companion .page-number').hide();
            return;
        }
        title = jQuery('.quiz_theme_qsm-theme-companion .pages_count').html();
        if (title !== undefined) {
            if (0 < title.length) {
                jQuery('.quiz_theme_qsm-theme-companion .page-number').html('<span>Page ' + title + '</span>');
            } else {
                jQuery('.quiz_theme_qsm-theme-companion .page-number').html('');
            }
        }

    } else {
        current = jQuery('.current_page_hidden').val();
        jQuery('.quiz_theme_qsm-theme-companion .page-number').html(current);
    }
}

function formatTimeLeft(quiz_id, time) {
    time_label = '';
    minutes = Math.floor(time / 60);
    var timer_limit_in_second = Math.floor(qmn_quiz_data[quiz_id].timer_limit_val * 60);
    if (60 <= minutes) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        time_label = hours + ':' + minutes.toString().padStart(2, '0');
        jQuery('.companion-timer_text_label').html('HOURS')
    } else if (minutes > 0) {
        seconds = time % 60;
        time_label = minutes + ':' + seconds.toString().padStart(2, '0');
        jQuery('.companion-timer_text_label').html('MINUTES')
    } else {
        time_label = time;
        jQuery('.companion-timer_text_label').html('SECONDS')
    }
    var strokeDashArray = Math.floor(time * 295 / timer_limit_in_second) + ' 295';
    jQuery('.base-timer_path-remaining').css('stroke-dasharray', strokeDashArray);

    if (minutes == 0) {
        changeColor(time);
    }

    return time_label;
}

function changeColor(time) {
    if (time > 30 && time <= 45) {
        jQuery('.base-timer_path-remaining').css('stroke', '#229ACD');
    } else if (time > 15 && time <= 30) {
        jQuery('.base-timer_path-remaining').css('stroke', '#FFB800');
    } else if (time <= 15) {
        jQuery('.base-timer_path-remaining').css('stroke', '#FF5555');
    } else {
        jQuery('.base-timer_path-remaining').css('stroke', '#1DD969');
    }
}

function startTimer(quiz_id, seconds) {

    if (start_quiz == 0) {
        timerInterval = setInterval(() => {
            seconds--;
            jQuery('.companion-timer_label').html(formatTimeLeft(quiz_id, seconds));
            if (seconds == 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }
    start_quiz++;
}

function initTimer(quiz_id) {

    var timerStarted = localStorage.getItem('mlw_started_quiz' + quiz_id);
    var timerRemaning = localStorage.getItem('mlw_time_quiz' + quiz_id);
    if ('yes' == timerStarted && 0 < timerRemaning) {
        seconds = parseInt(timerRemaning);
    } else {
        seconds = parseFloat(qmn_quiz_data[quiz_id].timer_limit) * 60;
    }

    if (0 == start_quiz) {
        startTimer(quiz_id, seconds);
    }

    if (seconds == 0) {
        jQuery('.qsm-companion-timer').hide();
    } else if (!jQuery('.companion_timer').length) {
        if (jQuery(window).width() > 650) {
            jQuery('.quiz_theme_qsm-theme-companion .qsm-auto-page-row .quiz_section, .quiz_theme_qsm-theme-companion .qsm-page, .quiz_theme_qsm-theme-companion .quiz_end').css({
                'margin-right': '110px ',
                borderRight: '2px solid #13426a10',
                padding: '0px 20px 20px 0',
            });
        }
        timer = `
		<span class='companion_timer'>
			<div class="companion-timer-text-holder">
				<span class='companion-timer_text'></span>
				<span class='companion-timer_text_label'></span>
			</div>
			<div class='base-timer'>
				<svg class='base-timer_svg' width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect class='base-timer_path-remaining' x="1" y="1" width="61" height="61" rx="2" stroke="#26BFCA" stroke-width="2"/>
				</svg>
				<span class='companion-timer_label'>Timer</span>
			</div>
		<span>`;
        jQuery(timer).insertBefore(jQuery('.mlw_qmn_timer'));
    }
}

function initProgressbar(quiz_id) {
    if_progress_bar = qmn_quiz_data[quiz_id]['progress_bar'];
    if (0 < if_progress_bar && 0 == jQuery('.companion_progress_bar').length) {
        jQuery('.qsm_theme_companion_header').fadeIn(500).css({
            'display': 'flex'
        });
        jQuery('.companion_header_content').last().append("<div class='companion_progress_bar'><div class='indicator-holder'><span class='indicator_text'></span></div><span class='indicator'></span></div>");
    }

}

//hook after timer init
jQuery(document).on('qsm_activate_time_after', function(e, quiz_id) {
    initTimer(quiz_id);
});