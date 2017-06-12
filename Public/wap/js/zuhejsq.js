$(document).ready(function() {
    //-------------------------商业贷款-------------------------------------
    $('#sydk_jsbtn').click(function() {         //按贷款额度算
        if ($('#business_rate').val() == '' || isNaN($('#business_rate').val())) {
            $('#business_rate').val(sydk_lv);//年利率
        }
        var year_lilv = parseFloat($('#business_rate').val());      //年利率
        var money = parseFloat($('#business_sum').val());           //贷款金额/万
        var month = parseFloat($('#loan_type01').attr('reval'));    //贷款期限/月
        var debx_or_debj = $('input:radio[name="pattern_ed"]:checked').val();
        if (debx_or_debj == 'debx') {
            debxRun(year_lilv, money, month, 'sydk');
        } else {
            debjRun(year_lilv, money, month, 'sydk');
        }
    });
    $('#sydk_mj_jsbtn').click(function() {         //按贷款面积算
        if ($('#business_rate_mj').val() == '' || isNaN($('#business_rate_mj').val())) {
            $('#business_rate_mj').val(sydkmj_lv);//年利率
        }
        var year_lilv = parseFloat($('#business_rate_mj').val());      //年利率
        var money = parseFloat($('#business_dkje').html());           //贷款金额/万
        var month = parseFloat($('#loan_type04').attr('reval'));    //贷款期限/月
        var debx_or_debj = $('input:radio[name="pattern_mj"]:checked').val();
        if (debx_or_debj == 'debx') {
            debxRun(year_lilv, money, month, 'sydk');
        } else {
            debjRun(year_lilv, money, month, 'sydk');
        }
    });
    //-------------------------公积金贷款-------------------------------------
    $('#gjj_btn').click(function() {        //按贷款额度算
        if ($('#gjjdk_lv').val() == '' || isNaN($('#gjjdk_lv').val())) {
            $('#gjjdk_lv').val(gjjdk_lv);//年利率
        }
        var year_lilv = parseFloat($('#gjjdk_lv').val());      //年利率
        var money = parseFloat($('#gjj_eds_dkje').val());           //贷款金额/万
        var month = parseFloat($('#loan_type08').attr('reval'));    //贷款期限/月
        var debx_or_debj = $('input:radio[name="gongdebx"]:checked').val();
        if (debx_or_debj == 'debx') {
            debxRun(year_lilv, money, month, 'gjjdk');
        } else {
            debjRun(year_lilv, money, month, 'gjjdk');
        }
    });
    //-------------------------组合贷款-------------------------------------
    $('#zuhe_btn').click(function() {        //按贷款额度算
        //------------商业贷款------------
        if ($('#zuhedk_rate').val() == '' || isNaN($('#zuhedk_rate').val())) {
            $('#zuhedk_rate').val(zuhedk_lv);//年利率
        }
        var sy_year_lilv = parseFloat($('#zuhedk_rate').val());        //商业年利率
        var sy_money = parseFloat($('#zuhesydk').val());           //商业贷款金额/万
        //------------公积金贷款------------
        if ($('#zhgjj_ll').val() == '' || isNaN($('#zhgjj_ll').val())) {
            $('#zhgjj_ll').val(zhgjj_ll);//年利率
        }
        var gjj_year_lilv = parseFloat($('#zhgjj_ll').val());        //公积金年利率
        var gjj_money = parseFloat($('#gjj_eds_dkje').val());           //公积金贷款金额/万
        var money = parseFloat(sy_money + gjj_money);
        var month = parseFloat($('#hid_month').val());        //贷款期限/月
        var year_lilv = (sy_money / money * sy_year_lilv) + (gjj_money / money * gjj_year_lilv);
        year_lilv = parseFloat(year_lilv).toFixed(5);
        var debx_or_debj = $('input:radio[name="zhdeb"]:checked').val();
        if (debx_or_debj == 'debx') {
            debxRun(year_lilv, money, month, 'zhdk');
        } else {
            debjRun(year_lilv, money, month, 'zhdk');
        }
    });
});

function debxRun(year_lilv, money, month, tab) {
    var resArr = mydebx(year_lilv, money, month);  //计算结果
    var listArr = resArr['list_res'];
    var simpArr = resArr['simp_res'];
    $('#sydk_yg_text_' + tab).html('每月月供');
    setResdom(simpArr, listArr, tab); //写入到底部dom
}

function debjRun(year_lilv, money, month, tab) {
    var resArr = mydebj(year_lilv, money, month);  //计算结果
    var listArr = resArr['list_res'];
    var simpArr = resArr['simp_res'];
    $('#sydk_yg_text_' + tab).html('最高月供');
    setResdom(simpArr, listArr, tab); //写入到底部dom  
}

