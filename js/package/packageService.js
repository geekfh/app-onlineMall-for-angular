angular.module('app.package.service', ['app.urltpl'])
    .factory('packageService',['$http','urlTplService','urlCrowdService',
        function ($http,urlTplService,urlCrowdService,httpInterceptor ) {
            return {
                getProListData: function(params){
                     var url = urlTplService.params('/product/list.json', params);
                    return $http.get(url).then(function(resp){
                        return resp.data;
                            console.log(resp)
                     }
                    )
                },
                getProDetail: function(params){
                     var url = urlTplService.params('/product/detail.json', params);
                    return $http.get(url).then(function(resp){
                        return resp.data;

                        }
                    )
                },
                getProNotice: function(params){
                     var url = urlTplService.params('/product/notice.json', params);
                    return $http.get(url).then(function(resp){
                        return resp.data;
                     }
                    )
                },
                getProWords: function(params){
                    var url = urlTplService.params('/product/clause.json', params);
                    return $http.get(url).then(function(resp){
                            return resp.data;
                        }
                    )
                },
                getPrice: function(params){
                     var url = urlTplService.get('/product/price.json');
                    return $http.post(url,params).then(function(resp){
                        return resp.data;
                     }
                    )
                },
                getPreInfo:function(params){
                    var url = urlTplService.get('/order/preInsure.json');
                    return $http.post(url,params).then(function(resp){
                            return resp.data;
                        }
                    )
                },
                checkPrice: function(params){
                     var url = urlTplService.get('/product/idCardPrice.json');
                    return $http.post(url,params).then(function(resp){
                        return resp.data;
                     }
                    )
                },
                postOrderInfo:function(params){
                    var url = urlTplService.get('/order/insure.json');
                   return $http.post(url,params).then(
                        function(resp){
                            console.log(resp.data)
                          return resp.data
                        }
                    )
                },
                postEmailInfo:function(params){
                    var url = urlTplService.params('/order/email.json',params); /* /order/email.json？id=""&email=""*/
                    return $http.put(url).then(
                        function(resp){
                            console.log(resp.data)
                            return resp.data
                        }
                    )
                },
                addPersonInfo:function(params){
                    var url = urlTplService.get('/person/add.json');
                   return $http.post(url,params).then(
                        function(resp){
                            console.log(resp.data)
                          return resp.data
                        }
                    )
                },
                getOrderListData: function(params){
                     var url = urlTplService.params('/order/list.json', params);
                    return $http.get(url).then(function(resp){
                        console.log(resp)
                        return resp.data;
                    })
                },
                getOrderDetail: function(params){
                    var url = urlTplService.params('/order/detail.json', params);
                    return $http.get(url).then(function(resp){
                        console.log(resp)
                        return resp.data;
                    })
                },
                getCodeNum:function(params){
                    var url = urlTplService.params('/sms/sendVerifyCode.json', params);
                    return $http.get(url).then(function(resp){
                        return resp.data;
                    })
                },
                payAgain:function(params){
                    var url = urlTplService.get('/order/pay.json');
                    return $http.post(url,params).then(function(resp){
                        console.log(resp)
                        return resp.data;
                    })
                },
                getHuiZeOrderTotal:function(){
                    var url = urlTplService.get('/huize/orderTotal.json');
                    return $http.get(url).then(function(resp){
                        console.log(resp)
                        return resp.data;
                    })
                },
                getHuiZeOrderList:function(){
                    var url = urlTplService.get('/huize/orderList.json');
                    return $http.get(url).then(function(resp){
                        console.log(resp)
                        return resp.data;
                    })
                },


            }
    }])
    //瀑布流分页数据
    //.factory('Reddit', ['$http','urlTplService', function ($http, urlTplService) {
    //    var Reddit = function(url, params) {
    //        this.data = [];
    //        this.busy = false;
    //        this.after = 1;
    //        this.url = url;
    //        this.params = params;
    //    };
    //
    //    Reddit.prototype.nextPage = function (extendParams) {
    //        if (this.isEnded || this.busy) return;
    //        this.busy = true;
    //
    //        var url = urlTplService.get(this.url),
    //            page = this.params.page;
    //
    //        if(extendParams){   //扩展参数
    //            for(o in extendParams){this.params[o] = extendParams[o];}
    //        }
    //        page.page = this.after;
    //        $http.post(url, this.params).success(function (resp) {
    //
    //            var items = resp.data;
    //            if((!items || items.length==0) && this.after == 1) return this.empty = true;
    //            if(items) this.after += 1;
    //
    //            for (var i = 0; i < items.length; i++) {
    //                this.data.push(items[i]);
    //            }
    //            this.busy = false;
    //            this.empty = false;
    //            this.isEnded = (items && items.length>=page.rows) ? false : true;
    //        }.bind(this));
    //    };
    //    return Reddit;
    //}]);
