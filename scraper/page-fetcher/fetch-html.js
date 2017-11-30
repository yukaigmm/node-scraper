const superagent = require('superagent');
require('superagent-charset')(superagent);
// 请求页面数据
let fetchHtml = (configObj) => {
    return new Promise((resolve, reject) => {
        let url = configObj.layerConfig.url;
        let header = configObj.header;
        let charset = configObj.charset;
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
                    // console.log(res)
                    configObj.pageContent = res.text;
                    resolve(configObj);
                }
            })
    })
};


module.exports = fetchHtml;