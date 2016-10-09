/**
 * 统一管理配置所有接口的 url
 */
angular.module('app.urltpl',[])

    //保险 -- 众筹
    .factory('urlCrowdService', function() {

        var basePrefix = '/crowdfunding';  //开发 （数据后台）

        /**
         * url模板配置
         */
        var urlTplMap = {};

        var replace_arg_exp = /\/?:([\s\S]+?)\b/g;

        return {
            /**
             * urlTplMap = {
            *   a: 'api/person/:id',
            *   b: 'api/role'
            * }
             *
             * 取key为a的url  get('a', {id:23}) //-> 'api/person/23'
             * 取key为b的url get('b') //-> 'api/role'
             * 取key为a但是不要参数部分 get('a') //-> 'api/person
             *
             */
            get: function (key, data) {
                var strUrl = urlTplMap[key] ? urlTplMap[key] : key;
                var result;
                if (data) {
                    result = strUrl.replace('/\/?:([^/:]+)\b/g/', function (match, name) {
                        return (data[name] != null) ? '/'+data[name] : '';
                    });
                } else {
                    result = strUrl.replace(replace_arg_exp, '');
                }
                return basePrefix + result;
            },

            params: function (key, data) {
                var strUrl = key+'?';
                var result = '';

                if (data) {
                    angular.forEach(data, function(value, name){
                        result = result + name + '=' + value + '&';
                    });
                    strUrl = strUrl + result.slice(0,-1);
                } else {
                    return key;
                }
                return basePrefix + strUrl;
            }
        };
    })

    //保险 -- 大保障
    .factory('urlTplService', function() {

        var basePrefix = '/insurex';  //开发 （数据后台）

        /**
         * url模板配置
         */
        var urlTplMap = {};

        var replace_arg_exp = /\/?:([\s\S]+?)\b/g;

        return {
            /**
             * urlTplMap = {
           *   a: 'api/person/:id',
           *   b: 'api/role'
           * }
             *
             * 取key为a的url  get('a', {id:23}) //-> 'api/person/23'
             * 取key为b的url get('b') //-> 'api/role'
             * 取key为a但是不要参数部分 get('a') //-> 'api/person
             *
             */
            get: function (key, data) {
                var strUrl = urlTplMap[key] ? urlTplMap[key] : key;
                var result;

                if (data) {
                    result = strUrl.replace('/\/?:([^/:]+)\b/g/', function (match, name) {
                        return (data[name] != null) ? '/'+data[name] : '';
                    });
                } else {
                    result = strUrl.replace(replace_arg_exp, '');
                }

                return basePrefix + result;
            },

            params: function (key, data) {
                var strUrl = key+'?';
                var result = '';

                if (data) {
                    angular.forEach(data, function(value, name){
                        result = result + name + '=' + value + '&';
                    });
                    strUrl = strUrl + result.slice(0,-1);

                } else {
                    return key;
                }

                return basePrefix + strUrl;
            }
        };
    })
    .factory('getUrlParams',function(){
        return {
            getURLRequestParam:function(url,obj){
                if(url){
                    if(url.indexOf("?")>-1){
                        url=url.substring(url.indexOf("?")+1);
                    }else{url="";}
                }else{
                    url=location.search.length?location.search.substring("1"):"";
                }
                var params=url.length?url.split("&"):[],temp;
                obj||(obj={});
                for(var i=0,l=params.length;i<l;++i){
                    temp=params[i].split("=");
                    obj[temp[0]]=temp[1];
                }
                return obj;
        }}
    })

    .factory('checkId',function(){
        return{
        checkIdCard:function (str,type){
            str = $.trim(str);
            if (str == null || str == "") {
                return false;
            }
            if (type == 0){
                str = str.toUpperCase();
                if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(str))) {
                    return false;
                }
                var k,
                    p;
                k = str.length;
                if (k == 15) {
                    rule = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                    var splitstr = str.match(rule);
                    var idDate = new Date("19" + splitstr[2] + "/" + splitstr[3] + "/" + splitstr[4]);
                    var f = (idDate.getYear() == Number(splitstr[2])) && ((idDate.getMonth() + 1) == Number(splitstr[3])) && (idDate.getDate() == Number(splitstr[4]));
                    if (!f) {
                        return false;
                    } else {
                        return true;
                    }
                }
                if (k == 18) {
                    rule = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                    var splitstr = str.match(rule);
                    var idDate = new Date(splitstr[2] + "/" + splitstr[3] + "/" + splitstr[4]);
                    var f = (idDate.getFullYear() == Number(splitstr[2])) && ((idDate.getMonth() + 1) == Number(splitstr[3])) && (idDate.getDate() == (splitstr[4]));
                    if (!f) {
                        return false;
                    } else {
                        var d;

                        var m = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var n = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                        var l = 0,
                            h;
                        for (h = 0; h < 17; h++) {
                            l += str.substr(h, 1) * m[h];
                        }

                        d = n[l % 11];
                        if (d != str.substr(17, 1)) {
                            return false;
                        }
                        return true;
                    }
                }
                return false;
            }
            return true;
        }
        }
    })