/**
 * ---------------------------------等额本息还款计算----------------------------------------------------
 * @param float year_lilv  年利率
 * @param float money      贷款金额/万
 * @param float month      贷款期限/月
 * @returns array 计算结果  array(chbj=>277777777.7777778 ,chbx=>33236.11111111111, ....);
 */
function mydebx(year_lilv, money, month) {
    money = (money * 10000);
    var year = month / 12;  //年
    var year_1 = (parseInt(year / 5));
    var year_2 = (parseInt(year / 5));
    var active = year_lilv * 10 / 12 * 0.001;
    var t1 = Math.pow(1 + active, month);
    var t2 = t1 - 1;
    var tmp = t1 / t2;
    var monthratio = active * tmp; //月利率
    var monthBack = (money * monthratio).toFixed(2); //每月支付本息
    year_lilv = year_lilv * 0.01;   //百分比
    var yue_lilv = ((year_lilv / 12));
    var objArray = new Array();             //等额本息结果二维数组
    var ljch_bj = 0;                        //累积偿还本金
    var pre_sybj = 0;                       //上一个月剩余本金
    var i = 1;
    for (i = 1; i <= month; i++) {              //等额本息
        objArray[i - 1] = new Array();          //声明二维，每一个一维数组里面的一个元素都是一个数组；
        objArray[i - 1]['qc'] = i;              //期次
        objArray[i - 1]['chbx'] = monthBack;    //第i个月，偿还本息（元）   月供
        if (i == 1) {                           //第一个月
            pre_sybj = money;
        } else {
            pre_sybj = objArray[i - 2]['sybj'];
        }
        objArray[i - 1]['chlx'] = (pre_sybj * yue_lilv).toFixed(2);       //第i个月，偿还利息（元）每月付息额 =（贷款本金-已还清贷款本金）×月利率
        var chbj = (objArray[i - 1]['chbx'] - objArray[i - 1]['chlx']);     //第i个月，偿还本金（元）
        objArray[i - 1]['chbj'] = chbj.toFixed(2);
        ljch_bj += chbj;
        var sybj = (money - ljch_bj);
        objArray[i - 1]['sybj'] = sybj.toFixed(2);                        //第i个月，剩余本金（元）
        if (sybj <= 1) { //最后一个月出现小于1元的值
            objArray[i - 1]['sybj'] = 0.00;                                  //第i个月，剩余本金（元）
        }
    }
    var yg = monthBack;                 //月供
    var ljhkze = monthBack * month;     //累计还款总额
    var lxze = ljhkze - money;          //利息总额
    var yxxdy = monthBack * 2;          //月薪需大于
    var resArray = new Array();
    resArray['simp_res'] = new Array(); //顶部基础信息数组
    resArray['list_res'] = new Array(); //底部列表信息数组
    resArray['simp_res']['yg'] = parseFloat(yg).toFixed(0);
    resArray['simp_res']['ljhkze'] = parseFloat(ljhkze).toFixed(0);
    resArray['simp_res']['lxze'] = parseFloat(lxze).toFixed(0);
    resArray['simp_res']['yxxdy'] = parseFloat(yxxdy).toFixed(0);
    resArray['list_res'] = objArray;
//    console.log(resArray);
    return resArray;
}

/**
 * ---------------------------------等额本金还款法----------------------------------------------------
 * @param float year_lilv  年利率
 * @param float money      贷款金额/万
 * @param float month      贷款期限/月
 * @returns array 计算结果  array(chbj=>277777777.7777778 ,chbx=>33236.11111111111, ....);
 */
