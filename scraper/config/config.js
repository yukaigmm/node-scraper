module.exports = {
    "xuchengfund": {
        "charset": "gb2312",
        "header": {
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "referer": "www.xuchengfund.com"
        },
        "login": {
            "agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "url": "http://www.xuchengfund.com/login.html",
            "login_pass": [{
                    "username": "18676380756",
                    "password": "263735",
                },
                {
                    "username": "18676380756",
                    "password": "263735",
                }
            ],
            "username_css_selector": "input#mob.input_yh",
            "password_css_selector": "input#pass.input_mm",
            "submit_css_selector": "input.button",
            "waitfor_css_selector": "td.maintb"
        },
        "layers": [{
                "site_name": "xuchengfund",
                "type": "list",
                "parse_method": "xpath",
                "table_header": [{
                        "name": "fund_name",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "name_url",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "name",
                        "type": "varchar(100)",
                        "diff_word": true
                    },
                    {
                        "name": "unit_net",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "accumulate_net",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "accumulate_revenue",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "establish_date",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "update_date",
                        "type": "varchar(100)",
                        "diff_word": true
                    }
                ],
                "url": "http://www.xuchengfund.com/cpjzs.asp",
                "rules": {
                    "type": "html",
                    "rows": "/html/body/table[5]//tr/td[1]/table[2]//tr[.//a]",
                    "columns": [{
                            "name": "fund_name",
                            "rule": "/td/a",
                            "rule_value_type": "text",
                            "default_value": "产品净值默认名称"
                        },
                        {
                            "name": "name_url",
                            "rule": "/td/a/@href",
                            "rule_value_type": "attribute",
                            "default_value": "产品净值默认名称",
                        }
                    ],
                    "next_layer_url": "name_url"
                }
            },

            {
                "type": "list",
                "parse_method": "xpath",
                "order": "last",
                "request_type": "get",
                "base_url": "http://www.xuchengfund.com/",
                "params": {},
                "url_split": ["name_url"],
                "rules": {
                    "type": "html",
                    "rows": "/html/body/table[5]//tr/td[3]/table[5]/tr[not(.//table) and not((contains(., \"产品名称\") and contains(., \"单位净值\")))]",
                    "columns": [{
                            "name": "name",
                            "rule": "/td[1]",
                            "rule_value_type": "text",
                            "default_value": "产品名称",
                            "diff_word": true
                        },
                        {
                            "name": "unit_net",
                            "rule": "/td[2]",
                            "rule_value_type": "text",
                            "default_value": "单位净值"
                        },
                        {
                            "name": "accumulate_net",
                            "rule": "/td[3]",
                            "rule_value_type": "text",
                            "default_value": "累计净值"
                        },
                        {
                            "name": "accumulate_revenue",
                            "rule": "/td[4]",
                            "rule_value_type": "text",
                            "default_value": "累计收益"
                        },
                        {
                            "name": "establish_date",
                            "rule": "/td[5]",
                            "rule_value_type": "text",
                            "default_value": "成立日期"
                        },
                        {
                            "name": "update_date",
                            "rule": "/td[6]",
                            "rule_value_type": "text",
                            "default_value": "更新日期",
                            "diff_word": true
                        },
                        {
                            "name": "pagination1",
                            "rule": "//select[@name='sel_page']/option[last()]",
                            "absolute": true,
                            "rule_value_type": "text",
                            "insert": false
                        }
                    ]
                },
                "pagination": {
                    "type": "step",
                    "rules": {
                        "keyword": "&page=",
                        "step": 1,
                    },
                }
            }
        ]
    },
    "thfund": {
        "header": {
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "referer": "www.xuchengfund.com"
        },
        "layers": [{
                "site_name": "tianhongfund1",
                "type": "list",
                "table_header": [{
                        "name": "fund_name",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "name_url",
                        "type": "varchar(50)"
                    },
                    {
                        "name": "fund_num",
                        "type": "varchar(30)"
                    },
                    {
                        "name": "unit_net",
                        "type": "varchar(20)"
                    },
                    {
                        "name": "net_value_date",
                        "type": "varchar(50)",
                        "diff_word": true
                    }
                ],
                "url": "http://www.thfund.com.cn/thfund/fundlist/api/?risk=any_risk&limit=any_limit&type=any_type&order=desc&sortby=trend_in_this_year",
                "rules": {
                    "type": "json",
                    "rows": "",
                    "columns": [{
                            "name": "fund_name",
                            "rule": "\u57fa\u91d1\u540d\u79f0",
                            "default_value": "产品名称"
                        },
                        {
                            "name": "fund_num",
                            "rule": "\u57fa\u91d1\u4ee3\u7801",
                            "default_value": "基金编号",
                            "diff_word": true
                        },
                        {
                            "name": "name_url",
                            "rule": "\u57fa\u91d1\u4ee3\u7801",
                            "default_value": "产品url",
                        }
                    ],
                    "next_layer_url": "name_url"
                },
                "pagination": {
                    "type": "step",
                    "rules": {
                        "keyword": "&limit=any_limit&type=any_type&order=desc&sortby=trend_in_this_year&pager=pager_",
                        "step": 1,
                    },
                    "end": 9
                }
            },

            {
                "type": "detail",
                "order": "last",
                "request_type": "get",
                "base_url": "http://www.thfund.com.cn/thfund/netvalue/",
                "url_split": ['name_url'],
                "rules": {
                    "type": "json",
                    "rows": "",
                    "columns": [{
                            "name": "net_value_date",
                            "rule": "0",
                            "default_value": "净值日期",
                            "diff_word": true
                        },
                        {
                            "name": "unit_net",
                            "rule": "1",
                            "default_value": "单位净值"
                        }
                    ]
                }
            }
        ]
    },
    "gongyinruixin": {
        "header": {
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            'content-type': 'application/x-www-form-urlencoded',
            "referer": "http://www.icbccs.com.cn/gyrx/jjcp/hhxjj/gyjz/index.html",
            "cookie": "JSESSIONID=0000q3VFNy2Oh3Ftb3xnHajm8ex:-1; WT_FPC=id=2196afc10ebc069971d1512088957656:lv=1512093341617:ss=1512088957656; _ga=GA1.3.871879041.1512088958; _gid=GA1.3.806464120.1512088958; Hm_lvt_4e60b0f9f3f5d813d996387dc84efe1f=1512088958; Hm_lpvt_4e60b0f9f3f5d813d996387dc84efe1f=1512093342; sdmenu_my_menu=1000000000; TSdc3889=8c141c0e77b5c2abbc5a46a0dbcb53e13ef4cf802b25cd2f5a20b81560ac0ec587360ad4"
        },
        "layers": [{
                "site_name": "gongyinruixin",
                "type": "list",
                "url": "http://www.icbccs.com.cn/gyrx/jjcp/hhxjj/gycz/index.html",
                "table_header": [{
                        "name": "fund_name",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "fund_number",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "net_value_date",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "unit_net_value",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "accumulated_net_value",
                        "type": "varchar(50)",
                    }
                ],
                "rules": {
                    "type": "html",
                    "rows": "//*[@id='sel_fund']/option",
                    "columns": [{
                            "name": "fund_name",
                            "rule": "",
                            "rule_value_type": "text"
                        },
                        {
                            "name": "fund_number",
                            "rule": "/@value",
                            "rule_value_type": "attribute",
                            "diff_word": true,
                        }
                    ],
                }
            },
            {
                "type": "detail",
                "order": "last",
                "request_type": "post",
                "url": "http://www.icbccs.com.cn/cif/MainCtrl",
                "params": {
                    "page": "GetJJJZAJAX",
                    "f_date1": "2000-01-01",
                    "f_date2": "2025-12-31",
                    "pageNo": "1",
                    "pageSize": "10",
                    "_isAjaxRequest": "y"
                },
                "keywords": {
                    "sel_fund": "fund_number"
                },
                "rules": {
                    "type": "html",
                    "rows": "//tr[position()>1]",
                    "columns": [{
                            "name": "net_value_date",
                            "rule": "/td[2]",
                            "rule_value_type": "text",
                            "diff_word": true
                        },
                        {
                            "name": "unit_net_value",
                            "rule": "/td[3]",
                            "rule_value_type": "text"
                        },
                        {
                            "name": "accumulated_net_value",
                            "rule": "/td[4]",
                            "rule_value_type": "text"
                        }
                    ]
                }

            }
        ]
    },
    "zrfund": {
        "header": {
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "referer": "http://www.zrfunds.com.cn/cn/zrProducts/index.html",
        },
        "layers": [{
                "site_name": "zrfund",
                "type": "list",
                "url": "http://www.zrfunds.com.cn/funds/js/index_last.json",
                "table_header": [{
                        "name": "fund_name",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "fund_num",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "net_value_date",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "unit_net_value",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "accumulated_net_value",
                        "type": "varchar(50)",
                    }
                ],
                "rules": {
                    "type": "json",
                    "rows": "",
                    "columns": [{
                            "name": "fund_name",
                            "rule": "基金名称",
                            "default_value": "fund_name"
                        },
                        {
                            "name": "fund_num",
                            "rule": "基金代码",
                            "default_value": "fund_num",
                            "diff_word": true
                        }
                    ]
                }
            },
            {
                "type": "detail",
                "order": "last",
                "request_type": "get",
                "base_url": "http://www.zrfunds.com.cn/funds/",
                "params": {

                },
                "url_split": ["fund_num", "/data/chartData", "fund_num", ".json"],
                "rules": {
                    "type": "json",
                    "rows": "",
                    "columns": [{
                            "name": "unit_net_value",
                            "rule": "单位净值",
                            "default_value": "unit_net_value"
                        },
                        {
                            "name": "accumulated_net_value",
                            "rule": "累计净值",
                            "default_value": "accumulated_net_value"
                        },
                        {
                            "name": "net_value_date",
                            "rule": "净值日期",
                            "default_value": "net_value_date"
                        }
                    ]
                }
            }
        ]
    },
    "cibfund": {
        "header": {
            "referer": "http://www.cib-fund.com.cn/index.html",
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
        },
        "layers": [{
                "site_name": "cibfund",
                "type": "list",
                "url": "http://www.cib-fund.com.cn/products/zhaiquan/000546/index.html",
                "table_header": [{
                    "name": "fund_type",
                    "type": "varchar(50)",
                }, {
                    "name": "fund_type_url",
                    "type": "varchar(50)",
                }, {
                    "name": "fund_name",
                    "type": "varchar(50)",
                }, {
                    "name": "fund_url",
                    "type": "varchar(50)",
                }, {
                    "name": "fund_num",
                    "type": "varchar(50)",
                    "diff_word": true
                }, {
                    "name": "unit_net_value",
                    "type": "varchar(50)",
                }, {
                    "name": "accumulated_net_value",
                    "type": "varchar(50)",
                }, {
                    "name": "net_value_date",
                    "type": "varchar(50)",
                    "diff_word": true
                }, ],
                "rules": {
                    "type": "html",
                    "rows": "/html/body/div[1]/div[4]/div[1]/ul/li",
                    "columns": [{
                            "name": "fund_type",
                            "rule": "/span/a",
                            "rule_value_type": "text",
                        },
                        {
                            "name": "fund_type_url",
                            "rule": "/span/a/@href",
                            "rule_value_type": "attribute"
                        }
                    ]
                }

            },
            {
                "type": "list",
                "request_type": "get",
                "base_url": "http://www.cib-fund.com.cn",
                "url_split": ["fund_type_url"],
                "params": {

                },
                "rules": {
                    "type": "html",
                    "rows": "/html/body/div[1]/div[4]/div[1]/ul/li[@class='current']/ul/li",
                    "columns": [{
                            "name": "fund_name",
                            "rule": "/a/@title",
                            "rule_value_type": "attribute"
                        },
                        {
                            "name": "fund_url",
                            "rule": "/a/@href",
                            "rule_value_type": "attribute"
                        }
                    ],
                }
            },
            {
                "type": "detail",
                "request_type": "get",
                "base_url": "http://www.cib-fund.com.cn",
                "url_split": ["fund_url"],
                "params": {

                },
                "rules": {
                    "type": "html",
                    "rows": "/html/body/div[1]/div[4]/div[2]/div[2]/div/div[1]/div[2]/table/tbody/tr[1]/td[1]",
                    "columns": [{
                        "name": "fund_num",
                        "rule": "",
                        "rule_value_type": "text",
                        "diff_word": true
                    }],

                }
            },
            {
                "type": "detail",
                "order": "last",
                "request_type": "get",
                "base_url": "http://www.cib-fund.com.cn/chart-web/chart/fundnettable",
                "url_split": ["?pages=1-5000&fundcode=", "fund_num", "&from=1993-01-01&to=2025-12-07"],
                "params": {

                },
                "rules": {
                    "type": "html",
                    "rows": "/html/body/div/table/tr[position()>1]",
                    "columns": [{
                            "name": "unit_net_value",
                            "rule": "/td[3]",
                            "rule_value_type": "text"
                        },
                        {
                            "name": "accumulated_net_value",
                            "rule": "/td[4]",
                            "rule_value_type": "text"
                        },
                        {
                            "name": "net_value_date",
                            "rule": "/td[2]",
                            "rule_value_type": "text",
                            "diff_word": true
                        }
                    ]
                }
            }
        ]
    },
    "jiahefund":{
        
        "header":{
            "referer":"http://www.ahjiahe.cn/default.asp",
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
        },
        "login":{
            "agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "url":"http://www.ahjiahe.cn/member.asp",
            "login_pass":[
                {
                    "username":"smppw",
                    "password":"123456"
                },
                {
                    "username":"smppw",
                    "password":"123456"
                }
            ],
            "username_css_selector":"input[name='name']",
            "password_css_selector": "input[name='pass']",
            "submit_css_selector": "input.btn-submit",
            "waitfor_css_selector": "div.member_name"
        },
        "layers":[
            {
                "type":"list",
                "site_name":"jiahefund",
                "url":"http://www.ahjiahe.cn/info.asp?second_id=9002",
                "table_header":[
                    {
                        "name": "fund_name",
                        "type": "varchar(100)",
                    },
                    {
                        "name": "fund_url",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "fund_num",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "net_value_date",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "unit_net_value",
                        "type": "varchar(50)",
                    },{
                        "name": "accumulated_net_value",
                        "type": "varchar(50)",
                    }
                ],
                "rules":{
                    "type":"html",
                    "rows":"//*[@id='rightObj']/div[1]/ul/li",
                    "columns":[
                        {
                            "name":"fund_name",
                            "rule":"/a",
                            "rule_value_type":"text",
                        },
                        {
                            "name":"fund_url",
                            "rule":"/a/@href",
                            "rule_value_type":"attribute"
                        }
                    ]
                }
            },
            {
                "type":"detail",
                "order":"last",
                "request_type":"get",
                "base_url":"http://www.ahjiahe.cn/",
                "url_split":["fund_url"],
                "rules":{
                    "type":"html",
                    "rows":"//*[@id='info_content']/table/tbody/tr[position()>1]",
                    "columns":[
                        {
                            "name":"fund_num",
                            "rule":"/td[1]",
                            "rule_value_type":"text",
                            "diff_word": true
                        },
                        {
                            "name":"net_value_date",
                            "rule":"/td[2]",
                            "rule_value_type":"text",
                            "diff_word": true
                        },
                        {
                            "name":"unit_net_value",
                            "rule":"/td[3]",
                            "rule_value_type":"text",
                        },
                        {
                            "name":"accumulated_net_value",
                            "rule":"/td[4]",
                            "rule_value_type":"text"
                        }
                    ]
                }
            }
        ]
    },
    "quantdofund":{
        "header":{
            "referer":"http://www.quantdo.com",
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
        },
        "login":{
            "agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "url":"http://www.quantdo.com/index.php?mod=login",
            "login_pass":[
                {
                    "username":"18676380756",
                    "password":"263735"
                },
                {
                    "username":"18676380756",
                    "password":"263735"
                }
            ],
            "agree_css_selector":"span#agree",
            "waitfor_agree_selector":"div#banner",
            "username_css_selector":"input#username",
            "password_css_selector": "input#password",
            "submit_css_selector": "input#loginbtn",
            "waitfor_css_selector": "div.jijinnr"
        },
        "layers":[
            {
                "site_name":"quantdofund",
                "type":"list",
                "url":"http://www.quantdo.com/index.php?mod=table&tid=211",
                "table_header":[
                    {
                        "name": "fund_name",
                        "type": "varchar(100)",
                        "diff_word": true
                    },
                    {
                        "name": "fund_url",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "fund_num",
                        "type": "varchar(50)",
                    },
                    {
                        "name": "net_value_date",
                        "type": "varchar(50)",
                        "diff_word": true
                    },
                    {
                        "name": "unit_net_value",
                        "type": "varchar(50)",
                    }
                ],
                "rules":{
                    "type":"html",
                    "rows":"/html/body/div[4]/div/div[1]/div[2]/ul/li",
                    "columns":[
                        {
                            "name":"fund_url",
                            "rule":"/a/@href",
                            "rule_value_type":"attribute"
                        }
                    ]
                }
            },
            {
                "type":"detail",
                "order":"last",
                "request_type":"get",
                "base_url":"http://www.quantdo.com/",
                "url_split":["fund_url"],
                "params":{

                },
                "rules":{
                    "type":"html",
                    "rows":"//*[@id='content']/table/tr",
                    "columns":[
                        {
                            "name":"fund_name",
                            "rule":"/td[1]",
                            "rule_value_type":"text",
                            "diff_word":true
                        },
                        {
                            "name":"net_value_date",
                            "rule":"/td[2]",
                            "rule_value_type":"text",
                            "diff_word":true
                        },
                        {
                            "name":"unit_net_value",
                            "rule":"/td[3]",
                            "rule_value_type":"text"
                        }
                    ]
                }
            }
        ]
    }
}