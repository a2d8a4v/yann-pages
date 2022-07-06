(function ($) {
    "use strict";

    function SelectUerProfileUL() {
        return $("section.yann-profilecard div.yann-profilecard-lists div.yann-profilecard-element");
    }

    function MakeCards(info) {
        var card_content = ``;
        
        info.forEach(function(item){

            card_content += `
            <div class="w-full rounded-lg shadow overflow-hidden flex flex-col md:flex-row bg-white yann-a-profilecard">
                <div class="w-full md:w-2/5 h-80">
                    <img class="object-center object-cover w-full h-full" src="${item.useravator_url}" alt="photo">
                </div>
                <div class="w-full md:w-3/5 text-left p-6 md:p-4 space-y-2">
                    <p class="text-xl text-gray-700 font-bold px-4 py-2">${item.username} (${item.userenname})</p>
                    <p class="text-base text-gray-400 font-normal px-4">${item.userresearch_topic}</p>
                    <p class="text-base leading-relaxed text-gray-500 font-normal px-4">${item.userdescription}</p>
                    <div class="flex justify-start space-x-2 px-4">`;

            // buttons insert
            if (item.usercontactemail.length > 0) {
                card_content += `<a href="mailto:${item.usercontactemail}" class="text-gray-500 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </a>`;
            }
            if (item.userurl.length > 0) {
                card_content += `<a href="${item.userurl}" class="text-gray-500 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </a>
                `;
            }
            if (item.usergit.length > 0) {
                if (item.usergit.github !== undefined) {
                    card_content += `<a href="${item.usergit.github}" class="text-gray-500 hover:text-gray-600">
                        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                        </svg>
                    </a>`;
                }
                if (item.usergit.gitlab !== undefined) {
                    card_content += `<a href="${item.usergit.gitlab}" class="text-gray-500 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 54 54" style="enable-background:new 0 0 54 54;">
                            <path d="M26.6,49.3L2.4,31.7c-0.3-0.2-0.6-0.6-0.7-1c-0.1-0.4-0.1-0.8,0-1.2L4.5,21L26.6,49.3z M11.9,3.9L17.4,21H4.5l5.5-17.1   c0.1-0.4,0.5-0.6,0.9-0.6C11.5,3.2,11.8,3.5,11.9,3.9z M17.4,21h18.4l-9.2,28.3L17.4,21z M51.6,29.6c0.1,0.4,0.1,0.8,0,1.2   c-0.1,0.4-0.4,0.7-0.7,1L26.6,49.3L48.7,21L51.6,29.6z M48.7,21H35.9l5.5-17.1c0.1-0.4,0.5-0.6,0.9-0.6c0.5,0,0.8,0.2,0.9,0.6   L48.7,21z"/>
                        </svg>
                    </a>
                    `
                }
            }

            // end
            card_content += `</div></div></div>`;
        });
        return card_content;
    }

    function GetUerProfiles(ele) {
        var data = {};
        var id = ele.attr('id');
        data.action = YANN.action;
        data.nonce  = YANN.nonce;
        data.id = id;
        $.ajax({
            type: "POST",
            url: YANN.ajaxurl ,
            data: data,
            dataType: "json",
            success: function( data ) {
                if ( data.success == true ) {
                    var info = data.data.data;
                    var cards = MakeCards(info);
                    var parent = ele.parent();
                    ele.css("display","none");
                    parent.append(cards);
                    // Adjust the grid css if only one member exists
                    if ( info.length == 1 ) {
                        parent.removeClass();
                        parent.addClass("yann-profilecard-grid");
                    }
                } else if ( data.success == false ) {
                    var info = data.data.errmessage;
                    var parent = ele.parent();
                    ele.css("display","none");
                    parent.append("<p class='noUerProfile'>"+info+"</p>");
                }
            },
        });
    }

    function InsertUerProfileContent() {
        var insertlist = SelectUerProfileUL();
        $( insertlist ).each(function( index ) {
            GetUerProfiles($(insertlist[index]));
        });
    }

    $( document ).ready( function() {
        InsertUerProfileContent();
    });
})(jQuery);

