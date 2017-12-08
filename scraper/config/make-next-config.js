const makeConfig = require("./make-config.js");

// 下一级（下一层或是下一页）的配置
let makeNextConfig = (configObj, currentSiteConfig, configArray) => {
    let layerConfig = configObj.layerConfig;
    let layerOrder = +(configObj.layerOrder);
    let pageData = configObj.pageData;
    let pageOrder = configObj.pageOrder;
    let currentLayerArray = currentSiteConfig['layers']
    // let currentRequestHeader = currentSiteConfig['header'];
    if (currentLayerArray[layerOrder + 1]) {
        if (!configArray[layerOrder + 1]) {
            configArray[layerOrder + 1] = [];
        }
        let tempArr = makeNextLayerConfig(configObj, currentSiteConfig);
        configArray[layerOrder + 1].push(...tempArr);
    }
    if (layerConfig['pagination'] && pageData[0]['pagination' + layerOrder] > pageOrder) {
        configArray[layerOrder].unshift(makeNextPageConfig(configObj, currentSiteConfig))
    }
}
// 下一层的配置
let makeNextLayerConfig = (configObj, currentSiteConfig) => {
    let layerConfig = configObj.layerConfig;
    let layerOrder = +(configObj.layerOrder);
    let nextLayerConfigArr = [];
    let nextLayerConfig = currentSiteConfig['layers'][layerOrder + 1];
    let url;
    for (let data of configObj.pageData) {
        if (nextLayerConfig.request_type == "post") {
            makePostParams(nextLayerConfig,data);
        } else if (nextLayerConfig.request_type == "get") {
            makeGetUrl(url,nextLayerConfig,data);
        }
        let nextLayerConfigObj = makeConfig({
            layerConfig: nextLayerConfig,
            layerOrder: layerOrder + 1,
            pageContent: '',
            pageData: data,
            pageOrder: 0,
            header: currentSiteConfig['header'],
            charset: currentSiteConfig['charset'] || 'utf-8',
        })
        nextLayerConfigArr.push(JSON.parse(JSON.stringify(nextLayerConfigObj)));
    }
    return nextLayerConfigArr;
}
// 分页的下一页的配置
let makeNextPageConfig = (configObj, currentSiteConfig) => {
    let layerConfig = configObj.layerConfig;
    let pageOrder = configObj.pageOrder;
    let paginationRules = layerConfig['pagination']['rules'];
    let baseUrl = getPageUrl(layerConfig['url']);
    pageOrder++;
    console.log("第" + pageOrder + "页")
    let offset = paginationRules['step'] * pageOrder;
    let keyword = paginationRules['keyword'];
    layerConfig['url'] = baseUrl + keyword + offset;
    // 继续使用上一页的pageData中的第0个对象的属性，否则会丢失从上一层继承下来的属性
    return makeConfig({
        layerConfig: layerConfig,
        layerOrder: configObj.layerOrder,
        pageContent: "",
        pageData: configObj.pageData[0],
        pageOrder: pageOrder,
        header: currentSiteConfig['header'],
        charset: currentSiteConfig['charset'] || 'utf-8',
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

let makeGetUrl = (url,nextLayerConfig,data)=>{
    let splitArr = JSON.parse(JSON.stringify(nextLayerConfig.url_split))
    for (let i = 0; i < splitArr.length; i++) {
        if (splitArr[i] && data[splitArr[i]]) {
            splitArr[i] = data[splitArr[i]]
        }
    }
    url = nextLayerConfig.base_url;
    url += splitArr.join('');
    let queryString = '';
    for (let key in nextLayerConfig.params) {
        queryString += key + '=' + nextLayerConfig.params[key] + "&"
    }
    if (queryString) {
        url += "?" + queryString
    }
    url = url.replace(/\.\.\//g, '');
    nextLayerConfig['url'] =url;
}
let makePostParams = (nextLayerConfig,data)=>{
    let keywords = nextLayerConfig.keywords
    for (let key in keywords) {
        nextLayerConfig.params[key] = data[keywords[key]];
    }
}
// 将相对路径的链接转化为绝对路径
// let getAbsUrl = (baseUrl, url) => {
//     url = url.replace(/\.\.\//g, '');
//     return baseUrl + url;
//   }
module.exports = makeNextConfig;