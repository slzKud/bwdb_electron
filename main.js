const { app, BrowserWindow,Menu } = require('electron')
const ipcMain = require('electron').ipcMain;
const initSqlJs=require('sql.js/dist/sql-asm');
const dialog = require('electron').dialog;
//const SQL = require('sql.js/dist/sql-asm');
const fs = require("fs");
try{
  var data = fs.readFileSync('./DataBase.db');
}catch{
    dialog.showErrorBox('基本数据库不存在','基本数据库不存在，程序将退出。');
    app.quit();
}

//console.log(db);
var win,aboutWindow;
function createWindow () {   
  // 创建浏览器窗口
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    minHeight:400,
    minWidth:700,
    width: 1009,
    height: 679,
    show:false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  // 并且为你的应用加载index.html
  win.loadFile('main.html');

  // 打开开发者工具
  win.webContents.openDevTools();
  //createAboutWindow();
  //import sqlite3Db from './nw/sqlite3_test'
}

function createAboutWindow () {   
  // 创建浏览器窗口
  aboutWindow = new BrowserWindow ({width: 420, height:290,transparent: true, frame: false})
  aboutWindow.loadFile('about.html');
  aboutWindow.on("close", function(){
    aboutWindow = null;
  });
  aboutWindow.on("blur", function(){
    aboutWindow.close();
  });
}
// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
//主程序的IPC部分
ipcMain.on('show-win', (event, args) => {
  win.show();
});

ipcMain.on('getsyslist', (event, args) => {
  console.log('getsyslist is captured.');
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    contents = db.exec("SELECT ID,Name,CodeName FROM Product order by ID");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[arr[i][0],arr[i][1],arr[i][2]];
      arr_sys.push(arr_sys1);
    };
    var json1=JSON.stringify(arr_sys);
    console.log(json1);
    win.webContents.send('syslist',json1);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbuildstage', (event, args) => {
  console.log('getbuildstage is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT Stage FROM Build where ProductID="+args+" group by Stage ORDER BY Date asc");
    contents = db.exec("SELECT Stage FROM Build where ProductID="+args+" group by Stage ORDER BY Date asc");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys.push(arr[i][0]);
    };
    var json1=JSON.stringify(arr_sys);
    console.log(json1);
    win.webContents.send('stagelist',[args,json1]);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbuildlist', (event, args) => {
  console.log('getbuildlist is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT ID,Version FROM Build where ProductID="+args[0]+" and Stage='"+args[1]+"' ORDER BY Date");
    contents = db.exec("SELECT ID,Version FROM Build where ProductID="+args[0]+" and Stage='"+args[1]+"' ORDER BY Date");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[arr[i][0],arr[i][1]];
      arr_sys.push(arr_sys1);
    };
    var json1=JSON.stringify(arr_sys);
    console.log(json1);
    win.webContents.send('buildlist',[args[0],args[1],json1]);
    console.log('message sent.');
    db.close();
  });
});

const newLocal = 'searchbuildlist';
ipcMain.on(newLocal, (event, args) => {
  console.log('searchbuildlist is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT ID,ProductID,Stage,Version FROM Build where Version like '%"+args+"%' ORDER BY ID,Date");
    contents = db.exec("SELECT ID,ProductID,Stage,Version FROM Build where Version like '%"+args+"%' ORDER BY ID,Date");
    if(contents.length==0){
      dialog.showErrorBox('找不到数据','你查找的"'+args+'"找不到条目。');
      var json1=JSON.stringify([]);
      console.log(json1);
      win.webContents.send('searchlist',[args,json1]);
      console.log('message sent.');
      db.close();
      return -1;
    }
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[];
      for(var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    var json1=JSON.stringify(arr_sys);
    console.log(json1);
    win.webContents.send('searchlist',[args,json1]);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getupdatelist', (event, args) => {
  console.log('getbwdbversion is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("select BuildID,Build.ProductID,Build.Version from ChangeLog inner join Build on build.ID=BuildID");
    contents = db.exec("select BuildID,Build.ProductID,Build.Version from ChangeLog inner join Build on build.ID=BuildID");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[];
      for(var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    console.log(arr_sys);
    var json1=JSON.stringify(arr_sys);
    console.log([json1]);
    win.webContents.send('updatelist',[json1]);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbuildinfo', (event, args) => {
  console.log('getbuildinfo is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT ID,Stage,Version,Buildtag,Architecture,Edition,Language,Date,Serial,Notes,NotesEN FROM Build where ProductID="+args[0]+" and ID="+args[1]+" ORDER BY ID");
    contents = db.exec("SELECT ID,Stage,Version,Architecture,Edition,Language,Buildtag,Date,Serial,Notes,NotesEN FROM Build where ProductID="+args[0]+" and ID="+args[1]+" ORDER BY ID");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[];
      for(var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    console.log(arr_sys);
    var json1=JSON.stringify(arr_sys);
    console.log([args[0],args[1],json1]);
    win.webContents.send('buildinfo',[args[0],args[1],json1]);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbwdbversion', (event, args) => {
  console.log('getbwdbversion is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT * FROM Version");
    contents = db.exec("SELECT * FROM Version");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[];
      for(var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    console.log(arr_sys);
    var json1=JSON.stringify(arr_sys);
    console.log([json1]);
    win.webContents.send('bwdbversion',[json1]);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbuildinfo', (event, args) => {
  console.log('getbuildinfo is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT ID,Stage,Version,Buildtag,Architecture,Edition,Language,Date,Serial,Notes,NotesEN FROM Build where ProductID="+args[0]+" and ID="+args[1]+" ORDER BY ID");
    contents = db.exec("SELECT ID,Stage,Version,Architecture,Edition,Language,Buildtag,Date,Serial,Notes,NotesEN FROM Build where ProductID="+args[0]+" and ID="+args[1]+" ORDER BY ID");
    arr=contents[0].values;
    arr_sys= [];
    arr_sys1=[];
    //console.log(contents);
    console.log(arr);
    console.log(arr.length);
    for(var i = 0; i < arr.length; i++) {
      arr_sys1=[];
      for(var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    console.log(arr_sys);
    var json1=JSON.stringify(arr_sys);
    console.log([args[0],args[1],json1]);
    win.webContents.send('buildinfo',[args[0],args[1],json1]);
    console.log('message sent.');
    db.close();
  });
});

ipcMain.on('openabout', (event, args) => {
  createAboutWindow();
});

ipcMain.on('closeabout', (event, args) => {
  aboutWindow.close();
});
//关于界面的IPC部分
