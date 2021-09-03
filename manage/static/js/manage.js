var slideflag = 0;
var textflag = 0;
var picflag = 0;
var firstid = 0;
var now_proid = -1;
var now_buildid = -1;
var zipflag = 0;
var verflag = 0;
var selectflag = 0;
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const { Menu, MenuItem } = remote;
var AdmZip = require('adm-zip');
var fs = require("fs");
//const os = require("os");
var picdo = require("./moudles/picdo");
const { now } = require('jquery');
const prompt = require('electron-prompt');
const { resolve } = require('path');
const { app } = require('electron');
if (process.platform === 'darwin') {
    const isMac = process.platform === 'darwin'

    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: remote.app.name,
            submenu: [
                {
                    label: convert_dymstrlist_to_string('设置', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=setting]').click();
                    }
                },
                {
                    label: convert_dymstrlist_to_string_with_mod('Language', get_lang_now(), 'main.html'),
                    click: async () => {
                        ipcRenderer.send('openlangsetting','')
                    }
                },
                {
                    label: convert_dymstrlist_to_string_with_mod('关于', get_lang_now(), 'main.html') + " BetaWorld Library",
                    click: async () => {
                        ipcRenderer.send('openabout','')
                    }
                },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: convert_dymstrlist_to_string('操作', get_lang_now()),
            submenu: [
                {
                    label: convert_dymstrlist_to_string('新建项目', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=new]').click();
                    }
                },
                {
                    label: convert_dymstrlist_to_string('以此为模板创建项目', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=copycat]').click();
                    }
                },
                {
                    label: convert_dymstrlist_to_string('保存更改', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=save]').click();
                    }
                },
                {
                    label: convert_dymstrlist_to_string('删除此Build', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=delete]').click();
                    }
                },
                {
                    label: convert_dymstrlist_to_string('放弃更改', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=ignore]').click();
                    }
                },
                {
                    label: convert_dymstrlist_to_string('刷新', get_lang_now()),
                    click: async () => {
                        $('.nav_right_btn .nav_btn[data-do=refresh]').click();
                    }
                }
            ]
          }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
} else {
    Menu.setApplicationMenu(null);
}
function get_build_info(proid, buildid) {
    console.log([proid, buildid])
    console.log("clearD" + selectflag);
    if (now_proid != proid) {
        selectflag = 1;
        ipcRenderer.send('getbuildstageA', proid);
    }
    console.log("clearC" + selectflag);
    now_proid = proid;
    now_buildid = buildid;
    ipcRenderer.send('getbuildinfo', [proid, buildid]);
}
function getpar_height(sel) {
    var w = 0;
    $(sel).each(function () {
        w = w + parseInt($(this).height());//获取宽度。并累加
    });
    return w;
}
function loadpic(buildid, picid) {
    zip = new AdmZip(join_path("gallery/" + buildid + ".zip"));
    //设置主图
    var info = zip.readAsText("pic.json");
    console.log(info);
    s = JSON.parse(info);
    console.log(s);

    console.log(s.screenshot[picid].screenshothash);
    var decompressedData = zip.readFile(s.screenshot[picid].screenshothash + ".png");
    zip = null;
    return decompressedData;

    zip = null;
}
function showpic(buildid, picid) {
    var decompressedData = loadpic(buildid, picid);
    s1 = "url(data:image/png;base64," + decompressedData.toString('base64') + ')';
    s2 = s.screenshot[picid].screenshottitle;
    $('#main_pic').css('background-image', s1);
}
function dateFtt(fmt, date) { //author: meizz   
    var date = new Date(date);
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function ifzipfileexist(zip, entryname) {
    console.log(entryname);
    if (zipflag != 0) { return -1; }
    try {
        var decompressedData = zip.readFile(entryname);
        return 1;
    } catch {
        return -1;
    }
}
function movelist(selector, flag) {
    if ($(selector).children("option:selected").prev().length == 0 && flag == true) {
        if (os.platform == "win32") {
            remote.dialog.showMessageBoxSync({
                type: 'info',
                title: convert_dymstrlist_to_string('提示', get_lang_now()),
                message: convert_dymstrlist_to_string('你不能再往上移动', get_lang_now())
            });
        } else {
            remote.dialog.showMessageBoxSync({
                type: 'info',
                title: convert_dymstrlist_to_string('提示', get_lang_now()),
                message: convert_dymstrlist_to_string('你不能再往上移动', get_lang_now()),
                buttons: ['OK']
            });
        }
        //alert('你不能再往上移动');
        return -1;
    }
    if ($(selector).children("option:selected").next().length == 0 && flag == false) {
        if (os.platform == "win32") {
            remote.dialog.showMessageBoxSync({
                type: 'info',
                title: convert_dymstrlist_to_string('提示', get_lang_now()),
                message: convert_dymstrlist_to_string('你不能再往下移动', get_lang_now())
            });
        } else {
            remote.dialog.showMessageBoxSync({
                type: 'info',
                title: convert_dymstrlist_to_string('提示', get_lang_now()),
                message: convert_dymstrlist_to_string('你不能再往下移动', get_lang_now()),
                buttons: ['OK']
            });
        }
        //alert('你不能再往下移动');
        return -1;
    }
    a = $(selector).find("option:selected").prop("outerHTML");
    $(selector).find("option:selected").attr('remove', 1);
    //$(selector).find("option:selected").remove();
    if (flag == true) {
        $(selector).children("option:selected").prev().before(a);
    } else {
        $(selector).children("option:selected").next().after(a);
    }
    $(selector).find("option:selected[remove=1]").remove();
}
$(window).ready(function () {
    //get_all_html_element();
    change_static_element(get_lang_now());
    /*
    $("<link>")
                .attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: "../static/css/bwdb_light.css"
    })
    .appendTo("head");
    */
    now_height = document.documentElement.clientHeight - 55;
    now_width = document.documentElement.clientWidth - 355;
    $('.bwdb_sidebar').css('max-height', now_height);
    $('.bwdb_sidebar').css('height', now_height);
    $('.bwdb_infobox').css('max-height', now_height);
    $('.bwdb_infobox').css('height', now_height);
    if ($('.bw_sidebar_info_box').css('display') == 'none') {
        $('.bwdb_sidebarA').css('max-height', now_height);
        $('.bwdb_sidebarA').css('height', now_height);
    } else {
        $('.bwdb_sidebarA').css('max-height', now_height - $('.bw_sidebar_info_box').height);
        $('.bwdb_sidebarA').css('height', now_height - $('.bw_sidebar_info_box').height);
    }
    if (getpar_height('.bwdb_sidebarA') > $('.bwdb_sidebarA').css('max-height')) {
        $('.bwdb_sidebarA').css('overflow-y', 'scroll');
    } else {
        $('.bwdb_sidebarA').css('overflow-y', 'auto');
    }
    console.log(document.documentElement.clientWidth);
    $('.edit_select').editableSelect({ effects: "fade", filter: false });
    ipcRenderer.send('getsyslist', 'ping');
});
$(window).resize(function () {
    now_height = document.documentElement.clientHeight - 55;
    now_width = document.documentElement.clientWidth - 355;
    $('.bwdb_sidebar').css('max-height', now_height);
    $('.bwdb_sidebar').css('height', now_height);
    $('.bwdb_infobox').css('max-height', now_height);
    $('.bwdb_infobox').css('height', now_height);
    if ($('.bw_sidebar_info_box').css('display') == 'none') {
        $('.bwdb_sidebarA').css('max-height', now_height);
        $('.bwdb_sidebarA').css('height', now_height);
    } else {
        $('.bwdb_sidebarA').css('max-height', now_height - $('.bw_sidebar_info_box').height);
        $('.bwdb_sidebarA').css('height', now_height - $('.bw_sidebar_info_box').height);
    }
    if (getpar_height('.bwdb_sidebarA') > $('.bwdb_sidebarA').css('max-height')) {
        $('.bwdb_sidebarA').css('overflow-y', 'scroll');
    } else {
        $('.bwdb_sidebarA').css('overflow-y', 'auto');
    }
    console.log(document.documentElement.clientWidth);
});
$(document).on('click', '.bwdb_select_item', function () {
    console.log($(this).html());
    $(".search_box_title").html($(this).html());
    $(".search_box_title").attr('data-id', $(this).attr('data-id'));
    $(".search_box_title").attr('data-id-codename', $(this).attr('data-id-codename'));
    console.log($(this).attr('data-id'));
    now_buildid = -1;
    now_proid = -1;
    ipcRenderer.send('getbuildstage', $(this).attr('data-id'));
    if (slideflag == 1) {
        $("#bwdb_nav_select_bar").hide();
        slideflag = 0;
    }
    if ($("#homeinfobox").css('display') != 'none') {
        $("#verinfobox").show();
        $("#homeinfobox").hide();
    }
    $('.bwdb_sidebarA').scrollTop(0 - $('.bwdb_sidebarA').scrollTop);
});
$(".bwdb_content").click(function () {
    if (slideflag == 1) {
        $("#bwdb_nav_select_bar").slideUp('100ms');
        slideflag = 0;
    }
});
$(document).on('mouseenter', '.big_stage_item', function () {
    $(this).children('.big_stage_text').css('background-color', '#d4e2ee');
});
//$(".big_stage_item").mouseleave(function(){
$(document).on('mouseleave', '.big_stage_item', function () {
    $(this).children('.big_stage_text').css('background-color', '#ececec');
});

//$(".bwdb_sidebar_item").click(function(){
$(document).on('click', '.bwdb_sidebar_item', function () {
    verflag = 1;
    $('.bwdb_sidebar_item').css('background-color', 'unset');
    $('.bwdb_sidebar_item').css('color', 'unset');
    if(remote.nativeTheme.shouldUseDarkColors){
        $(this).css('background-color', '#37373D');
    }else{
        $(this).css('background-color', '#19478a');
    }
    $(this).css('color', '#fff');
    $('.bwdb_infobox_textarea').hide();
    $('.info_box_items_btn_text').attr('class', 'info_box_items_btn_text');
    console.log($(this).attr('data-id'));
    if ($('.bw_sidebar_info_box').css('display') == 'none') {
        get_build_info($('.search_box_title').attr('data-id'), $(this).attr('data-id'));
    } else {
        console.log($(this).attr('data-id-proid'));
        get_build_info($(this).attr('data-id-proid'), $(this).attr('data-id'));
    }
    if ($("#homeinfobox").css('display') != 'none') {
        $("#verinfobox").show();
        $("#homeinfobox").hide();
    }

});
$(document).keydown(function (event) {
    var keyNum = event.which;  //获取键值
    console.log(keyNum);
    console.log("now:" + document.activeElement.type);
    if (document.activeElement.type == "text" || document.activeElement.type == "input" || document.activeElement.type == "date" || document.activeElement.type == "textarea" || document.activeElement.type == "select-multiple") {
        return -1;
    }
    switch (keyNum) { //判断按键
        case 38:
            //alert('a');
            //先判断相同层级的
            previd = -1;
            if ($('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').prev().length == 0) {
                //接着判断上一个层级 
                if ($('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').parent('.build_list').prev().prev().length == 0) {
                    //到顶了
                    if (os.platform == "win32") {
                        remote.dialog.showMessageBoxSync({
                            type: 'info',
                            title: convert_dymstrlist_to_string('提示', get_lang_now()),
                            message: convert_dymstrlist_to_string('你不能再往上移动', get_lang_now())
                        });
                    } else {
                        remote.dialog.showMessageBoxSync({
                            type: 'info',
                            title: convert_dymstrlist_to_string('提示', get_lang_now()),
                            message: convert_dymstrlist_to_string('你不能再往上移动', get_lang_now()),
                            buttons: ['OK']
                        });
                    }
                    return -1;
                } else {
                    if ($('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').parent('.build_list').prev().prev().children('div:last').length != 0) {
                        previd = $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').parent('.build_list').prev().prev().children('div:last').attr('data-id');
                    }
                }
            } else {
                previd = $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').prev().attr('data-id');
            }
            console.log(previd);
            $('.bwdb_sidebar_item[data-id="' + previd + '"]').click();
            break;
        case 40:
            //alert('b');
            nextid = -1;
            if ($('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').next().length == 0) {
                if ($('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').parent('.build_list').next().next().length == 0) {
                    if (os.platform == "win32") {
                        remote.dialog.showMessageBoxSync({
                            type: 'info',
                            title: convert_dymstrlist_to_string('提示', get_lang_now()),
                            message: convert_dymstrlist_to_string('你不能再往下移动', get_lang_now())
                        });
                    } else {
                        remote.dialog.showMessageBoxSync({
                            type: 'info',
                            title: convert_dymstrlist_to_string('提示', get_lang_now()),
                            message: convert_dymstrlist_to_string('你不能再往下移动', get_lang_now()),
                            buttons: ['OK']
                        });
                    }
                    return -1;
                } else {
                    if ($('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').parent('.build_list').next().next().children('div:first').length != 0) {
                        nextid = $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').parent('.build_list').next().next().children('div:first').attr('data-id');
                    }
                }
            } else {
                nextid = $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').next().attr('data-id');
            }
            console.log(nextid);
            $('.bwdb_sidebar_item[data-id="' + nextid + '"]').click();
            break;
        default:
            break;
    }
});
$(document).on('keypress', '.bwdb_nav_search_text', function (e) {
    if (e.keyCode == 13) {
        console.log($(this).val());
        ipcRenderer.send('searchbuildlist', $(this).val());
    }
});
function slide_select() {
    if (slideflag == 0) {
        $("#bwdb_nav_select_bar").slideDown('100ms');
        slideflag = 1;
    } else {
        $("#bwdb_nav_select_bar").slideUp('100ms');
        slideflag = 0;
    }
}
function show_search_textbox() {
    if (slideflag == 1) {
        $("#bwdb_nav_select_bar").slideUp('100ms');
        slideflag = 0;
    }
    if (textflag == 0) {
        $('.search_btn').css('border', '#fff 2px solid');
        $('.bwdb_nav_search_text').val('');
        $(".bwdb_nav_search").show();
        $(".bw_sidebar_info_box").html(convert_dymstrlist_to_string('按回车键开始搜索', get_lang_now()) + '<br>' + convert_dymstrlist_to_string('单击放大镜按钮以关闭搜索工具。', get_lang_now()))
        $(".bw_sidebar_info_box").show();
        $('.bwdb_nav_search_text').focus();
        $(".bwdb_sidebarA").hide();
        verflag = 1;
        textflag = 1;
    } else {
        $('.search_btn').css('border', 'unset');
        $(".bwdb_nav_search").hide();
        $(".bw_sidebar_info_box").hide();
        $(".bwdb_sidebarA").show();
        if ($(".bw_sidebar_info_box").html().indexOf(convert_dymstrlist_to_string('按回车键开始搜索', get_lang_now())) == -1) {
            $(".search_box_title").html($(".bwdb_select_item[data-id='" + now_proid + "']").html());
            $(".search_box_title").attr('data-id', $(".bwdb_select_item[data-id='" + now_proid + "']").attr('data-id'));
            $(".search_box_title").attr('data-id-codename', $(".bwdb_select_item[data-id='" + now_proid + "']").attr('data-id-codename'));
            verflag = 0;
            ipcRenderer.send('getbuildstage', now_proid);
        }
        textflag = 0;
    }
}
function save_build() {
    //info
    buildid = now_buildid
    if (buildid == -1) {
        buildid = -1;
    }
    proid = $('#productname').next('.es-list').children('[value="' + $('#productname').val().replace(/\"/g,"\\\"") + '"]').attr('data-proid');
    productname = $('#productname').val();
    //如果没有该产品 那就设置为-1
    if (proid == undefined) {
        proid = -1;
    }
    /*
    $("#stage").val(s[0][1]);
    $("#vername").val(s[0][2]);
    $("#buildtag").val(s[0][6]);
    $("#biosdate").attr('value', dateFtt('yyyy-MM-dd', s[0][7]));
    $("#arch").val(s[0][3]);
    $("#CodeName").val(s[0][11]);
    $("#SerialNumber").val(s[0][8]);
    $("#SKU").html(s[0][4]);
    $("#LANG").html(s[0][5]);
    $("#FixCN").html(s[0][9]);
    $("#FixEN").html(s[0][10]);
    */
    stage = $("#stage").val();
    vername = $("#vername").val();
    buildtag = $("#buildtag").val();
    biosdate = dateFtt('yyyy/MM/dd', $("#biosdate").val());
    arch = $("#arch").val();
    codename = $("#CodeName").val();
    if (codename == "" || codename == "N/A") {
        codename = $('#codename').next('.es-list').children().html();
        if (codename == undefined) {
            codename = "";
        }
        if (codename != "" && codename != "N/A") {
            $("#CodeName").editableSelect('add', codename, 0, ['value', codename]);
        }

        console.log(codename);
    }
    serialnum = $("#SerialNumber").val()
    SKUa = $("#SKU").val();
    lang = $("#LANG").val();
    fixc = $("#FixCN").val();
    fixe = $("#FixEN").val();
    s = [proid, buildid, vername, stage, buildtag, arch, biosdate, serialnum, SKUa, lang, fixc, fixe, codename, productname];
    console.log(s);
    ipcRenderer.send('editbuild', s);
}
function write_picjson() {
    var s = [];
    var i = 0;
    var main_pic = -1;
    $('#screenshotlist').children('option').each(function () {
        var s1 = {
            "screenshotid": i,
            "screenshothash": $(this).attr('data-pic-hash'),
            "screenshottitle": $(this).html(),
            "parentid": now_buildid
        };
        s.push(s1);
        t = $(this).html();
        if (t.toLowerCase() == "version" || (t.toLowerCase() == "interface 1" && main_pic == -1)) {
            main_pic = i;
        }
        i = i + 1;
    });
    if (main_pic == -1) {
        main_pic = 0;
    }
    var j = {
        "productid": now_proid,
        "buildid": now_buildid,
        "main_pic": main_pic,
        "screenshot": s
    };
    return (j);
}
function make_screen_zip(buildid) {
    var picjson = JSON.stringify(write_picjson());
    var zip_new = new AdmZip();
    $('#screenshotlist').children('option').each(function () {
        if ($(this).attr('data-pic') == '-1') {
            //新图
            var s = $(this).attr('data-pic-base64');
            var d = new Buffer(s, 'base64');
        } else {
            //老图
            var d = loadpic(now_buildid, $(this).attr('data-pic'));
        }
        zip_new.addFile($(this).attr('data-pic-hash') + ".png", d, $(this).attr('data-pic-hash') + ".png");
    });
    zip_new.addFile("pic.json", Buffer.alloc(picjson.length, picjson), "pic.json");
    zip_new.writeZip(join_path("gallery/" + buildid + ".zip"));
    zip_new = null;
}
ipcRenderer.on('syslist', function (event, arg) {
    console.log(arg);
    var s = JSON.parse(arg);
    $('#bwdb_nav_select_bar').html('');
    for (var i = 0; i < s.length; i++) {
        console.log(s[i]);
        var s1 = s[i][1];
        s1 = s1.replace('\"', '&quot');
        $("#bwdb_nav_select_bar").append('<div class="bwdb_select_item"' + 'data-id="' + s[i][0] + '" data-id-codename="' + s[i][2] + '">' + s1 + '</div>');
    };
    //默认配置
    $('.search_box_title').attr('data-id-codename', $(".bwdb_select_item[data-id='1']").attr('data-id-codename'));
    $('.search_box_title').attr('data-id', '1');
    $('.search_box_title').html(s[0][1]);
    ipcRenderer.send('getbuildstage', 1);
    get_build_info(1, 1);

});
ipcRenderer.on('syslistA', function (event, arg) {
    console.log(arg);
    var s = JSON.parse(arg);
    $('#bwdb_nav_select_bar').html('');
    for (var i = 0; i < s.length; i++) {
        console.log(s[i]);
        var s1 = s[i][1];
        s1 = s1.replace('\"', '&quot');
        $("#bwdb_nav_select_bar").append('<div class="bwdb_select_item"' + 'data-id="' + s[i][0] + '" data-id-codename="' + s[i][2] + '">' + s1 + '</div>');
    };

    if ($('.bw_sidebar_info_box').css('display') == 'none') {
        var x = $('.bwdb_select_item[data-id="' + now_proid + '"]').attr('data-id-codename');
        var y = $('.bwdb_select_item[data-id="' + now_proid + '"]').html();
    } else {
        var x = $('.bwdb_select_item[data-id="' + now_proid + '"]').attr('data-id-codename');
        var y = $('.bwdb_select_item[data-id="' + now_proid + '"]').html();
    }
    $('.search_box_title').attr('data-id-codename', x);
    $("#CodeName").editableSelect('clear');
    x1 = x.split(",");
    //console.log(x1);
    for (let i = 0; i < x1.length; i++) {
        $("#CodeName").editableSelect('add', x1[i], i, ['value', x1[i]]);
    }


});
ipcRenderer.on('stagelist', function (event, arg) {
    console.log(arg);
    console.log($('.search_box_title').attr('data-id'));
    var s = JSON.parse(arg[1]);
    $('.bwdb_sidebarA').html('');
    for (var i = 0; i < s.length; i++) {
        console.log(s[i]);
        if (s[i].length > 30) {
            var s1 = s[i].substring(0, 30) + '...'
        } else {
            var s1 = s[i]
        }
        $(".bwdb_sidebarA").append('<div class="big_stage_divider non_search"><div class="big_stage_item"><span class="big_stage_text" title="' + s[i] + '">' + s1 + '</span></div></div><div class="build_list" data-id="' + s[i] + '" data-type="build_stage" >');
        ipcRenderer.send('getbuildlist', [arg[0], s[i]]);
    };
    ipcRenderer.send('show-win', 'win');
    //添加相关的代码
});
ipcRenderer.on('stagelistA', function (event, arg) {
    var s = JSON.parse(arg[1]);
    $("#stage").editableSelect('clear');
    for (var i = 0; i < s.length; i++) {
        $("#stage").editableSelect('add', s[i], i, ['value', s[i]]);
    };
});
ipcRenderer.on('buildlist', function (event, arg) {
    console.log(arg);
    console.log($('.search_box_title').attr('data-id'));
    var s = JSON.parse(arg[2]);
    $("[data-type='build_stage'][data-id='" + arg[1] + "']").html('');
    for (var i = 0; i < s.length; i++) {
        console.log(s[i]);
        $("[data-type='build_stage'][data-id='" + arg[1] + "']").append('<div class="sidebar_ver bwdb_sidebar_item" data-id="' + s[i][0] + '" data-type="build_item">' + s[i][1] + '</div>');
    };
    //添加相关的代码
    //alert(s[s.length-1][0]);
    if (firstid != $(".bwdb_sidebarA").children(".build_list:first").children(".bwdb_sidebar_item:first").attr('data-id') && now_proid == -1) {
        get_build_info(arg[0], $(".bwdb_sidebarA").children(".build_list:first").children(".bwdb_sidebar_item:first").attr('data-id'));
    }
    if (now_buildid > 0 && $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').length > 0) {
        if ($("#homeinfobox").css('display') == 'none') {
            if(remote.nativeTheme.shouldUseDarkColors){
                $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').css('background-color', '#37373D');
            }else{
                $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').css('background-color', '#19478a');
            }
            $('.bwdb_sidebar_item[data-id="' + now_buildid + '"]').css('color', '#fff');
        }
        get_build_info(now_proid, now_buildid);
        //$('.bwdb_sidebar').scrollTop(0);
    }
    if (getpar_height('.bwdb_sidebarA') > $('.bwdb_sidebarA').css('max-height')) {
        $('.bwdb_sidebarA').css('overflow-y', 'scroll');
    } else {
        $('.bwdb_sidebarA').css('overflow-y', 'auto');
    }
});
ipcRenderer.on('searchlist', function (event, arg) {
    console.log(arg);
    var s = JSON.parse(arg[1]);
    console.log(s);
    $('.bwdb_sidebarA').html('');
    for (var i = 0; i < s.length; i++) {
        var proid = s[i][1];
        var proname = $('.bwdb_select_item[data-id="' + proid + '"]').html()
        var buildid = s[i][0];
        var buildver = s[i][3];
        if ($(".bwdb_sidebarA").children('.build_list[data-id="' + proname + '"]').length == 0) {
            if (proname.length > 30) {
                var s1 = proname.substring(0, 30) + '...';
            } else {
                var s1 = proname;
            }
            $(".bwdb_sidebarA").append('<div class="big_stage_divider"><div class="big_stage_item"><span class="big_stage_text" title="' + proname + '">' + s1 + '</span></div></div><div class="build_list" data-id="' + proname + '" data-type="build_stage" >');
        }
        $("[data-type='build_stage'][data-id='" + proname + "']").append('<div class="sidebar_ver bwdb_sidebar_item" data-id="' + buildid + '" data-id-proid="' + proid + '" data-type="build_item">' + buildver + '</div>');
    }
    $(".bw_sidebar_info_box").html(convert_dymstrlist_to_string_include_array('共找到%1项。', get_lang_now(), [s.length]));
    $(".bw_sidebar_info_box").show();
    $(".bwdb_sidebarA").show();
    if (getpar_height('.bwdb_sidebarA') > $('.bwdb_sidebarA').css('max-height')) {
        $('.bwdb_sidebarA').css('overflow-y', 'scroll');
    } else {
        $('.bwdb_sidebarA').css('overflow-y', 'auto');
    }
    $('.bwdb_sidebarA').scrollTop(0 - $('.bwdb_sidebarA').scrollTop);
});
ipcRenderer.on('newbuildid', function (event, arg) {
    console.log(arg);
    now_proid = arg[0];
    now_buildid = arg[1];
    if($("#screenshotlist").html()!=""){
        make_screen_zip(now_buildid);
    }
    //remote.dialog.showMessageBoxSync();
    if (os.platform == "win32") {
        remote.dialog.showMessageBoxSync({
            type: 'info',
            title: convert_dymstrlist_to_string('修改数据成功', get_lang_now()),
            message: convert_dymstrlist_to_string('修改数据成功', get_lang_now())
        });
    } else {
        remote.dialog.showMessageBoxSync({
            type: 'info',
            title: convert_dymstrlist_to_string('修改数据成功', get_lang_now()),
            message: convert_dymstrlist_to_string('修改数据成功', get_lang_now()),
            buttons: ['OK']
        });
    }
    //alert('修改成功');
    if ($('.bw_sidebar_info_box').css('display') == 'none') {
        $(".search_box_title").html($(".bwdb_select_item[data-id='" + now_proid + "']").html());
        $(".search_box_title").attr('data-id', $(".bwdb_select_item[data-id='" + now_proid + "']").attr('data-id'));
        $(".search_box_title").attr('data-id-codename', $(".bwdb_select_item[data-id='" + now_proid + "']").attr('data-id-codename'));
        verflag = 0;
        ipcRenderer.send('getsyslistA', 'ping');
        ipcRenderer.send('getbuildstage', now_proid);
        get_build_info(now_proid, now_buildid);
    }
});
ipcRenderer.on('delbuildid', function (event, arg) {
    console.log(arg);
    now_proid = arg[0];
    now_buildid = arg[1];
    //remote.dialog.showMessageBoxSync();
    if (os.platform == "win32") {
        remote.dialog.showMessageBoxSync({
            type: 'info',
            title: convert_dymstrlist_to_string('删除Build成功', get_lang_now()),
            message: convert_dymstrlist_to_string('删除Build成功', get_lang_now())
        });
    } else {
        remote.dialog.showMessageBoxSync({
            type: 'info',
            title: convert_dymstrlist_to_string('删除Build成功', get_lang_now()),
            message: convert_dymstrlist_to_string('删除Build成功', get_lang_now()),
            buttons: ['OK']
        });
    }
    //alert('修改成功');
    $(".search_box_title").html($(".bwdb_select_item[data-id='" + now_proid + "']").html());
    $(".search_box_title").attr('data-id', $(".bwdb_select_item[data-id='" + now_proid + "']").attr('data-id'));
    $(".search_box_title").attr('data-id-codename', $(".bwdb_select_item[data-id='" + now_proid + "']").attr('data-id-codename'));
    verflag = 0;
    ipcRenderer.send('getsyslistA', 'ping');
    ipcRenderer.send('getbuildstage', now_proid);
    get_build_info(now_proid, now_buildid);
});
ipcRenderer.on('buildinfo', function (event, arg) {
    console.log(arg);
    console.log($('.search_box_title').attr('data-id'));
    var s = JSON.parse(arg[2]);
    console.log(s);
    console.log(s[0][2]);
    $('.title_bar').html('Now BuildID:' + now_buildid);
    //$("#ver_name").text(s[0][2]);
    var arrlist = ['ver_archlist', 'ver_verlist', 'ver_langlist', 'ver_tag', 'install_bios_date', 'install_sn', 'install_notice', 'install_notice_en', 'Codename'];
    if ($('.bw_sidebar_info_box').css('display') == 'none') {
        var x = $('.search_box_title').attr('data-id-codename');
        var y = $('.search_box_title').html();
    } else {
        var x = $('.bwdb_select_item[data-id="' + arg[0] + '"]').attr('data-id-codename');
        var y = $('.bwdb_select_item[data-id="' + arg[0] + '"]').html();
    }

    if (selectflag == 1) {
        console.log('clear');
        $("#productname").editableSelect('clear');
        let i = 0;
        $('.bwdb_select_item').each(function (index) {
            //console.log($(this).html());
            $("#productname").editableSelect('add', $(this).html(), i, [{ name: 'value', value: $(this).html() }, { name: 'data-proid', value: $(this).attr('data-id') }]);
            i = i + 1;
        });
    }

    $("#productname").val(y);
    $("#stage").val(s[0][1]);
    $("#vername").val(s[0][2]);
    $("#buildtag").val(s[0][6]);
    $("#biosdate").val(dateFtt('yyyy-MM-dd', s[0][7]));
    $("#biosdate").attr('value', dateFtt('yyyy-MM-dd', s[0][7]));
    $("#arch").val(s[0][3]);


    if (selectflag == 1) {
        console.log('clearB');
        $("#CodeName").editableSelect('clear');
        x1 = x.split(",");
        //console.log(x1);
        for (let i = 0; i < x1.length; i++) {
            $("#CodeName").editableSelect('add', x1[i], i, ['value', x1[i]]);
        }
        selectflag = 0;
    }
    //alert(s[0][11]);
    $("#CodeName").val(s[0][11]);
    $("#SerialNumber").val(s[0][8]);
    $("#SKU").val(s[0][4]);
    $("#LANG").val(s[0][5]);
    //alert(s[0][9]);
    $("#FixCN").val(s[0][9]);
    $("#FixEN").val(s[0][10]);
    $("#screenshotlist").empty();
    try {
        zip = new AdmZip(join_path("gallery/"+ now_buildid + ".zip"));
        if (ifzipfileexist(zip, 'pic.json') == 1) {
            var info = zip.readAsText("pic.json");
            console.log(info);
            if (info != "") {
                var s = JSON.parse(info);
                mainpicid = s.main_pic;
                for (let i = 0; i < s.screenshot.length; i++) {
                    if (i != mainpicid) {
                        $("#screenshotlist").append("<option data-pic=" + i + " data-pic-hash='" + s.screenshot[i].screenshothash + "' >" + s.screenshot[i].screenshottitle + "</option>");
                    } else {
                        $("#screenshotlist").append("<option data-pic=" + i + " data-pic-hash='" + s.screenshot[i].screenshothash + "' selected >" + s.screenshot[i].screenshottitle + "</option>");
                    }

                }
                $("#screenshotlist").attr('data-pic-num', s.screenshot.length);
                showpic(now_buildid, mainpicid);
            }
        }
    } catch {
        console.log('nopic');
    }
    //$("#wiki_link").attr(href,'https://wiki.betaworld.org/index.php?search='+s[0][6])
    //添加相关的代码
});
$(document).on('change', '#screenshotlist', function () {
    var checkValue = $("#screenshotlist").find("option:selected").attr('data-pic');
    if (checkValue == -1) {
        var s = $("#screenshotlist").find("option:selected").attr('data-pic-base64');
        s1 = "url(data:image/png;base64," + s + ')';
        $('#main_pic').css('background-image', s1);
    } else {
        console.log('a' + checkValue);
        showpic(now_buildid, checkValue)
    }

});
$(document).on('select.editable-select', '.edit_select', function (e) {
    if ($(this).attr('id') == 'productname') {
        proid = $('#productname').next('.es-list').children('[value="' + $('#productname').val() + '"]').attr('data-proid');
        var x = $('.bwdb_select_item[data-id="' + proid + '"]').attr('data-id-codename');
        console.log('clearB');
        $("#CodeName").editableSelect('clear');
        x1 = x.split(",");
        //console.log(x1);
        for (let i = 0; i < x1.length; i++) {
            $("#CodeName").editableSelect('add', x1[i], i, ['value', x1[i]]);
        }
        ipcRenderer.send('getbuildstageA', proid);
    }
});
$(document).on('click', '.nav_right_btn .nav_btn', function () {
    console.log($(this).attr('data-do'));
    switch ($(this).attr('data-do')) {
        case "save":
            save_build();
            break;
        case "new":
            now_buildid = -1;
            now_proid = -1;
            $("#productname").val('');
            $("#stage").val('');
            $("#vername").val('');
            $("#buildtag").val('');
            $("#biosdate").attr('value', '');
            $("#arch").val('');
            $("#CodeName").val('');
            $("#SerialNumber").val('');
            $("#SKU").val('');
            $("#LANG").val('');
            //alert(s[0][9]);
            $("#FixCN").val('');
            $("#FixEN").val('');
            $("#screenshotlist").empty();
            s1 = "url('static/images/no_image_preview.png')";
            $('#main_pic').css('background-image', s1);
            $('.title_bar').html('New Build');
            break;
        case "copycat":
            now_buildid = -1;
            now_proid = -1;
            //alert(s[0][9]);
            $("#screenshotlist").empty();
            s1 = "url('static/images/no_image_preview.png')";
            $('#main_pic').css('background-image', s1);
            $('.title_bar').html('New Build');
            $("#screenshotlist").empty();
            s1 = "url('static/images/no_image_preview.png')";
            break;
        case "refresh":
            if (now_buildid != -1) {
                ipcRenderer.send('getsyslistA', 'ping');
                ipcRenderer.send('getbuildstage', now_proid);
                get_build_info(now_proid, now_buildid);
            }
            break;
        case "delete":
            remote.dialog.showMessageBox({
                type: 'question',
                title: convert_dymstrlist_to_string('确认删除？', get_lang_now()),
                message: convert_dymstrlist_to_string('确认删除这个build吗？', get_lang_now()),
                buttons: [convert_dymstrlist_to_string('确认', get_lang_now()), convert_dymstrlist_to_string('取消', get_lang_now())]
            }).then((index) => {
                if (index.response === 0) {
                    ipcRenderer.send('deletebuild', [now_proid, now_buildid]);
                }
            });;
            break;
        case "ignore":
            let t = remote.dialog.showMessageBoxSync({
                type: 'question',
                title: convert_dymstrlist_to_string('确认放弃修改？', get_lang_now()),
                message: convert_dymstrlist_to_string('确认放弃修改吗？这会退出当前编辑状态。', get_lang_now()),
                buttons: [convert_dymstrlist_to_string('确认', get_lang_now()), convert_dymstrlist_to_string('取消', get_lang_now())]
            })
            if (t == 0) {
                if (now_proid == -1) {
                    now_buildid = 1
                    now_proid = 1
                }
                ipcRenderer.send('getsyslistA', 'ping');
                ipcRenderer.send('getbuildstage', now_proid);
                get_build_info(now_proid, now_buildid);
                $('.title_bar').html('DataBase Manage');
            }

            break;
        case "setting":
            ipcRenderer.send('openmanagesetting', '');
            break;
        case "info":
            if (os.platform == "win32") {
                remote.dialog.showMessageBoxSync(
                    {
                        type: "info",
                        title: convert_dymstrlist_to_string("编辑说明", get_lang_now()),
                        message: convert_dymstrlist_to_string("暂时还没有说明哦~", get_lang_now())
                    }
                );
            } else {
                remote.dialog.showMessageBoxSync(
                    {
                        type: "info",
                        title: convert_dymstrlist_to_string("编辑说明", get_lang_now()),
                        message: convert_dymstrlist_to_string("暂时还没有说明哦~", get_lang_now()),
                        buttons: ['OK']
                    }
                );
            }
    }
});
$(document).on('click', '.pic_btn', function () {
    console.log($(this).attr('data-do'));
    switch ($(this).attr('data-do')) {
        case "up":
            movelist('#screenshotlist', true);
            break;
        case "down":
            movelist('#screenshotlist', false);
            break;
        case "add":
            prompt({
                title: convert_dymstrlist_to_string('请输入截图名', get_lang_now()),
                label: convert_dymstrlist_to_string('截图名:', get_lang_now()),
                value: '',
                inputAttrs: {
                    type: 'text'
                },
                type: 'input'
            })
                .then((r) => {
                    if (r != null) {
                        console.log('result', r);
                        var fp = picdo.openOpenDialog();
                        if (fp != undefined) {
                            console.log(fp);
                            var s = picdo.waterimg2base64(fp);
                            $("#screenshotlist").append("<option data-pic=" + "-1" + " data-pic-hash='" + picdo.base642hash(s) + "' data-pic-base64='" + s + "' >" + r + "</option>");
                            //alert('添加成功！');
                            if (os.platform == "win32") {
                                remote.dialog.showMessageBoxSync({
                                    type: 'info',
                                    title: convert_dymstrlist_to_string('添加截图成功', get_lang_now()),
                                    message: convert_dymstrlist_to_string('添加截图成功', get_lang_now())
                                });
                            } else {
                                remote.dialog.showMessageBoxSync({
                                    type: 'info',
                                    title: convert_dymstrlist_to_string('添加截图成功', get_lang_now()),
                                    message: convert_dymstrlist_to_string('添加截图成功', get_lang_now()),
                                    buttons: ['OK']
                                });
                            }
                        }
                    }
                })
                .catch(console.error);

            break;
        case "edit":
            if ($("#screenshotlist").find("option:selected").length == 0) {
                return -1;
            }
            prompt({
                title: convert_dymstrlist_to_string('请输入新的截图名', get_lang_now()),
                label: convert_dymstrlist_to_string('截图名:', get_lang_now()),
                value: $("#screenshotlist").find("option:selected").html(),
                inputAttrs: {
                    type: 'text'
                },
                type: 'input'
            })
                .then((r) => {
                    if (r != null) {
                        $("#screenshotlist").find("option:selected").html(r);
                    }
                })
                .catch(console.error);

            break;
        case "replace":
            var fp = picdo.openOpenDialog();
            var checkValue = $("#screenshotlist").find("option:selected").attr('data-pic');
            var pictitle = $("#screenshotlist").find("option:selected").html();
            if (fp != undefined) {
                console.log(fp);
                var s = picdo.waterimg2base64(fp);
                //console.log(s);
                $("#screenshotlist").find("option:selected").after("<option data-pic=" + "-1" + " data-pic-hash='" + picdo.base642hash(s) + "' data-pic-base64='" + s + "' >" + pictitle + "</option>");
                if (checkValue == -1) {
                    $("#screenshotlist").find("option:selected").remove();
                } else {
                    $("#screenshotlist").children("[data-pic=" + checkValue + "]").remove();
                }

                $("#screenshotlist").children("[data-pic-hash=" + picdo.base642hash(s) + "]").attr("selected", true);
                //$("#screenshotlist").children("[data-pic="+checkValue+"]").attr('data-pic-base64',s);
                //$("#screenshotlist").children("[data-pic="+checkValue+"]").attr('data-pic','-1');
                s1 = "url(data:image/png;base64," + s + ')';
                $('#main_pic').css('background-image', s1);
                if (os.platform == "win32") {
                    remote.dialog.showMessageBoxSync({
                        type: 'info',
                        title: convert_dymstrlist_to_string('替换截图成功', get_lang_now()),
                        message: convert_dymstrlist_to_string('替换截图成功', get_lang_now())
                    });
                } else {
                    remote.dialog.showMessageBoxSync({
                        type: 'info',
                        title: convert_dymstrlist_to_string('替换截图成功', get_lang_now()),
                        message: convert_dymstrlist_to_string('替换截图成功', get_lang_now()),
                        buttons: ['OK']
                    });
                }
            }
            break;
        case "del":
            $("#screenshotlist").find("option:selected").remove();
            break;
    }
});
