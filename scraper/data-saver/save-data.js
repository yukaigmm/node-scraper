let siteName;
const saveData = (configObj, connection) => {
  // console.log(configObj.pageData)
  // console.log(configObj);
  return new Promise((resolve, reject) => {
    if (configObj.layerOrder == 0 && configObj.pageOrder == 1) {
      createTable(configObj, connection).then((res) => {
        resolve(configObj)
      })
    } else if (configObj.layerConfig.order == "last") {
      inputData(configObj, connection).then((res) => {
        resolve(configObj)
      })
    } else {
      resolve(configObj)
    }
  })
}



// 根据网站信息和表头创建表格和索引
let createTable = (configObj, connection) => {
  return new Promise((resolve, reject) => {
    siteName = configObj.layerConfig.site_name;
    let headerStr = getHeaderStr(configObj.layerConfig.table_header);
    let indexStr = getIndexStr(configObj.layerConfig.table_header);
    let createSql = "CREATE TABLE IF NOT EXISTS " + siteName + " (id int(16) primary key not null auto_increment,site_name varchar(225) default '" + siteName + "'," + headerStr + ",index search_data("+indexStr+"))";
    connection.query(createSql, (error, results, fields) => {
      if (error) {
        throw error;
        return;
      }
      resolve(configObj);
    })
  })
}

// 根据最后一层的pageData，判断录入数据的方式
let inputData = (configObj, connection) => {
  return new Promise((resolve, reject) => {

    let dataArr = JSON.parse(JSON.stringify(configObj.pageData));
    let count = 0;
    for (let data of dataArr) {
      ifUpdate(connection, data).then((res) => {
        if (res) {
          // updateData(data, connection).then((res) => {
            count++;
          // });
        } else {
          insertData(data, connection).then((res) => {
            count++;
          });
        }
      })
    }
    // 确保查询完成之后才执行下一步，否则会有异步带来的问题
    let timeOut = 800000;
    let waitCount = () => {
      let useTime = 0;
      if (count == dataArr.length) {
        resolve(configObj);
      } else if(timeOut < useTime){
        resolve(configObj);
      } else {
        setTimeout(() => {
          useTime+=10;
          waitCount()
        }, 10);
      }
    }
    waitCount()
  })

}

// 根据配置获取数据表头信息
let getHeaderStr = (headerArr) => {
  let str = '';
  for (let header of headerArr) {
    str += header.name + " " + header.type + ' null,';
  }
  str = str.substring(0, str.length - 1);
  return str;
}
// 根据配置创建索引
let getIndexStr = (headerArr)=>{
  let indexStr = '';
  for (let header of headerArr) {
    if(header.diff_word){
      indexStr += header.name + ',';
    }
  }
  indexStr = indexStr.substring(0, indexStr.length - 1);
  return indexStr;
}

// 根据每一条data数据返回含有插入数据sql语句需要字符串的对象
let getDataString = (data, connection) => {
        let dataObj = {
                dataNameStr: '',
                dataStr: ''
        };
        let dataNameStr = '';
        let dataStr = '';
        for (let key in data) {
                if (key != "diff_word" && !key.includes("pagination")) {
                        dataNameStr += key + ',';
                        dataStr += "'"+data[key] + "',"
                }
        }
        dataNameStr = dataNameStr.substring(0, dataNameStr.length - 1);
        dataStr = dataStr.substring(0, dataStr.length - 1);
        dataObj.dataNameStr = dataNameStr;
        dataObj.dataStr = dataStr;
        return dataObj;
}
// 根据每一条data数据获取查询重复的sql需要更新的字段
let getUpdateDataString = (data, connection) => {
  let updateDataStr = '';
  for (let key in data) {
    if (key != "diff_word") {
      updateDataStr += key + "=" +"'"+ data[key]+"',"
    }
  }
  updateDataStr = updateDataStr.substring(0, updateDataStr.length - 1);
  return updateDataStr;
}
// 根据diff_words 获取update 的where子句需要的查询条件
let getDiffString = (data, connection) => {
  let diffStr = '';
  for (let diffWord of data['diff_word']) {
    diffStr += diffWord + "=" + "'"+data[diffWord]+"' AND "
  }
  diffStr = diffStr.substring(0, diffStr.length - 4)
  return diffStr;
}
// 根据diffWord判断是否存在该行数据，以决定是插入数据还是更新
let ifUpdate = (connection, data) => {
  let diffString = getDiffString(data, connection);
  let diffSql = 'SELECT * FROM ' + siteName + ' WHERE ' + diffString;

  return new Promise((resolve, reject) => {
    connection.query(diffSql, (err, results) => {
      if(err){
        throw err;
        return;
      }
      if (results instanceof Array && results.length) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

// 插入数据的操作
let insertData = (data, connection) => {
  let dataObj = getDataString(data, connection);
  let insertSql = "insert into " + siteName + " (" + dataObj.dataNameStr + ") values (" + dataObj.dataStr + ")";
  return new Promise((resolve, reject) => {
    connection.query(insertSql, (error, results, fields) => {
      if (error) {
        throw error;
        return;
      }
      resolve();
    })
  })
}

// 更新数据的操作
let updateData = (data, connection) => {
  let dataStr = getUpdateDataString(data, connection);
  let diffStr = getDiffString(data, connection);
  let updateSql = "UPDATE " + siteName + " SET " + dataStr + " where " + diffStr;
  return new Promise((resolve, reject) => {
    connection.query(updateSql, (err, res, fields) => {
      if (err) {
        throw err;
        return;
      }
      resolve();
    })
  })
}
module.exports = saveData;