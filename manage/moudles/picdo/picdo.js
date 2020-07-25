const { remote } = require("electron");
const crypto=require("crypto");
var water=require("../water");
function openSaveDialog() {
    var path = remote.dialog.showSaveDialogSync({
      title: "请选择图片保存的路径：",
      properties: ['showOverwriteConfirmation'],
      filters: [
        { name: '图片文件(*.png)', extensions: ['png'] }
      ]
    });
    return (path);
  }
function openOpenDialog() {
    var path = remote.dialog.showOpenDialogSync({
      title: "请选择要导入/替换的图片：",
      properties: ['showOverwriteConfirmation'],
      filters: [
        { name: '图片文件(*.png)', extensions: ['png'] }
      ]
    });
    return (path[0]);
  }
function waterimg2base64(imgpath){
  return(water.water_to_base64(imgpath));
}
function base642hash(base64str){
  const dataBuffer = new Buffer(base64str, 'base64'); 
  const hash=crypto.createHash('md5');
  hash.update(dataBuffer,'utf8');
  const md5=hash.digest('hex');
  return(md5);

}
module.exports={
  openOpenDialog,
  openSaveDialog,
  waterimg2base64,
  base642hash
}