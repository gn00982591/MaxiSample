var iscloseblockui = false;

(function ($, undefined) {
    /*$*/
    $.extend({
        /*加法，處理javascript在處理Float的問題*/
        "addition": function (num1, num2) {
            var r1, r2, m;
            try { r1 = num1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = num2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            return (num1 * m + num2 * m) / m;
        },
        /*乘法*/
        "multiplication": function (num1, num2) {
            var m = 0, s1 = (num1 == null ? 0 : num1).toString(), s2 = (num2 == null ? 0 : num2).toString();
            try { m += s1.split(".")[1].length } catch (e) { }
            try { m += s2.split(".")[1].length } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },
        /*除法*/
        "division": function (num1, num2) {
            var t1 = 0, t2 = 0, r1, r2;
            try { t1 = num1.toString().split(".")[1].length } catch (e) { }
            try { t2 = num2.toString().split(".")[1].length } catch (e) { }
            r1 = Number(num1.toString().replace(".", ""));
            r2 = Number(num2.toString().replace(".", ""));
            return (r1 / r2) * Math.pow(10, t2 - t1);
        },
        /*物件內容轉數字*/
        "tonumone": function (o) { return $.multiplication(o, 1); },
        /*物件內容轉數字*/
        "tonum": function (o, l) { for (var i in l) { o[l[i]] = $.multiplication(o[l[i]], 1); } return o; },
        /*物件內容轉數字加千分符*/
        "tonumonethou": function (o) {
            var str = $.multiplication(o, 1).toString();
            return str.replace(/\./.test(str) ? (/(\d{1,3})(?=(\d{3})+\.)/g) : (/(\d{1,3})(?=(\d{3})+$)/g), "$1,");
        },
        /*清除元件的val()的空白，並轉大寫*/
        "totrimupper": function (o) { o.val($.trim(o.val()).toUpperCase()); }
    });
    /*by element*/
    $.fn.extend({
        /*設定表單資料*/
        "setfrm": function (obj) {
            var tn = "name";
            $(this).find("[" + tn + "]").each(function (i) {
                var ths = $(this);
                if (ths.is(":checkbox")) { ths.prop("checked", obj[ths[0][tn]]); }
                else if (ths.is(":input,select")) { ths.val(obj[ths[0][tn]]); }
                else if (ths.is("td,span")) { ths.text(obj[$(ths).attr(tn)]); }
            });
            return $(this);
        },
        /*清除元件的val()的空白*/
        "totrim": function () { return this.each(function () { var t = $(this); t.val($.trim(t.val())); }); },
        /*輸入時檢核訊息處理*/
        "va": function () {
            var t = $(this);
            t.validate({
                errorElement: "div",
                errorPlacement: function (error, element) {
                    var $dv = $(element).closest("div.form-group");
                    $dv.find("div.alert").remove();
                    if ($(error).text() != "") { $dv.append($(error).addClass("alert").css("display", "block")); }
                },
                success: function (label, element) {
                    $(element).closest("div.form-group").find("div.alert").remove();
                }
            });
            return t;
        },
        /*form元件轉object*/
        "serializeobject": function () {
            var o = {};
            $(this).find("[name]").each(function (i) {
                var ths = $(this);
                if (ths.is(":checkbox, :radio")) { $(o).prop(this.name, $ths.is(":checked")); }
                else if (ths.is(":input")) { $(o).prop(this.name, ths.val()); }
                else if (ths.is("select")) { $(o).prop(this.name, ths.find(':selected').val()); }
            });
            return o;
        },
    });
})(jQuery);

/*validator中文*/
$.extend($.validator.messages, {
    required: "必填!!!",
    remote: "資料格式錯誤!!!",
    email: "電子郵件格式錯誤!!!",
    url: "網址格式錯誤!!!",
    date: "日期格式錯誤!!!",
    dateISO: "日期(ISO)格式錯誤!!!",
    number: "請輸入數字!!!",
    digits: "請輸入整數!!!",
    creditcard: "信用卡號格式錯誤!!!",
    equalTo: "輸入資料不相同，請重複再輸入一次!!!",
    accept: "請輸入有效的後綴字串!!!",
    maxlength: jQuery.validator.format("需小於 {0} 字元的資料內容!!!"),
    minlength: jQuery.validator.format("需大於 {0} 字元的資料內容!!!"),
    rangelength: jQuery.validator.format("請輸入長度介於 {0} 的資料內容!!!"),
    range: jQuery.validator.format("需介於 {0} 與 {1} 之間!!!"),
    max: jQuery.validator.format("需小於 {0} !!!"),
    min: jQuery.validator.format("需大於 {0} !!!")
});
$.validator.addMethod("endate", function (value, element) {
    var str = $.trim(value).replace(/-|\//g, "");
    return /([0-9]{4})((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))/.test(str) && Date.parse(str);
}, "IX0019：日期格式錯誤!!!");
$.validator.addMethod("ennum", function (value, element) { return this.optional(element) || /^[0-9]+$/.test(value); },
    "IX0021：請輸入數字!!!");
$.validator.addMethod("enstring", function (value, element) { return this.optional(element) || /^[A-Za-z0-9]+$/.test(value); },
    "IX0021：請輸入英文字母或數字!!!");
$.validator.addMethod("ennumstring", function (value, element) { return this.optional(element) || /^(\d*\D*)/.test(value); },
    "IX0022：請輸入英文字母或數字!!!");
$.validator.addMethod("enselected", function (value, element) { return $.trim($(element).find(":selected").val()) != ""; },
    "IX0023：請選擇資料!!!");

$(window).on("load", function () {
    /*ajax 全域設定*/
    $.ajaxSetup({ "global": true });
    $(document)
        .ajaxStart(function (e) {
            if (iscloseblockui) { iscloseblockui = false; return; }
            $.blockUI({
                cursorReset: "wait",
                message: '<div><img alt="讀取中…" title="讀取中…" src="/Content/images/loading.gif">讀取中…</div>',
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#fff',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .1,
                    color: '#FFF'
                }
            });
        })
        .ajaxStop($.unblockUI)
        .ajaxError(function (event, jqxhr, settings, thrownError) {
            $("#dvbug").text(jqxhr.responseText);
            location.href = "#dverror";
        });
});