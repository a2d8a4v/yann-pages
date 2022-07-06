(function ($) {

    // Variable
    var CheckList = $(".user-first-name-wrap, .user-last-name-wrap, .user-nickname-wrap, .user-email-wrap, .user-en-last-name-wrap, .user-en-first-name-wrap, .user-enrollment-year-wrap, .user-bachelor-wrap");
    var CheckUNList = $(".user-phone-wrap, .user-graduate-year-wrap, .user-url-wrap, .user-github-wrap, .user-gitlab-wrap, .user-contactemail-wrap, .user-research-topic-wrap, .user-thesis-wrap, .user-dissertation-wrap");
    var CheckLOList = $(".user-enrollment-year-wrap");
    var ChangeList = $(".user-rich-editing-wrap, .user-admin-color-wrap, .user-comment-shortcuts-wrap, .show-admin-bar.user-admin-bar-front-wrap, .user-language-wrap, .user-profile-picture, .ratings-row, #application-passwords-section");

    // Always hide even be change by hand
    function DetectChangedActive(ChangeList){
        var config = { attributes: true, childList: true, characterData: true };
        var observers = [];
        function setObserver(target, index) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if ( mutation.attributeName == "class" || mutation.attributeName == "style" || mutation.type == "attributes" ) {
                        $(mutation.target).css("display","none");
                    }
                });
            });
            observer.observe(target, config);
            observers.push({[index]: observer});
        }
        
        $(ChangeList).each(function(index, el) {
            setObserver(el, index)
        });
    }

    // Other Functions
    function InsertAfter(id, message) {
        $("#"+id).after("<p class='invalid-feedback' stype=' display: none;width: 100%;margin: 5px 0 25px 0;font-size: 80%;color: #dc3545;'>"+message+"</p>");
    }
    function InsertAttr(id, type, value) {
        $("#"+id).attr(type,value);
    }
    function SubmitAfterAction() {
        var firstInvalid = $( $(".is-invalid")[0] );
        $('html, body').animate({scrollTop: firstInvalid.offset().top-firstInvalid.height()-$("#wpadminbar").height()}, 500);
        return false;
    }
    function getIDList(eleList) {
        var rtn = [];
        eleList.each(function(i,el){
            rtn.push($(el).attr("id"));
        });
        return rtn;
    }
    function returnPlaceHolder(ele){
        return $(ele).attr("placeholder");
    }

    // Ajax function
    function ReturnDeleteFirst(e) {
        e.preventDefault();
        var data = {};
        data.action = YANN.action;
        data.nonce  = YANN.nonce;
        data.id = YANN.id;
        $.ajax({
            type: "POST",
            url: YANN.ajaxurl ,
            data: data,
            dataType: "json",
            success: function( data ) {
                if ( data.success == true ) {
                    alert( data.data.data );
                    $("#first-login-recognition").remove();
                } else if ( data.error == true ) {
                    alert( data.data.errmessage );
                }
            },
        });
        return true;
    }

    // Validation Functions
    function SelectToInput(ele,type) {
        if (type=="ch_name") {
            return ['first_name','last_name'];
        }
        if (type=="en_name") {
            return ['EN_First_Name','EN_Last_Name'];
        }
        if (type=="_ID") {
            var tmpList = $(ele).find('td input,td select');
            var rtn = [];
            tmpList.each(function(i,el){
                rtn.push($(el).attr("id"));
            });
            return rtn;
        }
        if (type=="all") {
            return $(ele).find('td input,td select');
        }
        if (type=="lock") {
            return $(ele).find('td input[id*=Lock][name*=Lock],td select[id*=Lock][name*=Lock]');
        }
        if (type=="url") {
            return ['url','github','gitlab','_Dissertation_url','_Thesis_url']
        }
    }
    function RunValidate(eleList,eleLolist,type) {
        var locklist = getIDList(eleLolist);
        eleList.each(function() {
            if ( $(this).is("select") ) {
                $(this).on('change focus blur', function() {
                    var vld = validate(this);
                    if ( vld == false || vld == 'empty' ) {
                        showValidate(this , 0);
                    } else {
                        passValidate(this);
                    }
                });
            }
            if ( $(this).is("input") ) {
                $(this).on('blur', function() {
                    if ( $.inArray( $(this).attr("id") , locklist ) == -1 ) {
                        var vld = validate(this);
                        if ( vld == 'empty' ) {
                            if ( type == 'ne' ) {
                                showValidate(this , 0);
                            } else if ( type == 'un' ) {
                                hideValidate(this);
                            }
                        } else if ( vld == false ) {
                            showValidate(this , 1);
                        } else {
                            passValidate(this);
                        }
                    } else {
                        hideValidate(this);
                    }
                });
                $(this).focus(function(){
                    hideValidate(this);
                });
            }
        });
    }
    function isPhone(input) {
        if ($(input).val().trim().match(/^(09)[0-9]{8}$/im) == null) {
            return false;
        }
        return true;
    }
    function isChineseName(input) {
        var trim_input = $(input).val().trim();
        for (i = 0; i < trim_input.length;i++) {
            if ( trim_input[i].match(/[\u4E00-\u9FFF]|[\u3400-\u4DBF]|[\uF900-\uFAFF]|[\u3100–\u312f]/g) == null ) {
                return false;
            }
        }
        return true;
    }
    function isNumberEnglishMix(input) {
        if ( $(input).val().trim().match(/([0-9a-zA-Z_\-\.\ \,]+)/) == null ) {
            return false;
        }
        return true;
    }
    function isEnglishName(input) {
        if ( $(input).val().trim().match(/^([a-zA-Z_\-\.\ \,]+)$/) == null ) {
            return false;
        }
        return true;
    }
    function isFirstCharacterUpper(input) {
        if ( $(input).val().trim().substring(0,1).match(/^([A-Z]+)$/) == null ) {
            return false;
        }
        return true;
    }
    function isJapaneseName(input) {
        var trim_input = $(input).val().trim();
        for (i = 0; i < trim_input.length;i++) {
            if ( trim_input[i].match(/[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/g) == null ) {
                return false;
            }
        }
        return true;
    }
    function isKoreanName(input) {
        var trim_input = $(input).val().trim();
        for (i = 0; i < trim_input.length;i++) {
            if ( trim_input[i].match(/[\uac00-\ud7a3]|[\u1100-\u11ff]|[\u3131-\u318e]|[\uffa1-\uffdc]/g) == null ) {
                return false;
            }
        }
        return true;
    }
    function isEmail(input) {
        // if ( $(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@g(oogle)?mail\.com$/) == null ) {
        if ( $(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null ) {
            return false;
        }
        return true;
    }
    function isACYear(input) {
        if ( $(input).val().trim().length == 4 ) {
            if ( parseInt($(input).val().trim()[0]) >= 1 ) {
                return true;
            }
            return false;
        }
        return false;
    }
    function isSpecailCh(input) {
        var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
        for (i = 0; i < specialChars.length;i++) {
            if ( $(input).val().trim().indexOf(specialChars[i]) > -1 ) {
                return true;
            }
        }
        return false;
    }
    function isValidURL(input) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test($(input).val().trim());
    }
    function validate(input) {
        if ( $(input).val().trim() == '' ) {
            return 'empty';
        }
        // email
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email' || $(input).attr('name') == 'contactemail' ) {
            return isEmail(input);
        // Chinese Name/Characters
        } else if (SelectToInput(CheckList,"ch_name").includes($(input).attr('name'))) {
            return isChineseName(input)&&!isSpecailCh(input)&&!isNumberEnglishMix(input);
        // Selection TAG DOM
        } else if ($(input).attr('type') == 'select') {
            if ($("option:selected", $(input)).val() == '') {
                return false;
            }
        // Phone Number
        } else if ($(input).attr('name') == 'phone') {
            return isPhone(input);
        // Year
        } else if ($(input).attr('year') == 'year' ) {
            return isACYear(input);
        // English Name/Characters
        } else if (SelectToInput(CheckList,"en_name").includes($(input).attr('name'))) {
            return isEnglishName(input)&&!isSpecailCh(input)&&isFirstCharacterUpper(input);
        // NickName
        } else if ($(input).attr('name') == 'nickname') {
            if ( ( isChineseName(input) || isNumberEnglishMix(input) || isJapaneseName(input) || isKoreanName(input) ) && !isSpecailCh(input) ) {
                return true;
            }
            return false;
        } else if (SelectToInput(CheckUNList,"url").includes($(input).attr('name'))) {
            return isValidURL(input);
        } else if ($(input).attr('name') == 'Research_Topic') {
            if ( isChineseName(input) || isNumberEnglishMix(input) || isJapaneseName(input) || isKoreanName(input) ) {
                return true;
            }
            return false;
        }
        return true;
    }

    function checkValidate(elelist,eleLolist,type) {
        var check = true;
        var locklist = getIDList(eleLolist);
        if ( type == 'ne' ) {
            elelist.each(function(i, el) {
                // is not lock item
                if ( $.inArray( $(el).attr("id") , locklist ) == -1 ) {
                    var vld = validate(el);
                    if ( vld == 'empty' ) {
                        showValidate(el , 0);
                        check=false;
                    } else if ( vld == false ) {
                        showValidate(el , 1);
                        check=false;
                    } else {
                        passValidate(el);
                    }
                // is lock item
                } else {
                    hideValidate(el);
                }
            });
            return check;
        } else if ( type == 'un' ) {
            elelist.each(function(i, el) {
                // is not lock item
                if ( $.inArray( $(el).attr("id") , locklist ) == -1 ) {
                    var vld = validate(el);
                    if ( vld == 'empty' ) {
                        hideValidate(this);
                    } else if ( vld == false ) {
                        showValidate(el , 1);
                        check=false;
                    } else {
                        passValidate(el);
                    }
                // is lock item
                } else {
                    hideValidate(el);
                }
            });
            return check;
        }
    }
    function showValidate(input , which) {
        var thisAlert = $(input).parent("td").children(".invalid-feedback").eq(which);
        thisAlert.css("display", "block");
        $(input).addClass("is-invalid");
        $(input).removeClass("is-valid");
    }
    function hideValidate(input) {
        var thisAlert = $(input).parent("td").children(".invalid-feedback");
        thisAlert.css("display", "none");
        $(input).removeClass("is-invalid");
    }
    function passValidate(input) {
        var thisAlert = $(input).parent("td").children(".invalid-feedback");
        thisAlert.css("display", "none");
        $(input).removeClass("is-invalid");
        $(input).addClass("is-valid");
    }
    function TriggerUnneccesaryValidation(CheckUNList,eleLolist) {
        var eleUnlist = SelectToInput(CheckUNList,"all");
        eleUnlist.each(function(i, el) {
            $(el).focus(function(){
                RunValidate(eleUnlist,eleLolist,"un");
            });
        });
    }

    $( document ).ready( function() {
        // Adjust form table
        $($(".form-table")[0]).prev().css('display','none');
        DetectChangedActive(ChangeList);
        // Update description description Content
        $($(".user-description-wrap").find("td p.description")[0]).html("🐟 自我介紹文字，內容包含個人興趣、研究方向等等，內容自由發揮，但至少提到 這兩點，字數限制最多 250 字。");
        CheckList.each(function(i, el) {
            var html = $(el).find('th label');
            if (html.find(".description").length > 0) {
                html.find(".description").html("");
            }
            $(el).find('th label').html(html.html()+" <span class='description'>(必填)</span>");
        });
        // Insert Attributes like Placeholder and autocomplete="off" 
        var allList = SelectToInput(CheckList.add(CheckUNList),"_ID");
        // jQuery("form#your-profile table.form-table tr[class*=user][class*=wrap]").each(function(i,e){
        //     if ( jQuery(e).css('display') == 'table-row' && jQuery(e).find("td input").length == 1 ) {
        //         console.log(e);
        //     }
        // })
        // Insert Invalid FeedBack , Attributes like Placeholder, required and autocomplete="off" 
        $(allList).each(function(i,id){
            switch (id) {
                // Necessary Part
                case 'first_name':
                    InsertAfter(id, "請輸入中文格式的名字。");
                    InsertAfter(id, "請輸入中文名字。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入中文名字");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'last_name':
                    InsertAfter(id, "請輸入中文格式的姓氏。");
                    InsertAfter(id, "請輸入中文姓氏。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入中文姓氏");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'nickname':
                    InsertAfter(id, "請輸入符合格式的綽號。");
                    InsertAfter(id, "請輸入綽號。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入綽號");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'email':
                    InsertAfter(id, "請輸入符合格式的電子信箱。");
                    InsertAfter(id, "請輸入電子信箱。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入 test@domain.com/domain.com.tw 等格式的電子信箱");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'EN_First_Name':
                    InsertAfter(id, "請輸入英文格式的名字，字首記得大寫。");
                    InsertAfter(id, "請輸入英文名字，字首記得大寫。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入英文名字");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'EN_Last_Name':
                    InsertAfter(id, "請輸入英文格式的姓氏，字首記得大寫。");
                    InsertAfter(id, "請輸入英文姓氏，字首記得大寫。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入英文姓氏");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'Enrollment_Year':
                    InsertAfter(id, "請輸入符合格式的西元年份。");
                    InsertAfter(id, "請輸入西元年份。");
                    InsertAttr(id,"required","required");
                    InsertAttr(id,"placeholder","請輸入西元年份");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'Bachelor':
                    InsertAfter(id, "請選擇一種學位。");
                    break;
                // unnecessary Part
                case 'phone':
                    InsertAfter(id, "請輸入 09xxxxxxxx 格式的號碼。");
                    InsertAfter(id, "請輸入手機號碼。");
                    InsertAttr(id,"placeholder","請輸入 09xxxxxxxx 格式的號碼");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'Graduate_Year':
                    InsertAfter(id, "請輸入符合格式的西元年份。");
                    InsertAfter(id, "請輸入西元年份。");
                    InsertAttr(id,"placeholder","請輸入西元年份");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'gitlab':
                    InsertAfter(id, "請輸入 http/https:// 網址的格式。");
                    InsertAfter(id, "請輸入個人的 GitLab 網址。");
                    InsertAttr(id,"placeholder","請輸入個人的 GitLab 網址");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'github':
                    InsertAfter(id, "請輸入 http/https:// 網址的格式。");
                    InsertAfter(id, "請輸入個人的 GitHub 網址。");
                    InsertAttr(id,"placeholder","請輸入個人的 GitLab 網址");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'contactemail':
                    InsertAfter(id, "請輸入符合格式的電子信箱。");
                    InsertAfter(id, "請輸入電子信箱。");
                    InsertAttr(id,"placeholder","請輸入 test@domain.com/domain.com.tw 等格式的電子信箱");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'url':
                    InsertAfter(id, "請輸入 http/https:// 網址的格式。");
                    InsertAfter(id, "請輸入個人網站的網址。");
                    InsertAttr(id,"placeholder","請輸入個人網站的網址");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case 'Research_Topic':
                    InsertAfter(id, "請輸入中/英/日/韓文的文字格式");
                    InsertAfter(id, "請輸入個人的研究主題。");
                    InsertAttr(id,"placeholder","請輸入個人的研究主題");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case '_Thesis_url':
                    InsertAfter(id, "請輸入 http/https:// 網址的格式。");
                    InsertAfter(id, "請輸入論文網址。");
                    InsertAttr(id,"placeholder","請輸入論文網址");
                    InsertAttr(id,"autocomplete","off");
                    break;
                case '_Dissertation_url':
                    InsertAfter(id, "請輸入 http/https:// 網址的格式。");
                    InsertAfter(id, "請輸入論文網址。");
                    InsertAttr(id,"placeholder","請輸入論文網址");
                    InsertAttr(id,"autocomplete","off");
                    break;
            }
        });
        // Input Validation
        $('input#Enrollment_Year').inputmask( '9{1,4}' , { showMaskOnFocus: false , showMaskOnHover: false , "placeholder": returnPlaceHolder($('input#Enrollment_Year')) });
        $('input#Graduate_Year').inputmask( '9{1,4}' , { showMaskOnFocus: false , showMaskOnHover: false , "placeholder": returnPlaceHolder($('input#Graduate_Year')) });
        $('input#phone').inputmask( '9{1,10}' , { showMaskOnFocus: false , showMaskOnHover: false , "placeholder": returnPlaceHolder($('input#phone')) });
        // Other Part Change - user_login description change position and add emoji
        $(".user-user-login-wrap").find("td span").replaceWith("<p class='description'>💩 " + $(".user-user-login-wrap").find("td span").html() + "</p>");
        // Other Part Change - email description hide when email input being focused
        $("#email").on('focus', function(){
            $("#email-description").css('display','none');
        });
        // Other Part Change - email description add emoji
        $("#email-description").html("👺 "+$("#email-description").html());
        // Other Part Change - sessions description add emoji
        if ( $("#is-admin-user").length == 1 ) {
            $(".user-sessions-wrap").find("td p.description").replaceWith("<p class='description'>🍁 " + $(".user-sessions-wrap").find("td p.description").html() + "</p>");
        } else if ( $("#is-not-admin-user").length == 1 ) {
            $(".user-sessions-wrap").find("td p").replaceWith("<p class='description'>🐋 " + $(".user-sessions-wrap").find("td p").html() + "</p>");
        }
        // Other Part Change - enrollment year description add emoji
        if ($("#Enrollment_Year_Lock").length > 0) {
            $(".user-enrollment-year-wrap").find("td p").replaceWith("<p class='description'>🦞 " + $(".user-enrollment-year-wrap").find("td p").html() + "</p>");
        }
        // Other Part Change - 名字/姓氏 add 中文 before
        $(".user-last-name-wrap th label").html("中文"+$(".user-last-name-wrap th label").html());
        $(".user-first-name-wrap th label").html("中文"+$(".user-first-name-wrap th label").html());
        // Change Position for English Name
        $(".user-en-last-name-wrap").insertAfter($(".user-last-name-wrap")).show();
        $(".user-en-first-name-wrap").insertAfter($(".user-en-last-name-wrap")).show();
        // Change Position for Contact Email
        $(".user-contactemail-wrap").insertAfter($(".user-email-wrap")).show();
        // Change Position of yann-local-avatar plugin section
        $("#yann-local-avatar-section").insertAfter($($(".user-phone-wrap").parents("table.form-table")[0])).show();
        // Other Part Change - Display Name Change
        // @https://stackoverflow.com/questions/4222950/how-to-use-jquery-to-select-the-nth-option/38958164
        if ( $("#first-login-recognition").length > 0 ) {
            $(".user-display-name-wrap td select").find("option:selected").removeAttr("selected");
            $(".user-display-name-wrap td select option:eq(0)").attr('selected',true);
        }
        // Other Part Change - generate-reset-link description add emoji
        if ( $(".user-generate-reset-link-wrap").length > 0 ) {
            $(".user-generate-reset-link-wrap").find("td p.description").replaceWith("<p class='description'>🍍 " + $(".user-generate-reset-link-wrap").find("td p.description").html() + "</p>");
        }
        // Other Part Change - append option when type new English Name


        // Call Validation
        RunValidate(SelectToInput(CheckList,"all"),SelectToInput(CheckLOList,"lock"),"ne");
        // Call Validation - Trigger when unnecessary input be focused
        TriggerUnneccesaryValidation(CheckUNList,SelectToInput(CheckLOList,"lock"));

        // Submit Validation
        // @https://stackoverflow.com/questions/14375144/jquery-prevent-default-then-continue-default
        // @https://blog.techbridge.cc/2017/07/15/javascript-event-propagation/
        // @https://ithelp.ithome.com.tw/articles/10198999
        $("form#your-profile").on('submit', function on_submit_function(e) {
            var elelist = SelectToInput(CheckList,"all");
            var eleUnlist = SelectToInput(CheckUNList,"all");
            var eleLolist = SelectToInput(CheckLOList,"lock");
            var rtn = false;
            if ( checkValidate(eleUnlist,eleLolist,'un') ) {
                var rtn = true;
            }
            if ( checkValidate(elelist,eleLolist,'ne') ) {
                if (rtn == false) {
                    var rtn = false;
                } else {
                    var rtn = true;
                }
            } else {
                var rtn = false;
            }
            if ( rtn == true ) {
                // delete first_login record in usermeta
                if ( $("#first-login-recognition").length > 0 ) {
                    $("#first-login-recognition-length").val($("#first-login-recognition").length);
                }
                return rtn;
            } else {
                SubmitAfterAction();
                e.preventDefault();
            }
        });

    });

})(jQuery);