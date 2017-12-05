module.exports = {
    "douban": {
        "header": {
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "referer": "https://www.douban.com/group/explore"
        },
        "layers": [{
                "site_name": "douban",
                "type": "list",
                "parse_method": "xpath",
                "url": "https://www.douban.com/group/explore",
                "rules": {
                    "type": "html",
                    "layerInfo": {
                        "name": "layerInfo",
                        "rule": "/h1/div[@class=\"head-nav\"]/span[@class=\"head-title\"]",
                        "rule_value_type": "text",
                        "default_value": "0"
                    },
                    "rows": "//div[@class=\"channel-item\"]",
                    "columns": [{
                            "name": "likes",
                            "rule": "/div[@class=\"likes\"]",
                            "rule_value_type": "text",
                            "default_value": "0"
                        },
                        {
                            "name": "subject",
                            "rule": "/div[@class=\"bd\"]/h3/a",
                            "rule_value_type": "text",
                            "default_value": "主题1"
                        },
                        {
                            "name": "subject_url",
                            "rule": "//h3/a/@href",
                            "rule_value_type": "attribute",
                            "default_value": "http://example.com"
                        }
                    ],
                    "next_layer_url": "subject_url"
                },
                "pagination": {
                    "type": "step",
                    "rules": {
                        "type": "html",
                        "keyword": "?start=",
                        "step": 30,
                        "exist_first_page_keyword": false,
                    },
                    "end": 2
                }
            },
            {
                "type": "detail",
                "parse_method": "xpath",
                "rules": {
                    "type": "html",
                    "rows": "//div[@id=\"content\"]",
                    "columns": [{
                            "name": "title",
                            "rule": "/h1",
                            "default_value": "标题1"
                        },
                        {
                            "name": "author",
                            "rule": "/div//h3//a",
                            "default_value": "作者1"
                        }
                    ]
                }
            }
        ]
    },
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
                            "base_url": "http://www.xuchengfund.com/"
                        }
                    ],
                    "next_layer_url": "name_url"
                }
            },

            {
                "type": "list",
                "parse_method": "xpath",
                "order": "last",
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
                            "rule_value_type":"text",
                            "insert":false
                        }
                    ]
                },
                "pagination": {
                    "type": "step",
                    "rules": {
                        "keyword": "&page=",
                        "step": 1,
                    },
                    "end": 9
                }
            }
        ]
    },

    "douban_popular_movie": {
        "header": {
            "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13",
            "referer": "https://movie.douban.com/explore"
        },
        "layers": [{
                "site_name": "douban_popular_movie",
                "type": "list",
                "parse_method": "xpath",
                "table_header": [{
                        "name": "cover",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "url",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "title",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "director",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "imdb_link",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "summary",
                        "type": "varchar(1000)"
                    }
                ],
                "url": "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20",
                "rules": {
                    "type": "json",
                    "rows": "subjects",
                    "columns": [{
                            "name": "cover",
                            "rule": "cover",
                            "default_value": "cover"
                        },
                        {
                            "name": "url",
                            "rule": "url",
                            "default_value": "url"
                        },
                        {
                            "name": "title",
                            "rule": "title",
                            "default_value": "title",
                            "diff_word": true
                        }
                    ],
                    "next_layer_url": "url"
                },
                "pagination": {
                    "type": "step",
                    "rules": {
                        "keyword": "&page_start=",
                        "step": 20,
                        "exist_first_page_keyword": true,
                    },
                    "end": 2
                }
            },
            {
                "type": "detail",
                "parse_method": "xpath",
                "order": "last",
                "rules": {
                    "type": "html",
                    "rows": "//div[@id='content']",
                    "columns": [{
                            "name": "director",
                            "rule": "//*[@id='info']/span[1]/span[2]/a[1]",
                            "rule_value_type": "text",
                            "default_value": "导演"
                        },
                        {
                            "name": "imdb_link",
                            "rule": "//*[@id='info']/span[contains(.,'IMDb链接')]/following-sibling::a[1]/@href",
                            "rule_value_type": "attribute",
                            "default_value": "imdb link value"
                        },
                        {
                            "name": "summary",
                            "absolute": true,
                            "rule": "//*[@id='link-report']/span[1]",
                            "rule_value_type": "text",
                            "default_value": "内容概要"
                        }
                    ]
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
                            "base_url": "http://www.thfund.com.cn/thfund/netvalue/"
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
                            "diff_word": true
                        }
                    ],
                }
            },
            {
                "type": "detail",
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
                "order": "last",
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
    }
}