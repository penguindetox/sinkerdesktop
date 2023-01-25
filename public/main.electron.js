const { default: axios } = require('axios');
const {app,BrowserWindow, ipcRenderer, ipcMain, desktopCapturer} = require('electron');

const isDev = require('electron-is-dev');
const path = require('path');

app.disableHardwareAcceleration();
//const { setRPCListeners } = require('./electron/discordrpc');

async function createWindow(){
    const splashWindow = new BrowserWindow({
        'width':300,
        'height':300,
        'maxHeight':300,
        'maxWidth':300,
        minWidth:299,
        minHeight:299,
        frame:false,
        alwaysOnTop:true
    })
    const mainWindow = new BrowserWindow({
        'width':1280,
        'height':720,
        show:false,
        webPreferences:{
            nodeIntegration:true,
            nodeIntegrationInWorker:true,
            preload:`${__dirname}/electron/preload.js`
        }
    });

    splashWindow.loadFile(__dirname +"/electron/loading.html");
    mainWindow.loadURL(isDev ?
            'http://localhost:3000' :
            `file://${path.join(__dirname,'../build/index.html')}`
        )

    
    mainWindow.setContentProtection(true);

    var res = await axios.get("https://phantomchatapp.herokuapp.com/api/alpha/ping").catch(e => {console.log(e); return false});
    if(res && res.data){

        splashWindow.destroy();
        mainWindow.show();
    }

    
}

app.whenReady().then(() =>{
    createWindow();
    //setRPCListeners();
})

app.on('quit',() =>{
    
})