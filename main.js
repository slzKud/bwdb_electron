const { app, BrowserWindow, Menu, MenuItem,nativeTheme} = require('electron')
const ipcMain = require('electron').ipcMain;
const initSqlJs = require('sql.js/dist/sql-asm');
const dialog = require('electron').dialog;
//const SQL = require('sql.js/dist/sql-asm');
const fs = require("fs");
const os = require("os");
const { promises } = require('dns');
const { RSA_X931_PADDING, UV_UDP_REUSEADDR } = require('constants');
const { resourceUsage } = require('process');
const i18n = require('./static/js/i18n.node');
const v1 = require('./static/js/verify');
var appp = i18n.get_path();
v = i18n.join_path('DataBase.db');
if (os.platform == "darwin") {
  if (v.indexOf('.app/') != -1) {
    dialog.showErrorBox(i18n.convert_dymstrlist_to_string('基本数据库路径提醒', i18n.get_lang_now(), 'main.js'), i18n.convert_dymstrlist_to_string('使用的基本数据库是内置在程序的Lite版本，一些功能可能只在本地App生效。请手动复制数据库文件到与应用程序同级的文件夹中。', i18n.get_lang_now(), 'main.js'));
  }
}
try {
  var data = fs.readFileSync(i18n.join_path('DataBase.db'));
} catch {
  dialog.showErrorBox(i18n.convert_dymstrlist_to_string('基本数据库不存在', i18n.get_lang_now(), 'main.js'), i18n.convert_dymstrlist_to_string('基本数据库不存在，程序将退出。', i18n.get_lang_now(), 'main.js'));
  app.quit();
}
String.prototype.myReplace = function (f, e) {//吧f替换成e
  var reg = new RegExp(f, "g"); //创建正则RegExp对象   
  return this.replace(reg, e);
}
////console.log(db);
var win, aboutWindow, authorwindow, gallerywindow, settingwindow, langwindow,workerwindow,hashwindow;
var picjson,flaghash=0;
function set_app_menu() {
  if (process.platform === 'darwin') {
    const isMac = process.platform === 'darwin'
    if (fs.existsSync(appp + "/manage")) {
      template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
          label: app.name,
          submenu: [
            {
              label: i18n.convert_dymstrlist_to_string('切换至数据库编辑模式', i18n.get_lang_now(), 'main.html'),
              click: async () => {
                app.relaunch({ args: [".", "--manage"] })
                app.exit(0)
              }
            },
            {
              label: i18n.convert_dymstrlist_to_string('Language', i18n.get_lang_now(), 'main.html'),
              click: async () => {
                createLangSettingWindow();
              }
            },
            {
              label: i18n.convert_dymstrlist_to_string('关于', i18n.get_lang_now(), 'main.html') + " BetaWorld Library",
              click: async () => {
                createAboutWindow();
              }
            },
            { role: 'quit' }
          ]
        }] : [])
      ]
    } else {
      template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
          label: app.name,
          submenu: [
            {
              label: i18n.convert_dymstrlist_to_string('Language', i18n.get_lang_now(), 'main.html'),
              click: async () => {
                createLangSettingWindow();
              }
            },
            {
              label: i18n.convert_dymstrlist_to_string('关于', i18n.get_lang_now(), 'main.html') + " BetaWorld Library",
              click: async () => {
                createAboutWindow();
              }
            },
            { role: 'quit' }
          ]
        }] : [])
      ]
    }


    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null);
  }
}
function createWindow() {
  set_app_menu();
  // 创建浏览器窗口
  win = new BrowserWindow({
    minHeight: 300,
    minWidth: 600,
    width: 900,
    height: 600,
    show: false,
    icon: './static/img/bwdb_icon.png',
    webPreferences: {
      nodeIntegration: true,
      directWrite: false
    }
  });

  // 并且为你的应用加载index.html
  win.loadFile('main.html');
  win.on("close", function () {
    win = null;
    app.quit();
  });
  // 打开开发者工具
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
  //
  //createAboutWindow();
  //import sqlite3Db from './nw/sqlite3_test'
}

