const superagent = require('superagent');
require('superagent-charset')(superagent);
// 请求页面数据
let fetchHtml = (configObj) => {
    return new Promise((resolve, reject) => {
        let url = configObj.layerConfig.url;
        let header = configObj.header;
        let charset = configObj.charset;
        let params;
        if (configObj.layerConfig.request_type == "post") {
            let params = configObj.layerConfig.params;
            // console.log(url);
            // console.log(header);
            // console.log(charset);
            console.log(params);
            superagent
                .post(url)
                .set(header)
                .charset(charset)
                .send(params)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        if (res && res.text) {
                            configObj.pageContent = res.text;
                            resolve(configObj);
                        } else {
                            reject("获取页面内容为空" + res)
                        }
                    }
                })
        } else {
            superagent
                .get(url)
                .set(header)
                .charset(charset)
                // .timeout({
                //     response: 5000,
                //     deadline: 60000
                // })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        if (res && res.text) {
                            configObj.pageContent = res.text;
                            resolve(configObj);
                        } else {
                            reject("获取页面内容为空" + res)
                        }
                    }
                })
        }


    })
};


module.exports = fetchHtml;