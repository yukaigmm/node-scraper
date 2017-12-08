const config = require('./config/config.js');
const makeConfigObj = require('./config/make-config-obj.js');
const fetchHtml = require('./page-fetcher/fetch-html.js');
const parsePage = require('./page-parser/parse-page.js');
const saveData = require('./data-saver/save-data.js');
// const schedule = require("node-schedule");
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mysql'
});

let siteName = 'jiahefund';
let configObj;

let scraperOrder = 0;

// let j = schedule.scheduleJob('0 * * * * *',()=>{
//     console.log("success");
//     getStart();
// })
// 循环爬取数据的控制器
let cycleScraper = (obj) => {
  fetchHtml(obj).then((res) => {
    saveData(parsePage(res),connection).then((configObj)=>{
      scraperOrder++;
      // console.log(configObj);
      console.log(scraperOrder);
       makeConfigObj(configObj,scraperOrder).then((configObj)=>{
        whetherSiteEnd(configObj);
      });
    });
  }, (err) => {
    // 请求页面数据错误，则使用下一个配置继续请求
    console.log('请求页面数据异常，原因如下：' + err);
    console.log('正在进行下一次请求配置...');
    makeConfigObj("nextConfig",scraperOrder).then((configObj)=>{
      whetherSiteEnd(configObj);
    });
  })
}

let getStart = ()=>{
    makeConfigObj(siteName,scraperOrder).then((configObj)=>{
      cycleScraper(configObj);
    });
}

getStart();
// 判断是否网站配置已使用完毕
let whetherSiteEnd = (configObj) => {
  if (configObj) {
    cycleScraper(configObj)
  } else {
    connection.end();
    console.log('网站数据采集完成，共采集' + scraperOrder + ' 个页面的数据')
  }
}