function createAboutWindow() {
  // 创建浏览器窗口
  //aboutWindow = new BrowserWindow ({width: 420, height:290,transparent: true, frame: false})
  aboutWindow = new BrowserWindow({
    width: 420,
    height: 290,
    transparent: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  aboutWindow.loadFile('about.html');
  aboutWindow.on("close", function () {
    aboutWindow = null;
  });
  aboutWindow.on("blur", function () {
    aboutWindow.close();
  });
  //aboutWindow.webContents.openDevTools();
}
function createAuthorWindow() {
  // 创建浏览器窗口
  //aboutWindow = new BrowserWindow ({width: 420, height:290,transparent: true, frame: false})
  authorwindow = new BrowserWindow({
    width: 650,
    height: 400,
    resizable: false,
    maximizable: false,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  authorwindow.loadFile('contributor.html');
  authorwindow.on("close", function () {
    aboutWindow = null;
  });
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
  //authorwindow.webContents.openDevTools();
  //aboutWindow.webContents.openDevTools();
}
function creategalleryWindow() {
  // 创建浏览器窗口
  //aboutWindow = new BrowserWindow ({width: 420, height:290,transparent: true, frame: false})
  if (gallerywindow != null) {
    dialog.showErrorBox(i18n.convert_dymstrlist_to_string('提示', i18n.get_lang_now(), 'main.js'), i18n.convert_dymstrlist_to_string('你已经打开了一个截图阅览器，请关闭后重试。', i18n.get_lang_now(), 'main.js'));
    //gallerywindow.fo
    gallerywindow.show();
    return -1;
  }
  if (os.platform != "darwin") {
    gallerywindow = new BrowserWindow({
      width: 750,
      height: 650,
      resizable: true,
      transparent: true,
      frame: false,
      show: false,
      icon: './static/img/bwdb_icon.png',
      webPreferences: {
        nodeIntegration: true,
        directWrite: false
      }
    });
  } else {
    gallerywindow = new BrowserWindow({
      width: 750,
      height: 650,
      resizable: true,
      transparent: true,
      titleBarStyle: "hidden",
      maximizable: false,
      show: false,
      icon: './static/img/bwdb_icon.png',
      webPreferences: {
        nodeIntegration: true,
        directWrite: false
      }
    });
  }

  gallerywindow.loadFile('gallery.html');
  //gallerywindow.webContents.openDevTools();
  gallerywindow.on("close", function () {
    set_app_menu();
    gallerywindow = null;
  });
}
function createManageMainWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    minHeight: 400,
    minWidth: 700,
    width: 1009,
    height: 679,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  });


  // 并且为你的应用加载index.html
  win.loadFile('manage/main.html');
  win.on("close", function () {
    win = null;
    app.quit();
  });
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
  //win.webContents.openDevTools();
}
function createManageSettingWindow() {
  if (os.platform != "darwin") {
    Menu.setApplicationMenu(null);
  }
  settingwindow = new BrowserWindow({
    minHeight: 690,
    minWidth: 363,
    width: 690,
    height: 480,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  settingwindow.loadFile('manage/settings.html');
  //settingwindow.webContents.openDevTools();
}
function createLangSettingWindow() {
  if (os.platform != "darwin") {
    Menu.setApplicationMenu(null);
  }
  langwindow = new BrowserWindow({
    width: 325,
    height: 400,
    resizable: false,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  langwindow.loadFile('lang.html');
  //langwindow.webContents.openDevTools();
}
function createHashSettingWindow() {
  if (os.platform != "darwin") {
    Menu.setApplicationMenu(null);
  }
  hashwindow = new BrowserWindow({
    width: 650,
    height: 400,
    resizable: false,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  hashwindow.loadFile('hash.html');
  flaghash=0;
  //hashwindow.webContents.openDevTools();
}
// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
function app_ready_do() {
  //console.log(process.argv)
  if (process.argv[2] == "--manage") {
    createManageMainWindow();
  } else {
    createWindow();
  }
  global.syslang = app.getLocale();
  if (os.platform == "darwin") {
    app.dock.setIcon(appp + "/static/img/bwdb_icon.png");
  }
  //dialog.showErrorBox("1",String(nativeTheme.shouldUseDarkColors));
}
app.whenReady().then(app_ready_do)

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
  if (args == "win") {
    win.show();
    return 0;
  }
  if (args == "about") {
    aboutWindow.show();
    return 0;
  }
  if (args == "author") {
    authorWindow.show();
    return 0;
  }
  if (args == "gallery") {
    gallerywindow.show();
    return 0;
  }
  if (args == "managesetting") {
    settingwindow.show();
    return 0;
  }
  if (args == "langsetting") {
    langwindow.show();
    return 0;
  }
  if (args == "hash") {
    if(flaghash==1){
      hashwindow.webContents.send("setmode",1);
    }
    hashwindow.show();
    return 0;
  }
});

ipcMain.on('getsyslist', (event, args) => {
  //console.log('getsyslist is captured.');
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    contents = db.exec("SELECT ID,Name,CodeName FROM Product order by ID");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [arr[i][0], arr[i][1], arr[i][2]];
      arr_sys.push(arr_sys1);
    };
    var json1 = JSON.stringify(arr_sys);
    //console.log(json1);
    win.webContents.send('syslist', json1);
    //console.log('message sent.');
    db.close();
  });
});
ipcMain.on('getsyslistA', (event, args) => {
  //console.log('getsyslist is captured.');
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    contents = db.exec("SELECT ID,Name,CodeName FROM Product order by ID");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [arr[i][0], arr[i][1], arr[i][2]];
      arr_sys.push(arr_sys1);
    };
    var json1 = JSON.stringify(arr_sys);
    //console.log(json1);
    win.webContents.send('syslistA', json1);
    //console.log('message sent.');
    db.close();
  });
});
ipcMain.on('getbuildstage', (event, args) => {
  //console.log('getbuildstage is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT Stage FROM Build where ProductID="+args+" group by Stage ORDER BY Date asc");
    contents = db.exec("SELECT Stage FROM Build where ProductID=" + args + " group by Stage ORDER BY Date asc");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys.push(arr[i][0]);
    };
    var json1 = JSON.stringify(arr_sys);
    //console.log(json1);
    win.webContents.send('stagelist', [args, json1]);
    //console.log('message sent.');
    db.close();
  });
});
ipcMain.on('getbuildstageA', (event, args) => {
  //console.log('getbuildstage is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT Stage FROM Build where ProductID="+args+" group by Stage ORDER BY Date asc");
    contents = db.exec("SELECT Stage FROM Build where ProductID=" + args + " group by Stage ORDER BY Date asc");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys.push(arr[i][0]);
    };
    var json1 = JSON.stringify(arr_sys);
    //console.log(json1);
    win.webContents.send('stagelistA', [args, json1]);
    //console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbuildlist', (event, args) => {
  //console.log('getbuildlist is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT ID,Version FROM Build where ProductID="+args[0]+" and Stage='"+args[1]+"' ORDER BY Date");
    contents = db.exec("SELECT ID,Version FROM Build where ProductID=" + args[0] + " and Stage='" + args[1] + "' ORDER BY Date");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [arr[i][0], arr[i][1]];
      arr_sys.push(arr_sys1);
    };
    var json1 = JSON.stringify(arr_sys);
    //console.log(json1);
    win.webContents.send('buildlist', [args[0], args[1], json1]);
    //console.log('message sent.');
    db.close();
  });
});

