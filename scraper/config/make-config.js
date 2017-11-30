const config = require('./config.js');
// const saveData = require('../data-saver/save-data.js')
// let siteConfig = config['douban'];

// 定义生成单个配置的函数
let makeConfig = (layerConfig, layerOrder, pageContent, pageData, pageOrder, header, charset, exception) => {
    return {
        layerConfig,
        layerOrder,
        pageContent,
        pageData,
        pageOrder,
        header,
        charset,
        exception
    }
}
let configArray = [];
let currentSite;
let currentRequestHeader;
let currentLayerArray;
let charset;
let cookie;
// let currentSiteName;
let currentConfigObj;
let loginFlag = false;

// 根据配置输出configObj
let makeConfigObj = (inputConfig, scraperOrder) => {
    return new Promise((resolve, reject) => {
        if (inputConfig.pageData != undefined) {
            makeNextConfig(inputConfig);
        } else if (inputConfig == 'nextConfig') {
            console.log('正在进行下一次配置')
        } else {
            currentSiteName = inputConfig;
            makeOriginConfig(currentSiteName);
            if(config[inputConfig] && config[inputConfig]['login']){
                loginFlag = true;
            }else{
                loginFlag = false;
            }
        }
        currentConfigObj = configArray.shift();
        if(loginFlag && currentConfigObj){
           addLoginHeader(resolve,scraperOrder);
        }else{
            // setTimeout(() => {
                resolve(currentConfigObj)
            // }, 5000);
        }
    })
}
//  登录情况配置请求头
let addLoginHeader = (resolve,scraperOrder)=>{
    if (scraperOrder % 5 == 0) {
        let login = require('../login/login.js');
        login(config[currentSiteName]['login']).then((cookieStr) => {
            currentConfigObj['header']['cookie'] = cookieStr;
            currentRequestHeader = JSON.parse(JSON.stringify(currentConfigObj['header']))
            // setTimeout(() => {
                resolve(currentConfigObj)
            // }, 5000);
        })
    }else{
        currentConfigObj['header'] = JSON.parse(JSON.stringify(currentRequestHeader));
        // setTimeout(() => {
            resolve(currentConfigObj)
        // }, 5000);
    }
}

// 输出网站初始配置
let makeOriginConfig = (siteName) => {
    currentSiteCofig = config[siteName];
    currentLayerArray = currentSiteCofig['layers'];
    charset = currentSiteCofig['charset'] ? currentSiteCofig['charset'] : 'utf-8';
    currentRequestHeader = currentSiteCofig['header'];
    configArray.push(makeConfig(currentLayerArray[0], 0, '', {}, 1, currentRequestHeader, charset));
}

// 下一级（下一层或是下一页）的配置
let makeNextConfig = (configObj) => {
    let layerConfig = configObj.layerConfig;
    let layerOrder = +(configObj.layerOrder);
    let pageData = configObj.pageData;
    let pageOrder = configObj.pageOrder;
    if (currentLayerArray[layerOrder + 1]) {
        let tempArr = makeNextLayerConfig(layerConfig, pageData, layerOrder);
        configArray.unshift(...tempArr);
    }
    if (layerConfig['pagination'] && layerConfig['pagination']['end'] > pageOrder) {
        configArray.push(makeNextPageConfig(layerConfig, layerOrder, pageOrder, pageData))
    }
}
// 下一层的配置
let makeNextLayerConfig = (layerConfig, pageData, layerOrder) => {
    let nextLayerConfigArr = [];
    for (let data of pageData) {
        let url = data[layerConfig.rules.next_layer_url];
        let nextLayerConfig = currentLayerArray[layerOrder + 1];
        nextLayerConfig['url'] = url;
        let nextLayerConfigObj = makeConfig(nextLayerConfig, layerOrder + 1, '', data, 0, currentRequestHeader, charset)
        nextLayerConfigArr.push(JSON.parse(JSON.stringify(nextLayerConfigObj)));
    }
    return nextLayerConfigArr;
}
// 分页的下一页的配置
let makeNextPageConfig = (layerConfig, layerOrder, pageOrder, pageData) => {
    let paginationRules = layerConfig['pagination']['rules'];
    let baseUrl = getPageUrl(layerConfig['url']);
    // console.log(pageOrder);
    pageOrder++;
    let offset = paginationRules['step'] * pageOrder;
    let keyword = paginationRules['keyword'];
    layerConfig['url'] = baseUrl + keyword + offset;
    // 继续使用上一页的pageData中的第0个对象的属性，否则会丢失从上一层继承下来的属性
    return makeConfig(layerConfig, layerOrder, '', pageData[0], pageOrder, currentRequestHeader, charset)
}

// 获取分页的每一页baseUrl
let getPageUrl = (url) => {
    let index = url.indexOf('&');
    if (index != -1) {
        url = url.slice(0, index);
    }
    return url;
}
module.exports = makeConfigObj;