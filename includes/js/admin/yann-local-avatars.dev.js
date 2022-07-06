var yann_local_avatar_frame, avatar_spinner, avatar_ratings, avatar_container, avatar_form_button;
var avatar_working = false;

jQuery(document).ready(function($){
	$( document.getElementById('yann-local-avatar-media') ).on( 'click', function(event) {
		event.preventDefault();

		if ( avatar_working )
			return;

		if ( yann_local_avatar_frame ) {
			yann_local_avatar_frame.open();
			return;
		}

		yann_local_avatar_frame = wp.media.frames.yann_local_avatar_frame = wp.media({
			title: i10n_SimpleLocalAvatars.insertMediaTitle,
			button: { text: i10n_SimpleLocalAvatars.insertIntoPost },
			library : { type : 'image'},
			multiple: false
		});

		yann_local_avatar_frame.on( 'select', function() {
			// We set multiple to false so only get one image from the uploader
			avatar_lock('lock');
			var avatar_url = yann_local_avatar_frame.state().get('selection').first().toJSON().id;
			jQuery.post( ajaxurl, { action: 'assign_yann_local_avatar_media', media_id: avatar_url, user_id: i10n_SimpleLocalAvatars.user_id, _wpnonce: i10n_SimpleLocalAvatars.mediaNonce }, function(data) {
				if ( data != '' ) {
					avatar_container.innerHTML = data;
					$( document.getElementById('yann-local-avatar-remove') ).show();
					avatar_ratings.disabled = false;
					avatar_lock('unlock');
				}
			});
		});

		yann_local_avatar_frame.open();
	});

	$( document.getElementById('yann-local-avatar-remove') ).on('click',function(event){
		event.preventDefault();

		if ( avatar_working )
			return;

		avatar_lock('lock');
		$.get( ajaxurl, { action: 'remove_yann_local_avatar', user_id: i10n_SimpleLocalAvatars.user_id, _wpnonce: i10n_SimpleLocalAvatars.deleteNonce })
		.done(function(data) {
			if ( data != '' ) {
				avatar_container.innerHTML = data;
				$( document.getElementById('yann-local-avatar-remove') ).hide();
				avatar_ratings.disabled = true;
				avatar_lock('unlock');
			}
		});
	});
});

function avatar_lock( lock_or_unlock ) {
	if ( undefined == avatar_spinner ) {
		avatar_ratings = document.getElementById('yann-local-avatar-ratings');
		avatar_spinner = jQuery( document.getElementById('yann-local-avatar-spinner') );
		avatar_container = document.getElementById('yann-local-avatar-photo');
		avatar_form_button = jQuery(avatar_ratings).closest('form').find('input[type=submit]');
	}

	if ( lock_or_unlock == 'unlock' ) {
		avatar_working = false;
		avatar_form_button.removeAttr('disabled');
		avatar_spinner.hide();
	} else {
		avatar_working = true;
		avatar_form_button.attr('disabled','disabled');
		avatar_spinner.show();
	}
}