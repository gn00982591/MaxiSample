var iscloseblockui = false,
    dialogclose = null,
    dialogclose2 = null;

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
            if (!$.isNumeric(o)) { return ""; }
            var str = $.multiplication(o, 1).toString();
            return str.replace(/\./.test(str) ? (/(\d{1,3})(?=(\d{3})+\.)/g) : (/(\d{1,3})(?=(\d{3})+$)/g), "$1,");
        },
        /*清除元件的val()的空白，並轉大寫*/
        "totrimupper": function (o) { o.val($.trim(o.val()).toUpperCase()); }
    });
    /*by element*/
    $.fn.extend({
        /*dialog open*/
        "dialogopen": function () {
            $(this).dialog({
                autoOpen: true, modal: true, width: "auto", open: function (event, ui) {
                    $(".ui-widget-overlay").css({
                        "opacity": .7,
                        "background-color": "#000"
                    });
                    $(".ui-dialog-titlebar button").css({ "min-width": "10px" });
                    var cl = $(".ui-dialog-titlebar-close span");
                    $(".ui-dialog-titlebar-close").empty().append(cl);
                }
            });
            return $(this);
        },
        /*dialog close*/
        "dialogclose": function () {
            obj = $(this);
            try { obj.dialog("destroy"); } catch (e) { };
            return obj;
        },
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
        /*table設定資料內容*/
        /*
        資料
            data            [], 資料陣列
            hide            [], 隱藏資料
            th                [], 抬頭
                n              string, 表格抬頭文字
                v              string, 資料的屬性名稱
                t               string, 資料格式，或產生形式
                f               function,  資料格式內，對應指定產生形式而綁定執行功能
        Ajax
            u                   string,  網址
            p                   object, 參數
            d                   function, 等同 done
        換頁
            page            object, 換頁設定，如果是 null 表無處理
                len            int, 每頁筆數
                innum      int,所在頁數
        */
        "tabledata": function (obj) {
            var oo = $(this);
            oo.empty();
            oo.addClass("tabledata");
            /*AJAX*/
            function tdone(d) {
                $(obj).prop({ "data": d, "u": null });
                tin();
                if ($.isFunction(obj.d)) { obj.d(d); }
            }
            if (!$.isEmptyObject(obj.u)) {
                if ($.isEmptyObject(obj.p)) { $.post(obj.u).done(function (d) { tdone(d); }); }
                else { $.post(obj.u, obj.p).done(function (d) { tdone(d); }); }
            }
            else { tin(); }
            /*資料構架*/
            function tin() {
                var tb = $("<table/>"), tr = $("<tr/>");
                /*抬頭處理*/
                $(obj.th).each(function (i) { tr.append("<th>" + obj.th[i].n + "</th>"); })
                oo.append(tb.append(tr));                
                if ($.isEmptyObject(obj.data) || obj.data.length <= 0) {
                    /*無資料*/
                    tb.append("<td colspan='" + obj.th.length + "' class='c red'>無資料</td>");
                }
                else if (!$.isEmptyObject(obj.ths)) {
                    /*分群組*/
                }
                else if (!$.isEmptyObject(obj.page)) {
                    /*分頁*/
                }
                else {
                    /*一般處理*/
                    $(obj.data).each(function (i, e) {
                        tr = $("<tr/>");
                        $(obj.th).each(function (ii, ee) { tr.append(settd(i, e, ii, ee, obj)); });
                        oo.append(tb.append(tr));
                    });
                }
            }
            /*td設定*/
            function settd(i, e, ii, ee, ext) {
                var td = $("<td/>");
                /*hidden 放在第一行的資料*/
                if (ii == 0 && ext.hide.length > 0) {                    
                    $(ext.hide).each(function (gi, ge) {
                        td.append($("<input/>", { "value": e[ge], "type": "hidden", "name": ge }));
                    });
                }
                switch (ee.t) {
                    case "num":/*數字加入千分符*/
                        td.css("text-align", "right").append($.tonumonethou(e[ee.v]));
                        break;
                    default:
                        td.append(e[ee.v]);
                        break;
                }
                if (i % 2 == 1) { td.addClass("tds"); }
                return td;
            }
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