var dia = null,
    dia2 = null;

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
        /*跳出訊息*/
        "alert": function (str) { $("#dvdialog").html(str).dialogopen(); },
        /*物件內容轉數字加千分符*/
        "tonumonethou": function (o) {
            if (!$.isNumeric(o)) { return ""; }
            var str = $.multiplication(o, 1).toString();
            return str.replace(/\./.test(str) ? (/(\d{1,3})(?=(\d{3})+\.)/g) : (/(\d{1,3})(?=(\d{3})+$)/g), "$1,");
        }
    });
    /*by element*/
    $.fn.extend({
        /*focusout英文小寫轉大寫*/
        "focusoutupper": function () { return this.each(function () { $(this).focusout(function () { $(this).totrimupper(); }); }); },
        /*清除元件的val()的空白，並轉大寫*/
        "totrimupper": function () { return this.each(function () { var t = $(this); t.totrim(); t.val(t.val().toUpperCase()); }); },
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
            if (this != null) {
                obj = $(this);
                try { obj.dialog("destroy"); } catch (e) { };
                return obj;
            }
        },
        /*設定表單資料*/
        "setfrm": function (obj) {
            var tn = "name";
            if ($(this).is("form")) { $(this)[0].reset(); }
            $(this).find("[" + tn + "]").each(function (i) {
                var ths = $(this);
                var va = obj[ths.attr(tn)];
                if (ths.is(":checkbox")) { ths.prop("checked", va); }
                else if (ths.is(":input,select")) { ths.val(va); }
                else if (ths.is("td,span")) { ths.text(va); }
            });
            return $(this);
        },
        /*select設定選項*/
        "setsel": function (obj) {
            obj.this = $(this).empty();
            function tdone(d) {
                if (!$.isEmptyObject(d)) { obj.data = d; }
                obj.first = "";
                switch (obj.t) {
                    case 1: obj.first = "全部"; break;
                    case 2: obj.first = "請選擇…"; break;
                }
                if (obj.first != "") { obj.this.append("<option value=''>" + obj.first + "</option>"); }
                if (!$.isEmptyObject(d) && d.length > 0) {
                    $(obj.data).each(function (i, e) {
                        if (e.ckey == e.cdesc) { obj.this.append("<option value='" + e.ckey + "'>" + e.cdesc + "</option>"); }
                        else { obj.this.append("<option value='" + e.ckey + "'>" + e.cdesc + "(" + e.ckey + ")</option>"); }
                    });
                }
                obj.this.find("option:eq(0)").attr("selected", "selected");
            }
            /*ajax*/
            if (!$.isEmptyObject(obj.u)) {
                if ($.isNumeric(obj.p)) { $.post(obj.u, { "cseq": obj.p }).done(function (d) { tdone(d); }); }
                else { $.post(obj.u).done(function (d) { tdone(d); }); }
            } else { tdone(); }
            return obj.this;
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
                if (ths.is(":checkbox, :radio")) { $(o).prop(this.name, ths.is(":checked")); }
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
            af                 function, table 產生後的 function
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
                oo.empty();
                /*css*/
                var tb = $("<table/>"), tr = $("<tr/>");
                /*抬頭處理*/
                $(obj.th).each(function (i) { tr.append("<th>" + obj.th[i].n + "</th>"); })
                oo.append(tb.append(tr));
                if (/<[a-z][\s\S]*>/i.test(obj.data)) {
                    /*如果取得 html 時*/
                    tb.append("<td colspan='" + obj.th.length + "' style='text-align:center;'>系統已登出，請重新登入</td>");
                }
                else if ($.isEmptyObject(obj.data) || obj.data.length <= 0) {
                    /*無資料*/
                    tb.append("<td colspan='" + obj.th.length + "' style='text-align:center;'>無資料</td>");
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
                if ($.isFunction(obj.af)) { obj.af(); }
                /*使用alert時，清除不必要的css*/
                oo.parent().removeClass("ui-widget-content");
                oo.removeClass("ui-widget-content");
            }
            /*td設定*/
            var bhashide = !$.isEmptyObject(obj.hide);
            function settd(i, e, ii, ee, ext) {
                var td = $("<td/>");
                /*hidden 放在第一行的資料*/
                if (bhashide) {
                    if (ii == 0 && ext.hide.length > 0) {
                        $(ext.hide).each(function (gi, ge) {
                            td.append($("<input/>", { "value": e[ge], "type": "hidden", "name": ge }));
                        });
                    }
                }
                switch (ee.t) {
                    case "btn":/*按鍵*/
                        var btn = $("<button/>", { "type": "button" })
                            .click(function () {
                                if ($.isFunction(ee.f)) { ee.f(e, btn); }
                                if (dia != null) { dia.setfrm(e).dialogopen(); }
                            });
                        btn.text(ee.n);
                        td.css("text-align", "center").append(btn);
                        break;
                    case "num":/*數字加入千分符*/
                        td.css("text-align", "right").append($.tonumonethou(e[ee.v]));
                        break;
                    case "num-rg":/*數字加入千分符*/
                        var v = $.tonumone(e[ee.v]);
                        td.css({
                            "text-align": "right",
                            "font-weight": "bolder",
                            "color": (v >= 0 ? "#f93636" : "#1ed076")
                        })
                            .append($.tonumonethou(v));
                        break;
                    case "btn-del":/*按鍵，針對單筆刪除設計*/
                        var btn = $("<button/>")
                            .click(function () {
                                var str = "dvdelpop";
                                $("#" + str).remove();
                                var tabledata = $("<div/>");
                                tabledata.tabledata({
                                    "th": $.grep(obj.th, function (a) { return $.inArray(a.t, ["btn", "btn-del"]) < 0; }),
                                    "data": [e]
                                })
                                var dv = $("<div/>", { "id": str, "class": "none tabledata", "title": "刪除確認." })
                                    .append("資料一旦刪除便無法回復。", "是否確定刪除？")
                                    .append(tabledata)
                                    .append($("<div/>", { "class": "c" }).append($("<button/>").append("確定").click(function () {
                                        if (!$.isEmptyObject(ee.u) && !$.isEmptyObject(ee.p)) {
                                            var eepost = {};
                                            for (var pp in ee.p) { $(eepost).prop(ee.p[pp], e[ee.p[pp]]); }
                                            $.post(ee.u, eepost).done(function (q) {
                                                if (!$.isEmptyObject(q)) { $.alert(q.msg); }
                                                dv.dialogclose().remove();
                                                if ($.isFunction(ee.f)) { ee.f(e); }
                                            });
                                        }
                                    }))
                                        .append($("<button/>").append("取消").click(function () { dv.dialogclose(); $("#" + str).remove(); }))
                                    );
                                $(document.body).append(dv);
                                dv.dialogopen();
                            });
                        btn.text(ee.n);
                        td.append(btn);
                        break;
                    default:
                        var val = e[ee.v];
                        if (!$.isEmptyObject(val) && val.length == 1) { td.css("text-align", "center") }
                        td.append(val);
                        break;
                }
                /*換行換色*/
                if (i % 2 == 1) { td.addClass("tds"); }
                return td;
            }
        },
    });
})(jQuery);

