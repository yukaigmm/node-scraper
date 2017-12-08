const makeConfig = require("./make-config.js");

// 输出网站初始配置
let makeOriginConfig = (currentSiteConfig,configArray) => {
    let currentLayerArray = currentSiteConfig['layers'];
    let charset = currentSiteConfig['charset'] ? currentSiteConfig['charset'] : 'utf-8';
    let currentRequestHeader = currentSiteConfig['header'];
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

module.exports = makeOriginConfig;