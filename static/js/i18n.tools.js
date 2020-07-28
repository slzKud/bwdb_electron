const fs1 = require("fs");
const remote1= require("electron").remote;
function isChn(str) {
    
    var reg = /^[\u4E00-\u9FA5]+$/;
    if (!reg.test(str)) {
        return false;
    }
    
    return true;
}
function get_the_filename(){
   return self.location.href.replace('file://','').replace(new RegExp('/',"gm"), "\\").replace(remote1.app.getAppPath(),"").replace('\\\\','');
}
function get_all_html_element() {
    var a = [];
    $("div").each(function () {
        console.log($(this))
        var title = $(this).attr('title');
        var v = $(this).attr('value');
        var h = $(this).html();
        var id = $(this).attr('id');
        var ph = $(this).attr('placeholder');
        var classStr = $(this).attr('class');
        if (isChn(title)) {
            b = { strtype: 'title', ori_text: title, translate_text: title, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(v)) {
            b = { strtype: 'value', ori_text: v, translate_text: v, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(h)) {
            b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(ph)) {
            b = { strtype: 'placeholder', ori_text: ph, translate_text: ph, id: id, classStr: classStr }
            a.push(b);
        }
    });
    $("a").each(function () {
        console.log($(this))
        var title = $(this).attr('title');
        var v = $(this).attr('value');
        var h = $(this).html();
        var id = $(this).attr('id');
        var ph = $(this).attr('placeholder');
        var classStr = $(this).attr('class');
        if (isChn(title)) {
            b = { strtype: 'title', ori_text: title, translate_text: title, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(v)) {
            b = { strtype: 'value', ori_text: v, translate_text: v, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(h)) {
            b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(ph)) {
            b = { strtype: 'placeholder', ori_text: ph, translate_text: ph, id: id, classStr: classStr }
            a.push(b);
        }
    });
    $("button").each(function () {
        console.log($(this))
        var title = $(this).attr('title');
        var v = $(this).attr('value');
        var h = $(this).html();
        var id = $(this).attr('id');
        var ph = $(this).attr('placeholder');
        var classStr = $(this).attr('class');
        if (isChn(title)) {
            b = { strtype: 'title', ori_text: title, translate_text: title, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(v)) {
            b = { strtype: 'value', ori_text: v, translate_text: v, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(h)) {
            b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
            a.push(b);
        }
        if (isChn(ph)) {
            b = { strtype: 'placeholder', ori_text: ph, translate_text: ph, id: id, classStr: classStr }
            a.push(b);
        }
    });
        $("h1h2h3h4h5").each(function () {
            console.log($(this))
            var title = $(this).attr('title');
            var v = $(this).attr('value');
            var h = $(this).html();
            var id = $(this).attr('id');
            var ph = $(this).attr('placeholder');
            var classStr = $(this).attr('class');
            if (isChn(title)) {
                b = { strtype: 'title', ori_text: title, translate_text: title, id: id, classStr: classStr }
                a.push(b);
            }
            if (isChn(v)) {
                b = { strtype: 'value', ori_text: v, translate_text: v, id: id, classStr: classStr }
                a.push(b);
            }
            if (isChn(h)) {
                b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
                a.push(b);
            }
            if (isChn(ph)) {
                b = { strtype: 'placeholder', ori_text: ph, translate_text: ph, id: id, classStr: classStr }
                a.push(b);
            }
    });
    $(".panel-title").each(function () {
        console.log($(this))
        var title = $(this).attr('title');
        var v = $(this).attr('value');
        var h = $(this).html();
        var id = $(this).attr('id');
        var ph = $(this).attr('placeholder');
        var classStr = $(this).attr('class');
        b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
        a.push(b);
    });
    $(".edit_title").each(function () {
        console.log($(this))
        var title = $(this).attr('title');
        var v = $(this).attr('value');
        var h = $(this).html();
        var id = $(this).attr('id');
        var ph = $(this).attr('placeholder');
        var classStr = $(this).attr('class');
        b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
        a.push(b);
    });
    $(".pic_btn").each(function () {
        console.log($(this))
        var title = $(this).attr('title');
        var v = $(this).attr('value');
        var h = $(this).html();
        var id = $(this).attr('id');
        var ph = $(this).attr('placeholder');
        var classStr = $(this).attr('class');
        b = { strtype: 'html', ori_text: h, translate_text: h, id: id, classStr: classStr }
        a.push(b);
    });
    fs1.writeFileSync(`${process.cwd()}/${get_the_filename()}_lang.txt`,JSON.stringify({ modulename: get_the_filename(), staticlangstr: a }));
    return (JSON.stringify({ modulename: get_the_filename(), staticlangstr: a }));
}
function change_static_element(langcode) {
    var j = fs1.readFileSync(process.cwd() + "/i18n/" + langcode + ".json").toString();
    console.log(j);
    var s1 = JSON.parse(j);
    for(let i=0;i<s1.length;i++){
        if(s1[i].modulename==get_the_filename()){
            var s=s1[i];
            break;
        }
    }
    console.log(s);
    for (let i = 0; i < s.staticlangstr.length; i++) {
        console.log(s.staticlangstr[i].strtype);
        console.log(s.staticlangstr[i].classStr);
        console.log(s.staticlangstr[i].id);
        console.log(s.staticlangstr[i].ori_text);
        switch (s.staticlangstr[i].strtype) {
            case "html":
                if (s.staticlangstr[i].id != undefined) {
                    $('#' + s.staticlangstr[i].id).html(s.staticlangstr[i].translate_text + "!!!");
                } else {
                    if (s.staticlangstr[i].classStr != undefined) {
                        console.log($('.' + s.staticlangstr[i].classStr).length)
                        if($('.' + s.staticlangstr[i].classStr).length==0){
                            console.log('找不到：'+s.staticlangstr[i].classStr)
                        }
                        if($('.' + s.staticlangstr[i].classStr).length==1){
                            console.log('找到1：'+s.staticlangstr[i].classStr)
                            $('.' + s.staticlangstr[i].classStr).html(s.staticlangstr[i].translate_text + "!!!")
                        }
                        if($('.' + s.staticlangstr[i].classStr).length>1){
                            console.log('找到N：'+s.staticlangstr[i].classStr)
                            $('.' + s.staticlangstr[i].classStr).each(function(){
                                if($(this).html().indexOf(s.staticlangstr[i].ori_text)!=-1){
                                    $(this).html(s.staticlangstr[i].translate_text + "!!!")
                                }
                            });
                        }

                        //$('.' + s.staticlangstr[i].classStr).find(':contains(' + s.staticlangstr[i].ori_text + ')').html(s.staticlangstr[i].translate_text + "!!!");
                    }
                }
                break;
            case "title":
                if (s.staticlangstr[i].id != undefined) {
                    console.log('id');
                    $('#' + s.staticlangstr[i].id).attr('title',s.staticlangstr[i].translate_text + "!!!");
                } else {
                    if (s.staticlangstr[i].classStr != undefined) {
                        //$('.' + s.staticlangstr[i].classStr).find('[title="' + s.staticlangstr[i].ori_text + '"]').attr('title',s.staticlangstr[i].translate_text + "!!!");
                        console.log($('.' + s.staticlangstr[i].classStr).length)
                        if($('.' + s.staticlangstr[i].classStr).length==1){
                            $('.' + s.staticlangstr[i].classStr).attr('title',s.staticlangstr[i].translate_text + "!!!")
                        }
                        if($('.' + s.staticlangstr[i].classStr).length>1){
                            $('.' + s.staticlangstr[i].classStr).each(function(){
                                if($(this).attr('title').indexOf(s.staticlangstr[i].ori_text)!=-1){
                                    $(this).attr('title',s.staticlangstr[i].translate_text + "!!!")
                                }
                            });
                        }
                    }
                }
                break;
            case "placeholder":
                if (s.staticlangstr[i].id != undefined) {
                    $('#' + s.staticlangstr[i].id ).attr('placeholder',s.staticlangstr[i].translate_text + "!!!");
                } else {
                    if (s.staticlangstr[i].classStr != undefined) {
                        //$('.' + s.staticlangstr[i].classStr + '[placeholder="' + s.staticlangstr[i].ori_text + '"]').attr('placeholder',s.staticlangstr[i].translate_text + "!!!");
                        if($('.' + s.staticlangstr[i].classStr).length==1){
                            $('.' + s.staticlangstr[i].classStr).attr('placeholder',s.staticlangstr[i].translate_text + "!!!")
                        }
                        if($('.' + s.staticlangstr[i].classStr).length>1){
                            $('.' + s.staticlangstr[i].classStr).each(function(){
                                if($(this).attr('placeholder').indexOf(s.staticlangstr[i].ori_text)!=-1){
                                    $(this).attr('placeholder',s.staticlangstr[i].translate_text + "!!!")
                                }
                            });
                        }
                    }
                }
                break;
        }
    }
}
function convert_dymstrlist_to_string(str,langcode){
    var j = fs1.readFileSync(process.cwd() + "/i18n/" + langcode + ".json").toString();
    var s1 = JSON.parse(j);
    for(let i=0;i<s1.length;i++){
        if(s1[i].modulename==get_the_filename()){
            var s=s1[i];
            break;
        }
    }
    //console.log(s);
    for(let i=0;i<s.dymstr.length;i++){
        //console.log(s.dymstr[i].ori_text);
        if(s.dymstr[i].ori_text==str){
            return s.dymstr[i].translate_text+"!!!"
        }
    }
    console.log('找不到：'+str);
    return str;
}
function convert_dymstrlist_to_string_include_array(str,langcode,arr){
    var j = fs1.readFileSync(process.cwd() + "/i18n/" + langcode + ".json").toString();
    var s2 = JSON.parse(j);
    for(let i=0;i<s2.length;i++){
        if(s2[i].modulename==get_the_filename()){
            var s=s2[i];
            break;
        }
    }
    var s1="";
    //console.log(s);
    for(let i=0;i<s.dymstr.length;i++){
        //console.log(s.dymstr[i].ori_text);
        if(s.dymstr[i].ori_text==str){
            s1=s.dymstr[i].translate_text+"!!!"
        }
    }
    if(s1==""){
        console.log('找不到：'+str);
        s1=str;
    }
    for(let i=0;i<arr.length;i++){
        s1=s1.replace(new RegExp("%"+String(i+1),"gm"),arr[i]);
    }
    return s1;

}
function convert_dym_strlist(arr){
    var a=[]
    for(let i=0;i<arr.length;i++){
        b={ori_text:arr[i],translate_text:arr[i]};
        a.push(b)
    }
    return (JSON.stringify(a));
}
function get_lang_now(){
    langcode="";
    try{
        var j = fs1.readFileSync(process.cwd() + "/settings.json").toString();
        var s = JSON.parse(j);
        langcode=s.now_lang;
    }catch{
        langcode=remote1.getGlobal('syslang');
        if(!fs1.existsSync(process.cwd() + "/i18n/" + langcode + ".json")){
            langcode="zh-CN";
        }
    }
    return langcode;
}