const newLocal = 'searchbuildlist';
ipcMain.on(newLocal, (event, args) => {
  //console.log('searchbuildlist is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT ID,ProductID,Stage,Version FROM Build where Version like '%"+args+"%' ORDER BY ID,Date");
    contents = db.exec("SELECT ID,ProductID,Stage,Version FROM Build where Version like '%" + args + "%' ORDER BY ID,Date");
    if (contents.length == 0) {
      dialog.showErrorBox(i18n.convert_dymstrlist_to_string('找不到数据', i18n.get_lang_now(), 'main.js'), i18n.convert_dymstrlist_to_string_include_array("你查找的“%1”找不到条目。", i18n.get_lang_now(), 'main.js', [args]));
      var json1 = JSON.stringify([]);
      //console.log(json1);
      win.webContents.send('searchlist', [args, json1]);
      //console.log('message sent.');
      db.close();
      return -1;
    }
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [];
      for (var j = 0; j < arr[i].length; j++) {
        //console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    var json1 = JSON.stringify(arr_sys);
    //console.log(json1);
    win.webContents.send('searchlist', [args, json1]);
    //console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getupdatelist', (event, args) => {
  //console.log('getbwdbversion is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("select BuildID,Build.ProductID,Build.Version from ChangeLog inner join Build on build.ID=BuildID");
    contents = db.exec("select BuildID,Build.ProductID,Build.Version from ChangeLog inner join Build on build.ID=BuildID");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [];
      for (var j = 0; j < arr[i].length; j++) {
        //console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    //console.log(arr_sys);
    var json1 = JSON.stringify(arr_sys);
    //console.log([json1]);
    win.webContents.send('updatelist', [json1]);
    //console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbuildinfo', (event, args) => {
  //console.log('getbuildinfo is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    console.log("SELECT ID,Stage,Version,Buildtag,Architecture,Edition,Language,Date,Serial,Notes,NotesEN,CodeName FROM Build where ProductID=" + args[0] + " and ID=" + args[1] + " ORDER BY ID");
    contents = db.exec("SELECT ID,Stage,Version,Architecture,Edition,Language,Buildtag,Date,Serial,Notes,NotesEN,CodeName FROM Build where ProductID=" + args[0] + " and ID=" + args[1] + " ORDER BY ID");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [];
      for (var j = 0; j < arr[i].length; j++) {
        //console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    //console.log(arr_sys);
    var json1 = JSON.stringify(arr_sys);
    //console.log([args[0],args[1],json1]);
    win.webContents.send('buildinfo', [args[0], args[1], json1]);
    //console.log('message sent.');
    db.close();
  });
});

ipcMain.on('getbwdbversion', (event, args) => {
  //console.log('getbwdbversion is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT * FROM Version");
    contents = db.exec("SELECT * FROM Version");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [];
      for (var j = 0; j < arr[i].length; j++) {
        //console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    //console.log(arr_sys);
    var json1 = JSON.stringify(arr_sys);
    //console.log([json1]);
    switch (args) {
      case "about":
        aboutWindow.webContents.send('bwdbversion', [json1]);
        break;
      case "managesetting":
        settingwindow.webContents.send('bwdbversion', [json1]);
        break;
      default:
        win.webContents.send('bwdbversion', [json1]);
    }
    /*
    if (args == "") {
      win.webContents.send('bwdbversion', [json1]);
    } else {
      aboutWindow.webContents.send('bwdbversion', [json1]);
    }
    */
    //console.log('message sent.');
    db.close();
  });
});