function  mydebj(year_lilv, money, month) {
    money = money * 10000;
    var year = month / 12;
    var year_1 = (parseInt(year / 5));
    var year_2 = (parseInt(year / 5));
    var active = year_lilv * 10 / 12 * 0.001;
    var objArray = new Array();
    var interestM = 0;              //月还款额
    var interestTotal = 0;          //累计还款总额
    var chbj = money / month;      //每月偿还本金（元）     month 3年36
    for (var i = 1; i <= month; i++) {
        var t1 = (money - money * (i - 1) / month) * active; //第i月还款利息
        interestM = money / month + t1; //第i月还款额
        objArray[i - 1] = new Array();    //声明二维，每一个一维数组里面的一个元素都是一个数组；
        objArray[i - 1]['qc'] = i;                                    //期次
        objArray[i - 1]['chbx'] = (interestM).toFixed(2);                          //第i个月，偿还本息（元）   月供
        objArray[i - 1]['chlx'] = (interestM - chbj).toFixed(2);                   //第i个月，偿还利息（元）
        objArray[i - 1]['chbj'] = (chbj).toFixed(2);                               //第i个月，偿还本金（元）
        objArray[i - 1]['sybj'] = (money - (chbj * i)).toFixed(2);    //第i个月，剩余本金（元）
        if (objArray[i - 1]['sybj'] <= 1) { //最后一个月出现小于1元的值
            objArray[i - 1]['sybj'] = 0.00;                           //第i个月，剩余本金（元）
        }
        interestTotal = interestTotal + interestM;
    }
    interestTotal = (Math.round(interestTotal * 100)) / 100;          //累计还款总额
    var yg = objArray[0]['chbx'];       //月供  最高月供
    var ljhkze = interestTotal;         //累计还款总额
    var lxze = (ljhkze - money);        //利息总额
    lxze = lxze.toFixed(0);
    var yxxdy = (parseFloat(objArray[0]['chbx']) + parseFloat(objArray[month - 1]['chbx']));  //月薪需大于
    yxxdy = yxxdy.toFixed(0);
    var resArray = new Array();
    resArray['simp_res'] = new Array(); //顶部基础信息数组
    resArray['list_res'] = new Array(); //底部列表信息数组
    resArray['simp_res']['yg'] = parseFloat(yg).toFixed(0);
    resArray['simp_res']['ljhkze'] = parseFloat(ljhkze).toFixed(0);
    resArray['simp_res']['lxze'] = parseFloat(lxze).toFixed(0);
    resArray['simp_res']['yxxdy'] = parseFloat(yxxdy).toFixed(0);
    resArray['list_res'] = objArray;
    return resArray;
}

/**
 * 根据array设置底部计算结果list
 * @param {type} simpArr     底部计算结果  array(lxze=>,yg=>, ....);
 * @param {type} listArr     底部计算tbody结果  array(chbj=>277777777.7777778 ,chbx=>33236.11111111111, ....);
 * @param {type} tab     tab = 'sydk', tab = 'gjjdk', tab = 'zhdk', 
 * @returns {undefined}
 */
function setResdom(simpArr, listArr, tab) {     //设置等额本金或者等额本息计算结果设置到dom
    $("#" + tab + "_lxze").html(simpArr['lxze']).hide().fadeIn("slow");//利息总额
    $("#" + tab + "_myyg").html(simpArr['yg']).hide().fadeIn("slow");  //每月月供 
    $("#" + tab + "_ljhk").html(simpArr['ljhkze']).hide().fadeIn("slow");  //累计还款总额
    $("#" + tab + "_yxxdy").html(simpArr['yxxdy']).hide().fadeIn("slow");  //月薪需大于
    var table_trs = '';         //表格
    for (var i = 0; i < listArr.length; i++) {
        table_trs += "<tr><td>" + listArr[i]['qc'] + "</td><td>" + listArr[i]['chbx'] + "</td><td>" + listArr[i]['chlx'] +
                "</td><td>" + listArr[i]['chbj'] + "</td><td>" + listArr[i]['sybj'] + "</td></tr>";
    }
    $("#hd_tbody_" + tab).html('');
    $("#hd_tbody_" + tab).html(table_trs).hide();      //设置底部表格
    $("#hd_tbody_" + tab).html(table_trs).fadeIn("slow");    //设置底部表格
    $("#hd_tbody_sydk tr:odd").css('background-color', '#dce9f1');
    $("#hd_tbody_gjjdk tr:odd").css('background-color', '#dce9f1');
    $("#hd_tbody_zhdk tr:odd").css('background-color', '#dce9f1');
}
function MQxian(obj) {
    var QixianObj = $('[class="SelectCon"]').val();
    $('#hid_month').val(QixianObj);
}
function LoanLV(obj) {
    var Loanlvobj = $('[name="lv_type"]').val();
    $('#zuhedk_rate').val(Loanlvobj);
    //alert($('#zuhedk_rate').val(Loanlvobj));
}
function ClearData(obj) {
    $('#zuhesydk').attr('value', '');
}
function AddData(obj) {
    if ($('#zuhesydk').val() == '')
        $('#zuhesydk').val('100') ;
}
function ClearD(obj) {
    $('#gjj_eds_dkje').attr('value', '');
}
function AddD(obj) {
    if ($('#gjj_eds_dkje').val() == '')
        $('#gjj_eds_dkje').val('50') ;
}
function jisyinc(obj) {
    var obj = $(obj);
    var moe = obj.parents('.prod_box').children('.mat02');
    var moed = obj.parents('.prod_box').children('.mat01');
    moe.show();
    moed.hide();
    $('.backbtn').removeClass('none');
    $('.backbtnn').removeClass('none');
}
function backHome(obj) {
    var obj = $(obj);
    var moe = $('.prod_box').children('.mat02');
    var moed = $('.prod_box').children('.mat01');
    moed.show();
    moe.hide();
    $('.backbtnn').addClass('none');
    $('.Ptop').removeClass('none');
}
