// JavaScript Document

$(document).ready(function () {
    var winH = $(window).height();
    var headH = $(".header").height();
    var footH = $(".footer").height();
    if (footH == "null") {
        $("body,.layer-main").css({
            "padding-top": headH
        });
    } else {
        $("body,.layer-main").css({
            "padding-top": headH,
            "padding-bottom": footH
        });
    }


    $(window).on('resize', function () {
        var winHH = $(window).height();
        if (winH > winHH) {
            $(".header").css({
                "position": "absolute"
            })
        } else {
            $(".header").css({
                "position": "fixed"
            })
        }
    });

});


//判断是否是移动设备
function isMobile() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPad') != -1) {
        return true;
    } else {
        return false;
    }
}



//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;
(function ($) {
    $.fn.touchEventBind = function (touch_options)

    {

        var touchSettings = $.extend({

            tapDurationThreshold: 250, //触屏大于这个时间不当作tap

            scrollSupressionThreshold: 10, //触发touchmove的敏感度

            swipeDurationThreshold: 750, //大于这个时间不当作swipe

            horizontalDistanceThreshold: 30, //swipe的触发垂直方向move必须小于这个距离

            verticalDistanceThreshold: 75, //swipe的触发水平方向move必须大于这个距离

            tapHoldDurationThreshold: 750, //swipe的触发水平方向move必须大于这个距离

            doubleTapInterval: 250 //swipe的触发水平方向move必须大于这个距离

        }, touch_options || {})

        var touch = {},
            touchTimeout, delta, longTapTimeout;



        function parentIfText(node) {

            return 'tagName' in node ? node : node.parentNode

        }



        function swipeDirection(x1, x2, y1, y2) {

            var xDelta = Math.abs(x1 - x2),
                yDelta = Math.abs(y1 - y2)

            return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')

        }



        function longTap()

        {

            longTapTimeout = null

            touch.el.trigger('longTap');

            touch.longTap = true;

            touch = {};

        }



        function cancelLongTap()

        {

            if (longTapTimeout) clearTimeout(longTapTimeout)

            longTapTimeout = null

        }





        this.data('touch_event_bind', "true");

        this.bind('touchstart', function (e)

            {

                touchTimeout && clearTimeout(touchTimeout);



                touch.el = $(parentIfText(e.touches[0].target));

                now = Date.now();

                delta = now - (touch.last_touch_time || now);

                touch.x1 = e.touches[0].pageX;

                touch.y1 = e.touches[0].pageY;

                touch.touch_start_time = now;

                touch.last_touch_time = now;

                if (delta > 0 && delta <= touchSettings.doubleTapInterval) touch.isDoubleTap = true;



                longTapTimeout = setTimeout(function () {



                    longTap();

                }, touchSettings.tapHoldDurationThreshold);



            }).bind('touchmove', function (e)

            {

                cancelLongTap();



                touch.x2 = e.touches[0].pageX;

                touch.y2 = e.touches[0].pageY;

                // prevent scrolling

                if (Math.abs(touch.x1 - touch.x2) > touchSettings.scrollSupressionThreshold)

                {

                    e.preventDefault();

                }

                touch.touch_have_moved = true;





            }).bind('touchend', function (e)

            {

                cancelLongTap();



                now = Date.now();

                touch_duration = now - (touch.touch_start_time || now);

                if (touch.isDoubleTap)

                {

                    touch.el.trigger('doubleTap');

                    touch = {};

                } else if (!touch.touch_have_moved && touch_duration < touchSettings.tapDurationThreshold)

                {

                    touch.el.trigger('tap');



                    touchTimeout = setTimeout(function () {

                        touchTimeout = null;

                        touch.el.trigger('singleTap');

                        touch = {};

                    }, touchSettings.doubleTapInterval);

                } else if (touch.x1 && touch.x2)

                {

                    if (touch_duration < touchSettings.swipeDurationThreshold && Math.abs(touch.x1 - touch.x2) > touchSettings.verticalDistanceThreshold && Math.abs(touch.y1 - touch.y2) < touchSettings.horizontalDistanceThreshold)

                    {

                        touch.el.trigger('swipe').trigger(touch.x1 > touch.x2 ? "swipeLeft" : "swipeRight");

                        touch = {};

                    }

                }

            }).bind('touchcancel', function (e) {

            touchTimeout && clearTimeout(touchTimeout);

            cancelLongTap();

            touch = {};

        })

    }



    $.fn.touchbind = function (m, callback, touch_options)

    {

        if (this.data('touch_event_bind') != "true")

        {

            this.touchEventBind(touch_options);

        }

        this.bind(m, callback);

    }



    ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (m)

        {

            $.fn[m] = function (touch_options, callback)

            {

                if (typeof (touch_options) == "object" && typeof (callback) == "function")

                {

                    return this.touchbind(m, callback, touch_options)

                } else if (typeof (touch_options) == "function")

                {

                    var callback = touch_options;

                    return this.touchbind(m, callback)

                }

            }

        })

})(Zepto);



;(function ($) {
    // 自定义，添加jQuery全局函数，命名空间【tyePlugin】
    $.tyePlugin = {
        OpenLoad: function () {
            $("body").append("<div id=\'tyeLoading\'><p>请稍后...</p></div>");
        },
        HideLoad: function () {
            if ($("#tyeLoading") != null || $("#tyeLoading").length > 0) {
                $("#tyeLoading").remove();
            } else {
                return false;
            }
        }
    }
})(Zepto);



// 验证码
function refreshVerify(img) {
    var src = $(img).attr("src");
    $(img).attr("src", src + "?" + Math.random());
};


// 省份 + 城市联动
function getCitys(pID, cID, pNum, cNum) {
    var prov_obj = $(pID);
    var city_obj = $(cID);
    var select_prehtml = "<option value=''>请选择</option>";
    var prov_Url = "/api/get_provnice.html"; //省份json数据

    var provinceName = $("#province-name").text();
    var cityName = $("#city-name").text();



    // 设置省市json数据
    $.getJSON(prov_Url, function (json) {
        var temp_html = select_prehtml;

        // 遍历赋值省份下拉列表
        for (var i in json) {
            if (i == pNum || json[i] == provinceName) {
                temp_html += '<option value="' + i + '" selected="selected">' + json[i] + '</option>';
                $(".tdProvince p").text(json[i]);
            } else {
                temp_html += "<option value='" + i + "'>" + json[i] + "</option>";
            }

        };


        prov_obj.html(temp_html);

        //如果初始化，设置了默认省份，获取对应城市json
        if (pNum || provinceName) {
            cityStart();
        };
    });

    // 选择省份时发生事件
    prov_obj.on("change", function () {
        cityStart();
    });


    // 赋值市级函数
    var cityStart = function () {
        // 获取省份选中值
        var prov_id = prov_obj.get(0).selectedIndex;
        // 设置省市json数据
        $.getJSON("/api/get_city/" + prov_id + ".html", function (json) {
            var temp_html = select_prehtml;

            // 遍历赋值市级下拉列表
            for (var i in json) {
                if (i == cNum || json[i] == cityName) {
                    temp_html += '<option value="' + i + '" selected="selected">' + json[i] + '</option>';
                    $(".tdCity p").text(json[i]);
                } else {
                    temp_html += "<option value='" + i + "'>" + json[i] + "</option>";
                }
            }
            city_obj.html(temp_html);
        });
    };


};