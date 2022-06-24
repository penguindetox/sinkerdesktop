const isDev = require('electron-is-dev');

function getIsDev(){
    return isDev;
}

module.exports = {
    getIsDev
}