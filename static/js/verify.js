const { BrowserWindow,app } = require("electron");
const crypto=require("crypto");
const fs=require("fs");
var path = require('path');
function getFileName(data) {
    return data.substring(0, data.indexOf("."));
}
function filetosha256sync(file){
    if(!fs.existsSync(file)){
        return false;
    }
    d=fs.readFileSync(file);
    s256=filetosha256(d);
    d=null;
    return s256;
}
function filetosha256(data){
    const dataBuffer = data; 
    const hash=crypto.createHash('sha256');
    hash.update(dataBuffer,'utf8');
    const md5=hash.digest('hex');
    return(md5);
}
async function makesha256list(path1,callback){
    var a=[];
    const resolve = await new Promise(resolve => {
        fs.readdir(path1, function (err, files) {
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filepath = path.join(path1, filename);
                var s256 = filetosha256sync(filepath);
                var a1 = { "filename": getFileName(filename), "sha256": s256, "modifydate": "" };
                console.log(a1);
                callback(a1);
                //a.push(a1);
                //win.webContents.send('log',a1);
            });
            resolve(0);
        });
    });
    return (a);
}
module.exports={
    filetosha256sync,
    makesha256list
};