/*validator中文*/
$.extend($.validator.messages, {
    required: "VI01：必填!!!",
    remote: "VI02：資料格式錯誤!!!",
    email: "VI03：電子郵件格式錯誤!!!",
    url: "VI04：網址格式錯誤!!!",
    date: "VI05：日期格式錯誤!!!",
    dateISO: "VI06：日期(ISO)格式錯誤!!!",
    number: "VI07：請輸入數字!!!",
    digits: "VI08：請輸入整數!!!",
    creditcard: "VI09：信用卡號格式錯誤!!!",
    equalTo: "VI10：輸入資料不相同，請重複再輸入一次!!!",
    accept: "VI11：請輸入有效的後綴字串!!!",
    maxlength: jQuery.validator.format("VI12：需小於 {0} 字元的資料內容!!!"),
    minlength: jQuery.validator.format("VI13：需大於 {0} 字元的資料內容!!!"),
    rangelength: jQuery.validator.format("VI14：請輸入長度介於 {0} 的資料內容!!!"),
    range: jQuery.validator.format("VI15：需介於 {0} 與 {1} 之間!!!"),
    max: jQuery.validator.format("VI16：需小於 {0} !!!"),
    min: jQuery.validator.format("VI17：需大於 {0} !!!")
});
$.validator.addMethod("endate", function (value, element) {
    var str = $.trim(value).replace(/-|\//g, "");
    return /*/([0-9]{4})((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))/.test(str) &&*/ Date.parse($.trim(value));
}, "VX01：日期格式錯誤!!!!");
$.validator.addMethod("ennum", function (value, element) { return this.optional(element) || /^[0-9]+$/.test(value); },
    "VX02：請輸入數字!!!!");
$.validator.addMethod("enstring", function (value, element) { return this.optional(element) || /^[A-Za-z0-9]+$/.test(value); },
    "VX03：請輸入英文字母或數字!!!!");
$.validator.addMethod("ennumstring", function (value, element) { return this.optional(element) || /^(\d*\D*)/.test(value); },
    "VX04：請輸入英文字母或數字!!!!");
$.validator.addMethod("enselected", function (value, element) { return $.trim($(element).find(":selected").val()) != ""; },
    "VX05：請選擇資料!!!!");

$(window).on("load", function () {
    /*ajax 全域設定*/
    $.ajaxSetup({ "global": true });
    $(document)
        .ajaxStart(function (e) {
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