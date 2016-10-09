angular.module('app', ['ui.router', 'app.package'])//localStorage

    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            //方便获得当前状态的方法，绑到根作用域
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //state切换时进行loading提示
            $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {

                var stateName = toState.name.split('.')[0];
                //  console.log('fromState:',fromState);


                if (stateName != $rootScope.lastToState) {
                    //$.fn.loading();
                    $rootScope.lastToState = stateName;
                }

                //记录来源state
                $rootScope.fromState = fromState;
                $rootScope.fromState.params = fromParams;
                $rootScope.source = "weixin"; //微信支付
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.log('Resolve Error: ', error);
            });

            $rootScope.$on('$viewContentLoaded', function () {

                //页面标题
                document.title = $state.current.data ? $state.current.data.title : '';

                if ($('.welcome')[0])setTimeout(function () {
                    $('.welcome').remove();
                }, 500);

                if($('#console-pre')[0]) $('#console-pre').remove(); //去除调试日志
                window.scrollTo(0, 0);
            });
        }
    ])
    .service('httpInterceptor', function ($rootScope, $q) {

        var waitRespCounter = 0;//还未返回（失败/成功）的请求数

        var condition = ['json'];

        function requestCountUp () {
            waitRespCounter++;
        }

        function requestCountDown () {
            waitRespCounter--;
            //某一次请求返回后，如果发现等待响应的请求数为0，则向下广播一个事件，告知目前所有请求已经停止
            if(0 === waitRespCounter) {
                $rootScope.$broadcast('ajaxStop');
            }
        }

        var interceptor = {

            request: function (config) {
                //console.log(config)

                var isInterceptor = (function(arr){
                    var r = false;
                    angular.forEach(arr,function(item){
//                        console.log(config.url, item, config.url.indexOf(item) == -1);
                        if (config.url.indexOf(item) != -1)r = true;
                    });
                    return r;
                })(condition);

                var method = config.method.toUpperCase();
                var params, data;

                //************************************
                //****** 拦截所有请求，加上 token 参数
                //************************************

                params = config.params || {};
                if(isInterceptor && angular.isObject(params)) {
                    var openid = localStorage.getItem('openid');
                    params['openid'] = openid;//params['openid'] = sessionStorage.getItem('openId');
                    config.headers = params;
                }
                requestCountUp();

                return config || $q.when(config);
            },

            response: function (response) {
                requestCountDown();
                return response || $q.when(response);
            },

            responseError: function (rejection) {
                requestCountDown();
                return $q.reject(rejection);
            }

        };

        return interceptor;
    })
    .config(['$httpProvider',function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);
