const config = require('./config.js');
// const saveData = require('../data-saver/save-data.js')
// let siteConfig = config['douban'];

// 定义生成单个配置的函数
let makeConfig = ({
    layerConfig,
    layerOrder,
    pageContent,
    pageData,
    pageOrder,
    header,
    charset,
    exception=''
}) => {
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
let maxPage;

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
            if (config[inputConfig] && config[inputConfig]['login']) {
                loginFlag = true;
            } else {
                loginFlag = false;
            }
        }
        currentConfigObj = undefined;
        for(let i = configArray.length - 1; i >= 0; i--){
            if(configArray[i].length){
                currentConfigObj = configArray[i].shift();
                break;
            }
        }
        // currentConfigObj = configArray.shift();
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

// 输出网站初始配置
let makeOriginConfig = (siteName) => {
    currentSiteCofig = config[siteName];
    currentLayerArray = currentSiteCofig['layers'];
    charset = currentSiteCofig['charset'] ? currentSiteCofig['charset'] : 'utf-8';
    currentRequestHeader = currentSiteCofig['header'];
    configArray[0] = [];
    configArray[0].push(makeConfig({
        layerConfig:currentLayerArray[0],
        layerOrder:0,
        pageContent:'',
        pageData:{},
        pageOrder: 1,
        header:currentRequestHeader,
        charset:charset,
    }));
}

// 下一级（下一层或是下一页）的配置
let makeNextConfig = (configObj) => {
    let layerConfig = configObj.layerConfig;
    let layerOrder = +(configObj.layerOrder);
    let pageData = configObj.pageData;
    // console.log(pageData[0]['pagination'+layerOrder])
    let pageOrder = configObj.pageOrder;
    if (currentLayerArray[layerOrder + 1]) {
        if(!configArray[layerOrder+1]){
            configArray[layerOrder+1] = [];
        }
        let tempArr = makeNextLayerConfig(layerConfig, pageData, layerOrder);
        configArray[layerOrder+1].push(...tempArr);
    }
    if (layerConfig['pagination'] && pageData[0]['pagination'+layerOrder] > pageOrder) {
        configArray[layerOrder].unshift(makeNextPageConfig(layerConfig, layerOrder, pageOrder, pageData))
    }
}
// 下一层的配置
let makeNextLayerConfig = (layerConfig, pageData, layerOrder) => {
    let nextLayerConfigArr = [];
    let nextLayerConfig = currentLayerArray[layerOrder + 1];
    let url;
    for (let data of pageData) {
        if (nextLayerConfig.request_type == "post") {
            let keywords = nextLayerConfig.keywords
            for (let key in keywords) {
                nextLayerConfig.params[key] = data[keywords[key]];
            }
        } else {
            url = data[layerConfig.rules.next_layer_url];
            nextLayerConfig['url'] = url;
        }
        let nextLayerConfigObj = makeConfig({
            layerConfig:nextLayerConfig,
            layerOrder:layerOrder + 1,
            pageContent:'',
            pageData:data,
            pageOrder:0,
            header:currentRequestHeader,
            charset:charset,
            
        })
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
    console.log("第"+pageOrder+"页")
    // console.log(pageData[0])
    let offset = paginationRules['step'] * pageOrder;
    let keyword = paginationRules['keyword'];
    layerConfig['url'] = baseUrl + keyword + offset;
    // 继续使用上一页的pageData中的第0个对象的属性，否则会丢失从上一层继承下来的属性
    return makeConfig({
        layerConfig:layerConfig,
        layerOrder:layerOrder,
        pageContent:"",
        pageData:pageData[0],
        pageOrder:pageOrder,
        header:currentRequestHeader,
        charset:charset,
        
    })
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