const libxml = require('libxmljs');

// 解析入口
const parsePage = (configObj) => {
    // 解析配置
    let layerConfig = configObj.layerConfig;
    let pageContent = configObj.pageContent;
    let rowsRule = layerConfig.rules.rows;
    let colsRule = layerConfig.rules.columns;
    let prePageData = JSON.parse(JSON.stringify(configObj.pageData));
    // console.log(prePageData)

    if (layerConfig.rules.type == "html") {
        // console.log("-----------------")
        configObj.pageData = getHtmlData(pageContent, rowsRule, colsRule,prePageData);
    } else if (layerConfig.rules.type == "json") {
        configObj.pageData = getJsonData(pageContent, rowsRule, colsRule,prePageData)
    }
    configObj.pageContent = '';
    return configObj;
}
// 解析html
let getHtmlData = (pageContent, rowsRule, colsRule,prePageData) => {
    let doc = libxml.parseHtml(pageContent);
    let rowsLen = doc.find(rowsRule).length;
    // console.log(rowsLen);
    // console.log(rowsRule)
    let pageData = [];
    for (let i = 1; i <= rowsLen; i++) {
        getHtmlColData(rowsRule,colsRule,doc,i,prePageData);

        // Object.assign()的参数，有相同属性时，后面对象属性值覆盖前面的
        data = JSON.parse(JSON.stringify(Object.assign({},prePageData)));
        // console.log(data);
        pageData.push(data);
    }
    return pageData;
}
// 解析获取每一条数据
let getHtmlColData = (rowsRule,colsRule,doc,i,prePageData)=>{
    if(!prePageData['diff_word']){
        prePageData['diff_word'] = [];
    }
    for (let colRule of colsRule) {
        // 判断rule是否需要拼接
        let fullRule = colRule.absolute == true?colRule.rule:rowsRule + "[" + i + "]" + colRule.rule;
        // console.log(fullRule);
        let dataElement = doc.get(fullRule);
        if (colRule.rule_value_type == "attribute") {
            getAttr(prePageData, colRule, dataElement);
        } else if (colRule.rule_value_type == "text" && dataElement) {
            prePageData[colRule.name] = dataElement.text() ? dataElement.text() : colRule.default_value;
        }
        // console.log(prePageData)
        // 设置录入数据库时查询数据是否重复的字段
        // console.log(prePageData['diff_word'])
        if(colRule.diff_word == true && !(prePageData['diff_word'].includes(colRule.name))){
            prePageData['diff_word'].push(colRule.name);
        }
    }
}



// 解析json
let getJsonData = (pageContent, rowsRule, colsRule,prePageData) => {
    let rowsArr;
    if(rowsRule){
        rowsArr = JSON.parse(pageContent)[rowsRule];
    }else{
        rowsArr = JSON.parse(pageContent)
    }
    let rowsLen = rowsArr.length;
    let pageData = [];
    for (let i = 0; i < rowsLen; i++) {
        if(!prePageData['diff_word']){
            prePageData['diff_word'] = [];
        }
        for (let colRule of colsRule) {
            prePageData[colRule.name] = colRule.base_url ? colRule.base_url + rowsArr[i][colRule.rule] : rowsArr[i][colRule.rule];
            if(colRule.diff_word == true && !(prePageData['diff_word'].includes(colRule.name))){
                prePageData['diff_word'].push(colRule.name);
            }
        }
        // console.log(prePageData['diff_word'])
        data = JSON.parse(JSON.stringify(Object.assign({},prePageData)));
        pageData.push(data)
    }
    return pageData;
}


// 获取元素属性值
let getAttr = (data, colRule, dataElement) => {
    if (dataElement && dataElement.value()) {
        data[colRule.name] = colRule.base_url ? getAbsUrl(colRule.base_url, dataElement.value()) : dataElement.value();
    } else {
        data[colRule.name] = ''
    }
}
// 将相对路径的链接转化为绝对路径
let getAbsUrl = (baseUrl, url) => {
    url = url.replace(/\.\.\//g, '');
    return baseUrl + url;
}
module.exports = parsePage;