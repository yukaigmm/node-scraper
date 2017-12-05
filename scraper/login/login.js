const Horseman = require("node-horseman");

let horseman = new Horseman();
// 获取登录网站的cookie，放在requestHeader中
let count = 0;
let login = (loginInfo) => {
    return new Promise((resolve, reject) => {
        count++;
        if(count == loginInfo["login_pass"].length){
            count = 0;
        }
        let agent = loginInfo['agent'];
        let LoginUrl = loginInfo['url'];
        let username = loginInfo["login_pass"][count]['username'];
        let password = loginInfo["login_pass"][count]['password'];
        let usernameSelector = loginInfo['username_css_selector'];
        let passwordSelector = loginInfo['password_css_selector'];
        let submitSelector = loginInfo['submit_css_selector'];
        let waitforSelector = loginInfo['waitfor_css_selector'];

        horseman
            .userAgent(agent)
            .open(LoginUrl)
            .type(usernameSelector, username)
            .type(passwordSelector, password)
            .click(submitSelector)
            .waitForSelector(waitforSelector, {
                timeout: 5000
            })
            .cookies()
            .log()
            .then((cookie) => {
                resolve(getCookieString(cookie));
            })
            // .close()
            .catch((err)=>{
                reject(err);
            })
    })
}
let getCookieString = (cookieArr)=>{
    let str = '';
    for(let item of cookieArr){
        str += (str ? '; ' : '') + item.name + '=' + item.value
    }
    return str;
}
module.exports = login;