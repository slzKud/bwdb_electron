var images = require('images');
var path = require('path');
const { remote } = require('electron');
var watermarkImg = images(remote.app.getAppPath()+"/manage/static/images/logo.png");

function water_to_files(imagepath,destpath){
    var sourceImg = images(imagepath);
    var sWidth = sourceImg.width();
    var sHeight = sourceImg.height();
    var wmWidth = watermarkImg.width();
    var wmHeight = watermarkImg.height();
    images(sourceImg).draw(watermarkImg, sWidth - wmWidth, sHeight - wmHeight).save(destpath);
}
function water_to_base64(imagepath){
    var sourceImg = images(imagepath);
    var sWidth = sourceImg.width();
    var sHeight = sourceImg.height();
    var wmWidth = watermarkImg.width();
    var wmHeight = watermarkImg.height();
    var s=images(sourceImg).draw(watermarkImg, sWidth - wmWidth, sHeight - wmHeight).toBuffer('png');
    return s.toString('base64');
}

module.exports={
    water_to_base64,
    water_to_files
}