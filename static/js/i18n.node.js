const fs1 = require("fs");
const { Module } = require("sql.js/dist/sql-asm");
const remote1= require("electron").remote;
const {app}=require("electron");
const os=require('os');
function get_path(){
    if(os.platform=="darwin"){
        //是mac
        if(app!=undefined){
            return app.getAppPath();
        }else{
            return remote1.app.getAppPath();
        }
        
    }else{
        return process.cwd();
    }
}
function join_path(filename){
    ap=get_path();
    if(os.platform=="darwin"){
        if(ap.indexOf(".app")==-1){
            return ap+"/"+filename;
        }else{
            v=ap.lastIndexOf(".app");
            v1=ap.substring(0,v+4);
            v2=v1.lastIndexOf("/");
            v3=v1.substring(0,v2);
            if(fs1.existsSync(v3+"/"+filename)){
                return v3+"/"+filename;
            }else{
                return ap+"/"+filename;
            }
        }
    }else{
        return ap+"/"+filename;
    }
    
}
var appp=get_path();
function convert_dymstrlist_to_string(str,langcode,modulename){
    var j = fs1.readFileSync(appp + "/i18n/" + langcode + ".json").toString();
    var s1 = JSON.parse(j);
    for(let i=0;i<s1.length;i++){
        if(s1[i].modulename==modulename){
            var s=s1[i];
            break;
        }
    }
    if(s==undefined){
        return str;
    }
    //console.log(s);
    for(let i=0;i<s.dymstr.length;i++){
        //console.log(s.dymstr[i].ori_text);
        if(s.dymstr[i].ori_text==str){
            return s.dymstr[i].translate_text;
        }
    }
    console.log('找不到：'+str);
    return str;
}
function convert_dymstrlist_to_string_include_array(str,langcode,modulename,arr){
    var j = fs1.readFileSync(appp + "/i18n/" + langcode + ".json").toString();
    var s2 = JSON.parse(j);
    for(let i=0;i<s2.length;i++){
        if(s2[i].modulename==modulename){
            var s=s2[i];
            break;
        }
    }
    if(s==undefined){
        return str;
    }
    var s1="";
    //console.log(s);
    for(let i=0;i<s.dymstr.length;i++){
        //console.log(s.dymstr[i].ori_text);
        if(s.dymstr[i].ori_text==str){
            s1=s.dymstr[i].translate_text;
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
function get_lang_now(){
    langcode="";
    try{
        var j = fs1.readFileSync(appp + "/settings.json").toString();
        var s = JSON.parse(j);
        langcode=s.now_lang;
    }catch{
        langcode=global.syslang;
        if(!fs1.existsSync(appp + "/i18n/" + langcode + ".json")){
            langcode="en-US";
        }
    }
    return langcode;
}
function setdarkmode(mode) {
    try {
        var j = fs1.readFileSync(appp + "/settings.json").toString();
        var s = JSON.parse(j);
        s.now_dark = mode;
        fs1.writeFileSync(appp + "/settings.json", JSON.stringify(s));
    } catch{
        var s = { now_lang: langcode };
        fs1.writeFileSync(appp + "/settings.json", JSON.stringify(s));
        s.now_dark = mode;
    }
}
function get_dark_now() {
    langcode = "";
    try {
        var j = fs1.readFileSync(appp + "/settings.json").toString();
        var s = JSON.parse(j);
        langcode = s.now_dark;
    } catch{
        langcode = "system";
    }
    return langcode;
}
module.exports={
    convert_dymstrlist_to_string,
    convert_dymstrlist_to_string_include_array,
    get_lang_now,
    get_path,
    join_path,
    setdarkmode,
    get_dark_now
};