(function ($) {
    "use strict";

    // Class definition
    var GPUsDATAProcessing = "GPUsDATAProcessing";
    var noGPUsData  = "noGPUsData";
    var tab_content = $(".yannyann-gpumonitor-tab, .yannyann-gpumonitor-console-pages");
    var interval    = 0;

    function dataProcessing(items) {
        items.forEach(function(item){
            var status = [];
            var index = 0;

            for (const [key, value] of Object.entries(item.status)) {
                status.push(value);
            }
            
            item.gpu_infos.forEach(function(gpu){
                item.rdm  = item.name;
                // gpu.gpu_util  = status[index].gpu_util;
                gpu.mem_free  = status[index].mem_free;
                gpu.mem_total = status[index].mem_total;
                gpu.mem_used  = status[index].mem_used;
                // gpu.gpu_temp  = status[index].gpu_temp;
                // gpu.gpu_name  = status[index].gpu_name;
                gpu.proc      = status[index].proc;
                // gpu.proc = procs[index];
                index += 1;
            });
        });

    }

    function SelectGPUMonitorUL() {
        return $(".wp-block-yannyann-box-gpumonitor .yannyann-gpumonitor-box");
    }

    function TabsAction(evt) {
        // Declare all variables
        var i, tabcontent, tablinks;
      
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
      
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
      
        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById('tabcontent-hostname-'+evt.currentTarget.RDNParam).style.display = "block";
        evt.currentTarget.className += " active";
    }

    function countFloat(item, type) {
        var progress = (type=='gpu') ? parseFloat(item.gpu_util)/100: item.mem_used/item.mem_total;
        return progress
    }

    function generateProgressElement(id,item,type) {

        // Generate element
        var progress = countFloat(item, type);
        let div = document.createElement('div');
        div.id = id;
        div.setAttribute("data-progress",progress);
        return div;
    }

    function generateProgressObject(id) {
        var ele = document.getElementById(id);
        var pro = ele.getAttribute("data-progress");
        var object = new ProgressBar.Line("#"+id, {
            strokeWidth: 2,
            trailWidth: 1,
            easing: 'easeInOut',
            duration: 1400,
            color: '#FFEA82',
            trailColor: '#eee',
            svgStyle: {width: '100%', height: '10px'},
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: (state, bar) => {
                bar.path.setAttribute('stroke', state.color);
            }
        });
        object.animate(parseFloat(pro));
        return object;
    }

    function setProgressObject(id, object, item, type) {
        var ele = document.getElementById(id);
        ele.setAttribute("data-progress",countFloat(item, type));
        var pro = ele.getAttribute("data-progress");
        object.animate(parseFloat(pro));
    }

    function NameModeTemp(gpu, idx) {
        var name = "GPU "+idx+" ("+gpu.gpu_name+")";
        var temperature = gpu.gpu_temp+"℃";
        var gpu_mode = (gpu.com_mode.toLowerCase() == 'default')?``:` - <mark class="">Exclusive Mode</mark>`;
        return `${name}${gpu_mode} → ${temperature}`;
    }

    function MemUsedTotal(gpu) {
        return `${gpu.mem_used} / ${gpu.mem_total}`;
    }

    function GPUFan(gpu) {
        return `${gpu.fan_speed} FAN`;
    }

    function GPUPowerUsed(gpu) {
        return `${gpu.pow_draw} / ${gpu.pow_limit}`;
    }

    function GPUProcAttr(gpu) {
        return gpu.proc.length;
    }

    function GPUUtilTotal() {
    }

    function GPUStyleFanPower(style) {
        return (style.fan_and_power) ? `block`: `hidden`;
    }

    function GPUStyleProcUser(style) {
        return (style.prce_shown_for_loginusers) ? `block`: `hidden`;
    }

    function GPUProcBtn(gpu, style) {

        var users_name = `<div class="pt-2 px-2">`;
        var has_user = false;
        gpu.proc.forEach(function(proc_,idx_, arr){
            //var proc_num
            if (proc_.user != 'root'){
                var ur_pid = `<div class="text-sm text-gray-900 font-bold">${proc_.user}</div>`;
                var last = (idx_ === arr.length-1 )?``:`border-b`;
            
                users_name += `<div class="${last}">${ur_pid}</div>`;
                has_user = true;
            }            
        });
        users_name += `</div>`;

        if (has_user == false) {
            users_name = ``;
        }

        var final = `${gpu.proc.length} ${gpu.proc.length?`processes`:`process`} exist.`;
        var rtn = (style.users_showon_collapsebutton) ? final + users_name : final;

        return rtn;
    }

    function GPUUsersProc(gpu) {
        var users_proc = ``;
        gpu.proc.forEach(function(proc_,idx_, arr){
            var ur_pid = `<p class="text-sm text-gray-900 font-bold">${proc_.user} (${proc_.pid}: ${proc_.mem} M)</p>`;
            var cmd  = `<p class="text-sm text-gray-900">${proc_.command}</p>`;;
            var last = (idx_ === arr.length - 1)?``:`border-b`;
            users_proc += `<div class="pt-4 px-4 ${last}">${ur_pid}${cmd}</div>`;
        });
        return users_proc;
    }

    function MakeCard(item, gpu, idx) {

        // style
        var style = item.style;
        var open_fan_power_id   = `gpu-style-fan-power-${idx}-${item.rdm}`;
        var open_fan_power_css  = GPUStyleFanPower(style);
        var open_proc_users_id  = `gpu-style-procs-users-${idx}-${item.rdm}`;
        var open_proc_users_css = GPUStyleProcUser(style);

        // utilities
        var gpu_card       = `gpu-card-${idx}-${item.rdm}`;
        var name_mode_temp = `gpu-name-mode-temp-${idx}-${item.rdm}`;
        var gpu_util_id    = `gpu-util-${idx}-${item.rdm}`;
        var mem_util_id    = `mem-util-${idx}-${item.rdm}`;
        var mem_used_total = `gpu-mem-used-total-${idx}-${item.rdm}`;
        var gpu_fan_used   = `gpu-fan-${idx}-${item.rdm}`;
        var gpu_power_used = `gpu-power-${idx}-${item.rdm}`;
        var gpu_proc_btn   = `gpu-proc-${idx}-${item.rdm}`;
        var gpu_user_proc  = `gpu-users-proc-${idx}-${item.rdm}`;
        var gpu_util = generateProgressElement(gpu_util_id,gpu,"gpu");
        var mem_util = generateProgressElement(mem_util_id,gpu,"mem");
        var gpu_util_content = `<div class='gpu-util-${idx} gpu'>${gpu_util.outerHTML}</div>`;
        var mem_util_content = `<div class='mem-util-${idx} mem'>${mem_util.outerHTML}</div>`;

        var html = `<div class="antialiased font-sans w-full sm:w-full md:w-full lg:w-full xl:w-1/2 max-w-full py-6 px-3" id="${gpu_card}">
                <div class="items-center justify-center">
                    <div class="bg-white shadow rounded-lg overflow-hidden">
                        <div class="bg-cover bg-center bg-transparent h-60 p-4">
                            <div class="p-4">
                                <p class="uppercase tracking-wide text-base font-bold text-green-500" id="${name_mode_temp}">${NameModeTemp(gpu, idx)}</p>
                            </div>
                            <div class="px-4">
                                <p class="uppercase tracking-wide text-base text-gray-700">GPU Utilities</p>
                                ${gpu_util_content}
                            </div>
                            <div class="px-4">
                                <p class="uppercase tracking-wide text-base text-gray-700">MEM Utilities: <span class="text-gray-800 font-bold" id="${mem_used_total}">${MemUsedTotal(gpu)}</span></p>
                                ${mem_util_content}
                            </div>
                        </div>
                        <div class="${open_fan_power_css} flex p-4 border-t border-gray-300 text-gray-700" id="${open_fan_power_id}">
                            <div class="flex-1 inline-flex items-center">
                                <div class="pl-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div class="pt-2 pl-1">
                                    <p class="text-base text-gray-900 font-bold" id="${gpu_fan_used}">${GPUFan(gpu)}</p>
                                </div>
                            </div>
                            <div class="flex-1 inline-flex items-center">
                                <div class="pl-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div class="pt-2 pl-1">
                                    <p class="text-base text-gray-900 font-bold" id="${gpu_power_used}">${GPUPowerUsed(gpu)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="${open_proc_users_css} px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100" id="${open_proc_users_id}">
                            <button class="text-sm p-3 collapsible" proc=${GPUProcAttr(gpu)} id="${gpu_proc_btn}">${GPUProcBtn(gpu, style)}</button>
                            <div class="items-center users-proc" id="${gpu_user_proc}">${GPUProcAttr(gpu)?`<div>${GPUUsersProc(gpu)}</div>`:``}</div>
                        </div>
                    </div>
                </div>
            </div>`;

        return html;
    }

    function InsertCards(ele, items, GPUsDATAProcessing, noGPUsData, tab_content) {
        var tabparent = ele.find(".yannyann-gpumonitor-tab");
        var tabcontentparent = ele.find(".yannyann-gpumonitor-console-pages");

        items.forEach(function(item){

            // GPU utility circle progress bar
            var gpus = "";
            item.gpu_infos.forEach(function(gpu){
                var idx  = gpu.index;
                var card = MakeCard(item, gpu, idx);
                gpus += card;
            });
            gpus = `<div class="flex flex-wrap">${gpus}</div>`;

            // append tabs and tabcontents
            tabparent.append(`<button id="tab-hostname-${item.rdm}" class="tablinks">${item.name}</button>`);
            tabcontentparent.append(`<div id="tabcontent-hostname-${item.rdm}" class="tabcontent">${gpus}</div>`);

            // Tabs setting
            var btn = document.getElementById('tab-hostname-'+item.rdm);
            btn.RDNParam = item.rdm;
            btn.addEventListener("click", TabsAction, false);
        });

        // Add collapsible events
        Collapse();

        // show the tabs and tabcontent pages
        $(`.${GPUsDATAProcessing}`).remove();
        tab_content.removeClass("start");

        // activate the first tab
        tabparent.find('button:first').addClass("active");
        tabcontentparent.find('div[id*=tabcontent-hostname-]:first').css("display","block");
    }

    function InsertCardsFailed(ele, info, GPUsDATAProcessing, noGPUsData, tab_content ) {
        $(`.${GPUsDATAProcessing}`).remove();
        ele.append(`<p class=${noGPUsData}>${info}</p>`);
    }

    function geneCardIDs(items) {
        var rtn = {};
        var pgs = [];
        // Per host
        items.forEach(function(item){
            // Per card in hosts
            item.gpu_infos.forEach(function(gpu){

                var id_rtn = {};
                var idx = gpu.index;

                // values
                id_rtn.name_mode_temp = `gpu-name-mode-temp-${idx}-${item.rdm}`;
                id_rtn.gpu_util_id    = `gpu-util-${idx}-${item.rdm}`;
                id_rtn.gpu_used_total = `gpu-util-used-total-${idx}-${item.rdm}`; // it is not used
                id_rtn.mem_util_id    = `mem-util-${idx}-${item.rdm}`;
                id_rtn.mem_used_total = `gpu-mem-used-total-${idx}-${item.rdm}`;
                id_rtn.gpu_fan_used   = `gpu-fan-${idx}-${item.rdm}`;
                id_rtn.gpu_power_used = `gpu-power-${idx}-${item.rdm}`;
                id_rtn.gpu_proc_btn   = `gpu-proc-${idx}-${item.rdm}`;
                id_rtn.gpu_user_proc  = `gpu-users-proc-${idx}-${item.rdm}`;

                // style
                id_rtn.open_fan_power = `gpu-style-fan-power-${idx}-${item.rdm}`;
                id_rtn.open_proc_user = `gpu-style-procs-users-${idx}-${item.rdm}`;
                
                rtn[`gpu-card-${idx}-${item.rdm}`] = {
                    name: item.name,
                    rdm: item.rdm,
                    ids: id_rtn,
                };
                pgs.push({'i':id_rtn.gpu_util_id, 't':'gpu'});
                pgs.push({'i':id_rtn.mem_util_id, 't':'mem'});
            });
        });
        return [rtn, pgs];
    }

    function GetGPUs(ele, GPUsDATAProcessing, noGPUsData, tab_content) {
        // hide tabs and tabcontent pages at first
        ele.append(`<p class=${GPUsDATAProcessing}>連線中...</p>`);
        return GetGPUsAJAX();
    }

    function GetGPUsAJAX() {
        var data = {};
        data.action = YANN.action;
        data.nonce  = YANN.nonce;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: YANN.ajaxurl,
                type: 'POST',
                dataType: "json",
                data: data,
                success: function (data) {
                    dataProcessing(data.data.data);
                    resolve(data.data.data);
                    // if ( data.success === true ) {
                    //     var items = data.data.data;
                    //     resolve(items);
                    // } else if ( data.success == false ) {
                    //     var info = data.data.errmessage;
                    //     reject(info);
                    // }
                },
                error: function (error) {
                    reject(error);
                },
            })
        });
    }

    function collapse_content() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        } 
    }

    function Collapse() {
        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            // skip button with zero process in GPU
            if (!parseInt(coll[i].getAttribute("proc"))) {
                coll[i].removeEventListener("click", collapse_content, false);
                continue;
            }
            coll[i].addEventListener("click", collapse_content, false);
        } 
    }

    function UpdateCards(ele, ids, pgs_objs, GPUsDATAProcessing, noGPUsData) {
        return GetGPUsAJAX().then(function(items){
            $(`.${noGPUsData}`).remove();
            items.forEach(function(item){
                // Per card in hosts
                item.gpu_infos.forEach(function(gpu){

                    var idx   = gpu.index;
                    var point = `gpu-card-${idx}-${item.rdm}`;
                    var _get  = ids[point].ids;
                    var style = item.style;

                    // update values
                    $(`#${_get.name_mode_temp}`).html(NameModeTemp(gpu, idx));
                    // $(`#${_get.gpu_used_total}`).html(GPUUtilTotal(gpu)); // it is not used
                    $(`#${_get.mem_used_total}`).html(MemUsedTotal(gpu));
                    $(`#${_get.gpu_fan_used}`).html(GPUFan(gpu));
                    $(`#${_get.gpu_power_used}`).html(GPUPowerUsed(gpu));
                    $(`#${_get.gpu_proc_btn}`).html(GPUProcBtn(gpu, style));
                    $(`#${_get.gpu_proc_btn}`).attr("proc",GPUProcAttr(gpu));
                    $(`#${_get.gpu_user_proc}`).html(`${GPUProcAttr(gpu)?`<div>${GPUUsersProc(gpu)}</div>`:``}`);

                    // update styles
                    $(`#${_get.open_fan_power}`).removeClass("block hidden").addClass(GPUStyleFanPower(style));
                    $(`#${_get.open_proc_user}`).removeClass("block hidden").addClass(GPUStyleProcUser(style));
                    
                    setProgressObject(_get.gpu_util_id, pgs_objs[_get.gpu_util_id].o, gpu, pgs_objs[_get.gpu_util_id].t);
                    setProgressObject(_get.mem_util_id, pgs_objs[_get.mem_util_id].o, gpu, pgs_objs[_get.mem_util_id].t);
                });
            });

        }).catch(function(error){
            if ( $(`.${noGPUsData}`).length == 0 ) {
                ele.append(`<p class=${noGPUsData}>重新連線中...</p>`);
            }
        });
    }

    function InsertGPUMonitorContent(GPUsDATAProcessing, noGPUsData, tab_content) {
        var insertlist = SelectGPUMonitorUL();
        $( insertlist ).each(function( index ) {
            setTimeout( function(){
                var ele = $(insertlist[index]);
                GetGPUs(ele, GPUsDATAProcessing, noGPUsData, tab_content).then(function(items) {
                    // Generate Cards
                    var [ids, pgs] = geneCardIDs(items);
                    var prgres_obs = {};
                    InsertCards(ele, items, GPUsDATAProcessing, noGPUsData, tab_content);
                    // Generate Progress object
                    pgs.forEach(function(id_){
                        var t = generateProgressObject(id_.i);
                        prgres_obs[id_.i] = {'o':t, 't':id_.t};
                    });

                    // Interval call
                    interval = 20;
                    setInterval(function(){
                        UpdateCards(ele, ids, prgres_obs, GPUsDATAProcessing, noGPUsData);
                    }, interval * 1000);
                }).catch(function (error) {
                    InsertCardsFailed(ele, error, GPUsDATAProcessing, noGPUsData, tab_content );
                });
            }, interval * 1000);
        });
    }

    $( document ).ready( function() {
        InsertGPUMonitorContent(GPUsDATAProcessing, noGPUsData, tab_content);
    });

})(jQuery);

