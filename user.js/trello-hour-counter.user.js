// ==UserScript==
// @name        Trelloの工数カウンター
// @match   https://trello.com/b/*
// @description Trelloの工数をカウントします
// 1hとか2hとかいう名前のlabelを利用して工数カウントに利用しています
// ==/UserScript==


(function (callback) {
    // とりあえずjquery使えるようにする
    var script = document.createElement("script");
    script.setAttribute("src", "//code.jquery.com/jquery-2.1.4.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")(jQuery.noConflict(true));";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
})(function ($) {

    $(document).ready(function(){

        function put_time_label(){
            var time_label = $("<span></span>", {
                "text"   : "? h",
                "id"   : "time-label",
                "class": "board-header-btn-text"
            })[0];
            var cal_btn = $("<a></a>", {
                "text": "Recalculate",
                "class": "board-header-btn board-header-btn-without-icon"
            });
            $(".board-header-btn.board-header-btn-name").append(time_label);

            function calc() {
                var labels = $('.card-label');
                var hours = 0;
                $.each(labels,function(k,v){
                    var result = v.title.match(/(\d)h/);
                    if (result!=null) {
                        hours += parseInt(result[1]);
                    }
                });
                if (0<hours) {
                    $("#time-label")[0].innerText = hours + "h"
                }
            }

            function calcEveryList() {
                var lists = $('.list');
                $.each(lists,function(k,v){
                    var hours = 0;
                    var labels = $(v).find('.card-label');
                    var titleh2 = $(v).find('.list-header-name-assist')[0];
                    $.each(labels,function(k2,v2){
                        var result = v2.title.match(/(\d)h/);
                        if (result!=null) {
                            hours += parseInt(result[1]);
                        }
                    });
                    var target = $(v).find('.list-header')[0];
                    $(target).append('<h2>' + hours + 'h</h2>')
                });
            }

            cal_btn.bind("click",  calc);
            $("div.board-header").append(cal_btn);
            calc();
            calcEveryList();
        }

        setTimeout(put_time_label,2000);
    });
});

