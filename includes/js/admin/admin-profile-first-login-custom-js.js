(function ($) {
    function ReturnDeleteFirst() {
        var data = {};
        data.action = YANN.action;
        data.nonce  = YANN.nonce;
        $.ajax({
            type: "POST",
            url: YANN.ajaxurl ,
            data: data,
            dataType: "json",
            success: function( data ) {
                if ( data.success == true ) {
                    InsertImages( data.data.data );
                    ContentChange(0 , data.data.data);
                } else if ( data.success == false ) {
                    alert( data.data.errmessage );
                }
            },
        });
    }
})(jQuery);