const config = require('./config.js');
const makeOriginConfig = require('./make-origin-config.js');
const makeNextConfig = require('./make-next-config.js');
// const saveData = require('../data-saver/save-data.js')
// let siteConfig = config['douban'];

// 定义生成单个配置的函数

let configArray = [];
let currentSite;
let currentRequestHeader;
let currentLayerArray;
let charset;
let cookie;
let currentSiteName;
let currentConfigObj;
let loginFlag = false;
let maxPage;
let currentSiteConfig;

// 根据配置输出configObj
let makeConfigObj = (inputConfig, scraperOrder) => {
    return new Promise((resolve, reject) => {
        if (inputConfig.pageData != undefined) {
            makeNextConfig(inputConfig,currentSiteConfig,configArray);
        } else if (inputConfig == 'nextConfig') {
            console.log('正在进行下一次配置')
        } else {
            currentSiteName = inputConfig;
            currentSiteConfig = config[currentSiteName];
            makeOriginConfig(currentSiteConfig,configArray);
            if (config[currentSiteName] && config[currentSiteName]['login']) {
                loginFlag = true;
            } else {
                loginFlag = false;
            }
        }

        // 从最后面的数组开始返回配置对象，以保证队列的长度不至于太长
        currentConfigObj = undefined;
        for(let i = configArray.length - 1; i >= 0; i--){
            if(configArray[i].length){
                currentConfigObj = configArray[i].shift();
                break;
            }
        }
        // 根据登录信息判断是否增加请求头内容
        if (loginFlag && currentConfigObj) {
            addLoginHeader(resolve, scraperOrder);
        } else {
            // setTimeout(() => {
            resolve(currentConfigObj)
            // }, 5000);
        }
    })
}
//  登录情况配置请求头
let addLoginHeader = (resolve, scraperOrder) => {
    if (scraperOrder % 5 == 0) {
        let login = require('../login/login.js');
        login(config[currentSiteName]['login']).then((cookieStr) => {
            currentConfigObj['header']['cookie'] = cookieStr;
            currentRequestHeader = JSON.parse(JSON.stringify(currentConfigObj['header']))
            // setTimeout(() => {
            resolve(currentConfigObj)
            // }, 5000);
        })
    } else {
        currentConfigObj['header'] = JSON.parse(JSON.stringify(currentRequestHeader));
        // setTimeout(() => {
        resolve(currentConfigObj)
        // }, 5000);
    }
}
module.exports = makeConfigObj;