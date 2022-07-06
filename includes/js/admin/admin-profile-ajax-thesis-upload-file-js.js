'use strict';
(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);
;( function ( document, window, index ) {
    
    // functions
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
    function getMessage(ele,form,joystick,userid) {
        if (ele.error == true) {
            if ( ele.errmessage ) {
                alert(ele.errmessage);
                return;
            }
            var error = ele.data;
            for (var key in error) {
                var _key = key.split("_")[0];
                if ( _key == "ext" ) {
                    alert(error[key].file+" 的"+error[key].data);
                } else if ( _key == "upload-f" ) {
                    alert(error[key].file.name+" 無法上傳，原因為"+error[key].result.error);
                } else if ( _key == "upload-v" ) {
                    alert(error[key].file.name+" 無法上傳，原因為"+error[key].result);
                }
            }
        } else if ( ele.success = true ) {
            var sf = ele.data;
            var c = 0;
            for (var key in sf) {
                var _key = key.split("_")[0];
                if ( _key == "ext" ) {
                    alert(sf[key].file+" 的"+sf[key].data);
                } else if ( _key.split("-")[1] == "f" ) {
                    alert(sf[key].file.name+" 無法上傳，原因為"+sf[key].result.error);
                } else if ( _key.split("-")[1] == "s" ) {
                    c += 1;
                    if ( sf[key].pdftitle ) {
                        jQuery("#_Thesis_title").val(sf[key].pdftitle);
                    }
                    InsertSuccess(sf[key],joystick,c,userid);
                    if ( ele.all == true && c == 1 ) {
                        alert(ele.message);
                    }
                }
            }
            HideSubmit(form,joystick);
        }
    }
    function HideSubmit(form,joystick){
        var joystick = joystick.getAttribute("joystick");
        var upds = document.querySelector(".upload-description-"+joystick);
        form.parentNode.removeChild(form);
        upds.parentNode.removeChild(upds);
    }
    function InsertSuccess(ele,joystick,c,userid){
        var joystick = joystick.getAttribute("joystick");
        var insertTarget = document.querySelector("#insert-success-"+joystick);
        var key = zeroPad(c, 2);
        insertTarget.style.display = "block";
        jQuery(jQuery(insertTarget).find("tbody")[0]).append('<tr id="uploaded-'+joystick+'-row-'+key+'" filename="'+ele.newname+'" userid="'+userid+'"><th><label for="uploaded-'+joystick+'-'+key+'">'+ele.newname+'</label></th><td><input type="button" download="'+userid+'-'+ele.microtime+'-'+joystick+'" id="uploaded-'+joystick+'-download-'+key+'" class="button" name="uploaded-'+joystick+'-download-'+key+'" value="下載"></td><td><input type="button" id="uploaded-'+joystick+'-delete-'+key+'" class="button" name="uploaded-'+joystick+'-delete-'+key+'" value="刪除"></td></tr>');
        downloadLast(joystick,key);
        deleteLast(joystick,key);
        return;
    }
    function formSubmit(jsk) {
        // feature detection for drag&drop upload
        var isAdvancedUpload = function(){
            var div = document.createElement( 'div' );
            return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
        }();

        // applying the effect for every form
        var forms = document.querySelectorAll( '#upload-box-'+jsk );
        Array.prototype.forEach.call( forms, function( form ) {
            var joystick     = form.querySelector( 'input[name="joystick"]' ),
                userid       = form.querySelector( 'input[name="userid"]' ),
                input		 = document.getElementById( 'CPT_thesis_input_for_'+joystick.getAttribute("joystick")+'_upload' ),
                label		 = form.querySelector( 'label' ),
                errorMsg	 = form.querySelector( '.box__error span' ),
                restart		 = form.querySelectorAll( '.box__restart' ),
                uploadsize   = form.querySelector( '.box__uploadsize' ).getAttribute("max_upload_size"),
                droppedFiles = false,
                showFiles	 = function( files )
                {
                    label.textContent = files.length > 1 ? ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name;
                },
                printConsole = function(e) {
                },
                fileLimit    = function( files ) {
                    var addContent = '',
                        count = 0;
                    Array.prototype.forEach.call( files, function( file ) {
                        if ( addContent.length > 0 ) {
                            addContent += ", ";
                        }
                        if ( file.size > uploadsize ) {
                            addContent += "The file size of 『" + file.name + "』 is larger than the maximum upload size limit";
                            count += 1;
                        }
                    });
                    if ( addContent.length > 0 ) {
                        addContent += ". Please upload a smaller version.";
                        label.textContent = addContent;
                    }
                    return count;
                },
                triggerFormSubmit = function()
                {
                    // @https://stackoverflow.com/questions/7166007/how-to-submit-button-less-form-with-dispatchevent/17998819
                    var event = new Event('submit', {
                        'bubbles'    : true, // Whether the event will bubble up through the DOM or not
                        'cancelable' : true  // Whether the event may be canceled or not
                    });
                    // var event = document.createEvent( 'HTMLEvents' );
                    // event.initEvent( 'submit', true, false );
                    form.addEventListener( 'submit', printConsole, false );
                    form.dispatchEvent( event );
                };

            // letting the server side to know we are going to make an Ajax request
            var ajaxFlag = document.createElement( 'input' );
            ajaxFlag.setAttribute( 'type', 'hidden' );
            ajaxFlag.setAttribute( 'name', 'ajax' );
            ajaxFlag.setAttribute( 'value', 1 );
            form.appendChild( ajaxFlag );

            // automatically submit the form on file select
            input.addEventListener( 'change', function( e )
            {
                showFiles( e.target.files );
                if ( !fileLimit(e.target.files) ) {
                    triggerFormSubmit();
                }
            });

            // drag&drop files if the feature is available
            if( isAdvancedUpload )
            {
                form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

                [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
                {
                    form.addEventListener( event, function( e )
                    {
                        // preventing the unwanted behaviours
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });
                [ 'dragover', 'dragenter' ].forEach( function( event )
                {
                    form.addEventListener( event, function()
                    {
                        form.classList.add( 'is-dragover' );
                    });
                });
                [ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
                {
                    form.addEventListener( event, function()
                    {
                        form.classList.remove( 'is-dragover' );
                    });
                });
                form.addEventListener( 'drop', function( e )
                {
                    droppedFiles = e.dataTransfer.files; // the files that were dropped
                    showFiles( droppedFiles );
                    triggerFormSubmit();
                });
            }

            // if the form was submitted
            form.addEventListener( 'submit', function( e ) {
                // preventing the duplicate submissions if the current one is in progress
                if( form.classList.contains( 'is-uploading' ) ) return false;

                form.classList.add( 'is-uploading' );
                form.classList.remove( 'is-error' );

                // ajax file upload for modern browsers
                if ( isAdvancedUpload ) {
                    e.preventDefault();
                    // gathering the form data
                    var ajaxData = new FormData();
                    if ( droppedFiles ) {
                        Array.prototype.forEach.call( droppedFiles, function( file ) {
                            ajaxData.append(input.getAttribute('name') , file);
                        });
                        ajaxData.append('nonce',YANN.nonce);
                        ajaxData.append('action',YANN.action);
                        ajaxData.append('useridjs',YANN.userid);
                        ajaxData.append('joystick',joystick.getAttribute('joystick'));
                        ajaxData.append('userid',userid.getAttribute('userid'));
                    }

                    jQuery.ajax({
                        type: "POST",
                        url: YANN.ajaxurl ,
                        data: ajaxData,
                        dataType: "json",
                        async: true,
                        cache: false,
                        contentType: false,
                        processData: false,
                        enctype: 'multipart/form-data',
                        success: function( data , textStatus , xhr ) {
                            form.classList.remove( 'is-uploading' );
                            if ( xhr.status >= 200 && xhr.status < 400 ) {
                                form.classList.add( data.success == true ? 'is-success' : 'is-error' );
                                if ( data.success == true ) {
                                    // console.log(data.data);
                                    getMessage(data.data,form,joystick,YANN.userid);
                                } else if ( ! data.success ) {
                                    // console.log(data.data);
                                    errorMsg.textContent = data.error;
                                    getMessage(data.data,form,joystick,YANN.userid);
                                }
                            }
                        },error: function (jqXHR, exception) {
                            form.classList.remove( 'is-uploading' );
                            alert( 'Error. Please, try again!' );
                        }
                    });
                }
                else // fallback Ajax solution upload for older browsers
                {
                    var iframeName	= 'uploadiframe' + new Date().getTime(),
                        iframe		= document.createElement( 'iframe' );

                        $iframe		= $( '<iframe name="' + iframeName + '" style="display: none;"></iframe>' );

                    iframe.setAttribute( 'name', iframeName );
                    iframe.style.display = 'none';

                    document.body.appendChild( iframe );
                    form.setAttribute( 'target', iframeName );

                    iframe.addEventListener( 'load', function()
                    {
                        var data = JSON.parse( iframe.contentDocument.body.innerHTML );
                        form.classList.remove( 'is-uploading' )
                        form.classList.add( data.success == true ? 'is-success' : 'is-error' )
                        form.removeAttribute( 'target' );
                        if( !data.success ) errorMsg.textContent = data.error;
                        iframe.parentNode.removeChild( iframe );
                    });
                }
            });

            // restart the form if has a state of error/success
            Array.prototype.forEach.call( restart, function( entry )
            {
                entry.addEventListener( 'click', function( e )
                {
                    e.preventDefault();
                    form.classList.remove( 'is-error', 'is-success' );
                    input.click();
                });
            });

            // Firefox focus bug fix for file input
            input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
            input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });

        });
    }
    function deleteLast(joystick,key){
        var del = document.getElementById("uploaded-"+joystick+"-delete-"+key);
        // ajax delete file and front delete
        jQuery(del).on('click',function(){
            var data = {};
            data.action = YANN.deleteaction;
            data.nonce  = YANN.nonce;
            data.file   = jQuery("tr#uploaded-"+joystick+"-row-"+key).attr("filename");
            data.userid = jQuery("tr#uploaded-"+joystick+"-row-"+key).attr("userid");
            data.useridjs = YANN.userid
            data.joystick = joystick;
            jQuery.ajax({
                type: "POST",
                url: YANN.ajaxurl ,
                data: data,
                dataType: "json",
                success: function( data , textStatus , xhr ) {
                    // if delete success and row.length == 0
                    if ( data.success == true ) {
                        jQuery("tr#uploaded-"+joystick+"-row-"+key).remove();
                        alert( data.data.data );
                        if ( jQuery("tr[id*=uploaded-"+joystick+"-row-]").length == 0 ) {
                            fixRecover(joystick,YANN.userid);
                        }                            
                    } else if ( ! data.success ) {
                        alert( data.data.errmessage );
                    }
                },error: function (jqXHR, exception) {
                    alert( '請重新整理頁面再嘗試！' );
                }
            });
        });
    }
    function downloadLast(joystick,key) {
        var download = document.getElementById("uploaded-"+joystick+"-download-"+key);
        jQuery(download).on('click', function(e){
            AjaxGetFileInfo(jQuery(e.target));
        });
    }
    function fixRecover(joystick,userid){
        var data = {};
        data.action = YANN.fixaction;
        data.nonce  = YANN.nonce;
        data.userid = YANN.userid;
        data.joystick = joystick;
        jQuery.ajax({
            type: "POST",
            url: YANN.ajaxurl ,
            data: data,
            dataType: "json",
            success: function( data , textStatus , xhr ) {
                if ( data.success == true ) {                        
                    // insert form
                    if ( jQuery("#insert-success-"+joystick).length == 1 ) {
                        jQuery("#insert-success-"+joystick).after(data.data.data);
                        formSubmit(joystick);
                    } else {
                        alert( '上傳區域恢復失敗，請重新整理頁面再嘗試！' );    
                    }
                } else if ( ! data.success ) {
                    alert( '上傳區域恢復失敗，請重新整理頁面再嘗試！' );
                }
            },error: function (jqXHR, exception) {
                alert( '上傳區域恢復失敗，請重新整理頁面再嘗試！' );
            }
        });
    }
    function AjaxGetFileInfo(ele) {
        var arr = ele.attr("download").split("-");
        var userid = arr[0];
        var microtimestamp = arr[1];
        var joystick = arr[2];
        
        var url = YANN.restinfoapi+"/"+userid+"/"+microtimestamp+"/"+joystick;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('X-WP-Nonce', YANN.restapinonce);
        xhr.onload = function() {
            var data = JSON.parse(xhr.response);
            if ( data.success == true ) {
                GetFile(ele,data.newfilename)
            }
        };
        xhr.send();
    }
    function GetFile(ele,filename) {
        var arr = ele.attr("download").split("-");
        var userid = arr[0];
        var microtimestamp = arr[1];
        var joystick = arr[2];
        var url = YANN.restapi+"/"+userid+"/"+microtimestamp+"/"+joystick;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = 'blob';
        xhr.setRequestHeader('X-WP-Nonce', YANN.restapinonce);
        xhr.onload = function() {
            SaveAsFile(xhr.response,filename,xhr.response.type);
        };
        xhr.send();
    }
    function SaveAsFile(t,f,m) {
        try {
            var b = new Blob([t],{type:m});
            saveAs(b, f);
        } catch (e) {
            window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
        }
    }

    var joysticks = ["thesis"];
    document.querySelectorAll( '#upload-box-thesis' );
    Array.prototype.forEach.call( joysticks, function( joystick ) {
        var form = document.querySelector( '#upload-box-'+joystick );
        if ( jQuery(form).length == 1 ) {
            formSubmit(joystick);
        } else {
            var dels = document.querySelectorAll( 'input[id*=uploaded-'+joystick+'-delete-]' );
            var downs = document.querySelectorAll( 'input[id*=uploaded-'+joystick+'-download-]' );
            Array.prototype.forEach.call( dels, function( del ) {
                var key = del.id.split("-")[3];
                deleteLast(joystick,key);
            });
            Array.prototype.forEach.call( downs, function( down ) {
                var key = down.id.split("-")[3];
                downloadLast(joystick,key);
            });
        }
    });
    
}( document, window, 0 ));