const fs1 = require("fs");
const { Module } = require("sql.js/dist/sql-asm");
const remote1= require("electron").remote;
function convert_dymstrlist_to_string(str,langcode,modulename){
    var j = fs1.readFileSync(process.cwd() + "/i18n/" + langcode + ".json").toString();
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
            return s.dymstr[i].translate_text+"!!!"
        }
    }
    console.log('找不到：'+str);
    return str;
}
function convert_dymstrlist_to_string_include_array(str,langcode,modulename,arr){
    var j = fs1.readFileSync(process.cwd() + "/i18n/" + langcode + ".json").toString();
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
function get_lang_now(){
    langcode="";
    try{
        var j = fs1.readFileSync(process.cwd() + "/settings.json").toString();
        var s = JSON.parse(j);
        langcode=s.now_lang;
    }catch{
        langcode=global.syslang;
        if(!fs1.existsSync(process.cwd() + "/i18n/" + langcode + ".json")){
            langcode="zh-CN";
        }
    }
    return langcode;
}
module.exports={
    convert_dymstrlist_to_string,
    convert_dymstrlist_to_string_include_array,
    get_lang_now
};