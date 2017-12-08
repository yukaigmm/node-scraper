const Horseman = require("node-horseman");
const path = require("path");

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
        let agreeSelector = loginInfo["agree_css_selector"];
        let waitforAgreeSelector = loginInfo["waitfor_agree_selector"]
        horseman = 
        horseman
          .cookies([])
          .userAgent(agent)
          .open(LoginUrl)
          // 有的网站会跳转到同意条款的页面，因此需要判断是否有这样的页面
          if(agreeSelector){
            horseman = horseman.click(agreeSelector)
              .waitForSelector(waitforAgreeSelector,{
                timeout:5000
              })
              .openTab(LoginUrl)
          }
          horseman
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
          .catch((err)=>{
            reject(err);
          })
  })
}
let getCookieString = (cookieArr)=>{
  // let str = '';
  // for(let item of cookieArr){
  //     str += (str ? '; ' : '') + item.name + '=' + item.value
  // }
  // return str;
  return cookieArr.map(item => `${item.name}=${item.value}`).join(';');
}
module.exports = login;