ipcMain.on('getauthorlist', (event, args) => {
  //console.log('getbwdbversion is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT Name FROM Version");
    contents = db.exec("SELECT Name FROM Contributor");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [];
      for (var j = 0; j < arr[i].length; j++) {
        //console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    //console.log(arr_sys);
    var json1 = JSON.stringify(arr_sys);
    //console.log([json1]);
    if (args == "") {
      win.webContents.send('authorlist', [json1]);
    } else {
      authorwindow.webContents.send('authorlist', [json1]);
    }

    //console.log('message sent.');
    db.close();
  });
});
ipcMain.on('getbuildinfo', (event, args) => {
  //console.log('getbuildinfo is captured.args:'+args);
  initSqlJs().then(SQL => {
    // 创建数据库
    db = new SQL.Database(data);
    // 运行查询而不读取结果
    //console.log("SELECT ID,Stage,Version,Buildtag,Architecture,Edition,Language,Date,Serial,Notes,NotesEN FROM Build where ProductID="+args[0]+" and ID="+args[1]+" ORDER BY ID");
    contents = db.exec("SELECT ID,Stage,Version,Architecture,Edition,Language,Buildtag,Date,Serial,Notes,NotesEN,CodeName FROM Build where ProductID=" + args[0] + " and ID=" + args[1] + " ORDER BY ID");
    arr = contents[0].values;
    arr_sys = [];
    arr_sys1 = [];
    ////console.log(contents);
    //console.log(arr);
    //console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {
      arr_sys1 = [];
      for (var j = 0; j < arr[i].length; j++) {
        //console.log(arr[i][j]);
        arr_sys1.push(arr[i][j]);
      };
      arr_sys.push(arr_sys1);
    };
    //console.log(arr_sys);
    var json1 = JSON.stringify(arr_sys);
    //console.log([args[0],args[1],json1]);
    win.webContents.send('buildinfo', [args[0], args[1], json1]);
    //console.log('message sent.');
    db.close();
  });
});
ipcMain.on('gallerylist', (event, args) => {
  gallerywindow.webContents.send('picjson', picjson);
});
ipcMain.on('opengallery', (event, args) => {
  creategalleryWindow();
  picjson = args;
});
ipcMain.on('openabout', (event, args) => {
  createAboutWindow();
});
ipcMain.on('openauthor', (event, args) => {
  aboutWindow.close();
  createAuthorWindow();

});
ipcMain.on('openmanagesetting', (event, args) => {
  createManageSettingWindow();

});
ipcMain.on('openlangsetting', (event, args) => {
  createLangSettingWindow();

});
ipcMain.on('openhashwindow', (event, args) => {
  createHashSettingWindow();
  if(args=="w"){
    flaghash=1;
  }
});
ipcMain.on('closeabout', (event, args) => {
  aboutWindow.close();
});
ipcMain.on('closegallery', (event, args) => {
  try {
    gallerywindow.close();
  } catch {
    return -1;
  }

});
ipcMain.on('closeworker', (event, args) => {
  try {
    workerwindow.close();
  } catch {
    return -1;
  }

});
//管理界面的IPC部分
ipcMain.on('editbuild', (event, args) => {
  var s = args;
  console.log(s);
  var p = new Promise(resolve => {
    //查询ID是否存在
    proid = args[0];
    buildid = args[1];
    proname = args[13];
    codename = args[12];
    console.log("proid:" + proid);
    if (proid == -1) {
      return new Promise(resolve => {
        initSqlJs().then(SQL => {
          // 创建数据库
          db = new SQL.Database(data);
          //db.run('BEGIN;');
          console.log("insert into 'Product' values (null, '" + proname + "', '" + codename + "');");
          db.run("insert into 'Product' values (null, '" + proname + "', '" + codename + "');");
          //db.run('COMMIT;');
          data = db.export();
          console.log("SELECT ID from 'Product' where Name='" + proname + "'");
          contents = db.exec("SELECT ID from 'Product' where Name='" + proname + "'");
          arr = contents[0].values;
          try {
            resolve(arr[0][0]);
          } catch {
            throw new Error('create product error');
          }
        })
      }).then(val => {
        resolve(val);
      });

    } else {
      return new Promise(resolve => {
        console.log("proidA:" + proid);
        initSqlJs().then(SQL => {
          // 创建数据库
          db = new SQL.Database(data);
          contents = db.exec("SELECT ID,CodeName from 'Product' where ID=" + proid + "");
          arr = contents[0].values;
          try {
            x = arr[0][1];
            x1 = x.split(",");
            if (x1.indexOf(codename) == -1) {
              if (x1[0] != "") {
                x1.push(codename);
              } else {
                x1[0] = codename;
              }
              x2 = x1.join();
              sql = `UPDATE 'Product' SET CodeName = '${x2}' WHERE ID=${proid}`;
              console.log(sql);
              db.run(sql);
            }
            resolve(arr[0][0]);
          } catch {
            throw new Error('product invild');
          }
        })
      }).then(val => {
        resolve(val);
      });
    }
  }).then(val => {
    //检验产品是否存在
    proid = val;
    //防止ID传错
    if (proid != args[0] && args[0] != -1) {
      throw new Error('invild pro id');
    }
    if (buildid == -1) {
      return new Promise(resolve => {
        initSqlJs().then(SQL => {
          // 创建数据库
          db = new SQL.Database(data);
          contents_version = db.exec("SELECT * FROM Version");
          arr_version = contents_version[0].values;
          dbversion = arr_version[0][0];
          db.exec("insert into 'Build' values (null, " + proid + ", '" + args[2] + "', '" + args[3] + "', '" + args[4] + "', '" + args[5] + "', '" + args[8] + "', '" + args[9] + "', '" + args[6] + "', '" + args[7] + "', '" + args[10].myReplace("'", "''") + "', '" + args[11].myReplace("'", "''") + "','" + args[12].myReplace("'", "''") + "');");
          contents = db.exec("select ID from Build where Version='" + args[2] + "' and Stage='" + args[3] + "' and BuildTag='" + args[4] + "' and ProductID=" + proid);
          arr = contents[0].values;
          db.run("insert into ChangeLog values ('" + dbversion + "'," + arr[0][0] + ")");
          data = db.export();
          try {
            resolve(arr[0][0]);
          } catch {
            throw new Error('product invild');
          }
        });
      }).then(val => {
        buildid = val;
        return (val);
      });
      //如果Build不存在

    } else {
      //如果存在
      return new Promise(resolve => {
        console.log("proidV:" + proid);
        initSqlJs().then(SQL => {
          update_list = ['Version', 'Stage', 'BuildTag', 'Architecture', 'Date', 'Serial', 'Edition', 'Language', 'Notes', 'NotesEN', 'CodeName'];
          contents_version = db.exec("SELECT * FROM Version");
          arr_version = contents_version[0].values;
          dbversion = arr_version[0][0];
          sql = `UPDATE 'Build' SET ProductID = '${proid}' WHERE ID=${buildid}`;
          db.exec(sql);
          for (let i = 0; i < update_list.length; i++) {
            db.run('BEGIN;');
            l = args[i + 2];
            l = l.toString().replace("'", "''");
            if (l == "") {
              l = "N/A";
            }
            console.log(l);
            sql = `UPDATE 'Build' SET ${update_list[i]} = '${l}' WHERE ID=${buildid}`;
            //dialog.showErrorBox('发生致命错误', sql);
            console.log(sql);
            db.run(sql);
            db.run('COMMIT;');
          }
          db.run("insert into ChangeLog values ('" + dbversion + "'," + buildid + ")");
          //dialog.showErrorBox('发生致命错误', '1');
          data = db.export();
          //dialog.showErrorBox('发生致命错误', '2');
          resolve(buildid);
        });
      }).then(val => {
        return (val);
      });

    }
  }).then(val => {
    var buffer = Buffer.from(data, 'binary');
    // 被创建数据库名称
    var filename = i18n.join_path('DataBase.db');
    fs.writeFileSync(filename, buffer);
    win.webContents.send('newbuildid', [proid, buildid]);
  }).catch(err => {
    console.log(err);
  })
});
ipcMain.on('deletebuild', (event, args) => {
  //todo
  //先删除build 如果productid存在且数量为0，也删除，同时删除changelog里面的。
  console.log(args);
  return new Promise(resolve => {
    initSqlJs().then(SQL => {
      proid = args[0];
      buildid = args[1];
      db = new SQL.Database(data);
      db.run("delete from Build Where ID=" + buildid);
      db.run("delete from ChangeLog Where BuildID=" + buildid);
      contents = db.exec("select count(*) as c from Build Where ProductID=" + proid);
      arr = contents[0].values;
      count = arr[0][0];
      if (count == 0) {
        db.run("delete from Product Where ID=" + proid);
      }
      data = db.export();
      resolve(0);
    });
  }).then(val => {
    var buffer = Buffer.from(data, 'binary');
    // 被创建数据库名称
    var filename = i18n.join_path('DataBase.db');
    fs.writeFileSync(filename, buffer);
    try {
      fs.unlinkSync(process.cwd() + "/gallery/" + args[1] + ".zip");
    } catch {
      console.log('screenshot file invild!');
    }
    win.webContents.send('delbuildid', [1, 1]);
  }).catch(err => {
    console.log(err);
  });
});
ipcMain.on('cleanchangelog', (event, args) => {
  console.log(args);
  return new Promise(resolve => {
    initSqlJs().then(SQL => {
      db = new SQL.Database(data);
      db.run("delete from ChangeLog");
      resolve(0);
    });
  }).then(val => {
    var buffer = Buffer.from(data, 'binary');
    // 被创建数据库名称
    var filename = i18n.join_path('DataBase.db');
    fs.writeFileSync(filename, buffer);
    if (os.platform == "win32") {
      dialog.showMessageBoxSync({
        type: 'info',
        title: i18n.convert_dymstrlist_to_string("清除Changelog完成", i18n.get_lang_now(), 'main.js'),
        message: i18n.convert_dymstrlist_to_string("清除Changelog完成!", i18n.get_lang_now(), 'main.js')
      });
    } else {
      dialog.showMessageBoxSync({
        type: 'info',
        title: i18n.convert_dymstrlist_to_string("清除Changelog完成", i18n.get_lang_now(), 'main.js'),
        message: i18n.convert_dymstrlist_to_string("清除Changelog完成!", i18n.get_lang_now(), 'main.js'),
        buttons: ['OK']
      });
    }
  }).catch(err => {
    console.log(err);
  });
});
ipcMain.on('changeversion', (event, args) => {
  console.log(args);
  return new Promise(resolve => {
    initSqlJs().then(SQL => {
      db = new SQL.Database(data);
      //db.run("delete from ChangeLog");
      db.run("update Version set Version='" + args[0] + "'");
      db.run("update Version set Date='" + args[1] + "'");
      db.run("update Version set UpdateURL='" + args[2] + "'");
      switch (dialog.showMessageBoxSync({ type: 'question', title: i18n.convert_dymstrlist_to_string('Changelog的处理', i18n.get_lang_now(), 'main.js'), message: i18n.convert_dymstrlist_to_string("版本号已经被更改，请选择Changelog的处理方式：", i18n.get_lang_now(), 'main.js'), buttons: [i18n.convert_dymstrlist_to_string('清空Changelog', i18n.get_lang_now(), 'main.js'), i18n.convert_dymstrlist_to_string('更改Changelog中所有条目的版本（推荐）', i18n.get_lang_now(), 'main.js'), i18n.convert_dymstrlist_to_string('不做任何处理', i18n.get_lang_now(), 'main.js')] })) {
        case 0:
          db.run("delete from ChangeLog");
          break;
        case 1:
          db.run("update ChangeLog Set Version='" + args[0] + "'");
          break;
      }
      data = db.export();
      resolve(0);
    });
  }).then(val => {
    var buffer = Buffer.from(data, 'binary');
    // 被创建数据库名称
    var filename = i18n.join_path('DataBase.db');
    fs.writeFileSync(filename, buffer);
    if (os.platform == "win32") {
      dialog.showMessageBoxSync({
        type: 'info',
        title: i18n.convert_dymstrlist_to_string("数据库版本修改完成", i18n.get_lang_now(), 'main.js'),
        message: i18n.convert_dymstrlist_to_string("数据库版本修改完成!", i18n.get_lang_now(), 'main.js')
      });
    } else {
      dialog.showMessageBoxSync({
        type: 'info',
        title: i18n.convert_dymstrlist_to_string("数据库版本修改完成", i18n.get_lang_now(), 'main.js'),
        message: i18n.convert_dymstrlist_to_string("数据库版本修改完成!", i18n.get_lang_now(), 'main.js'),
        buttons: ['OK']
      });
    }

    settingwindow.close();
  }).catch(err => {
    console.log(err);
  });
});
ipcMain.on('refreshwindow', (event, args) => {
  win.reload();
  if (gallerywindow != null) {
    gallerywindow.reload();
  }
  if (settingwindow != null) {
    settingwindow.reload();
  }
  langwindow.close();

});
ipcMain.on('reload', (event, args) => {
  console.log(args);
  if (args == "manage") {
    app.relaunch({ args: [".", "--manage"] })
    app.exit(0)
  }
  if (args == "view") {
    app.relaunch({ args: ["."] })
    app.exit(0)
  }
});
ipcMain.on('msgfoward', (event, args) => {
  //win.webContents.send('log',args);
  if(args.obj=="win"){
     win.webContents.send('log',args);
  }
  if(args.obj=="hash"){
    hashwindow.webContents.send('log',args);
 }
});
ipcMain.on('getsha256list', (event, args) => {
  workerwindow = new BrowserWindow({
    minHeight: 300,
    minWidth: 600,
    width: 900,
    height: 600,
    show:false,
    webPreferences: {
      nodeIntegration: true,
      directWrite: false
    }
  });
  if (!app.isPackaged) {
    workerwindow.webContents.openDevTools();
    workerwindow.show();
  }
  // 并且为你的应用加载index.html
  workerwindow.loadFile('worker.html');
  workerwindow.on("close", function () {
    workerwindow = null;
  });
});
