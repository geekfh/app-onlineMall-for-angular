angular.module('app.package', [  'app.package.controller','app.package.service','app.directive'])

    .config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('home', {

            url: '/home',

            template: '<div ui-view></div>',

            abstract: true,

        })

        $stateProvider.state('home.index', {

            url: '',

            templateUrl: 'tpl/home.html',

            data:{ title:'保险商城' },

            controller: 'homeCtrl'

        })
        $stateProvider.state('home.packageDetail', {

            url: '/package-detail/:id',

            PARENT: 'home',

            template: '<div ui-view></div>',

            abstract: true,

        })

        $stateProvider.state('home.packageDetail.index', {

            url: '',

            PARENT: 'home.packageDetail',

            templateUrl: 'tpl/package_detail.html',

            data:{ title:'商品详情' },

            controller: 'packageDetailCtrl'

        })
        $stateProvider.state('notice', {

            url: '/proNotice/:id',

            templateUrl: 'tpl/package_notice.html',

            data:{ title:'保险条款及告知' },

            controller: 'packageNoticeCtrl'

        })


        $stateProvider.state('info-input', {

            url: '/info-input',

            templateUrl: 'tpl/guest_info_input.html',

            data:{ title:'订单信息填写' },

            params:{data:{}},

            controller: 'infoInputCtrl'

        })

        $stateProvider.state('payment', {

            url: '/payment',

            params:{data:{}},

            templateUrl: 'tpl/payment.html',

            data:{ title:'确认支付' },

            controller: 'paymentCtrl'

        })

        $stateProvider.state('myOrder', {

            url: '/myorder',

            templateUrl: 'tpl/my-order-list.html',

            data:{ title:'我的保单--大保障' },

            controller: 'myOrderCtrl'

        })

        ////////////////////////////////////////
        $stateProvider.state('myOrder_market', {

            url: '/myOrder_market',

            templateUrl: 'tpl/my-order-list_market.html',

            data:{ title:'我的保单--保险商城' },

            controller: 'myOrderMarketCtrl'

        })
        /////////////////////////////////////
        ////////////////////////////////////////////
        $stateProvider.state('myOrder_huize', {

            url: '/myOrder_huize',

            templateUrl: 'tpl/my-order-list_huize.html',

            data:{ title:'我的保单--慧择' },

            controller: 'myOrderHuizeCtrl'

        })
        $stateProvider.state('myOrderDetail_huize', {

            url: '/myOrderDetail_huize',

            templateUrl: 'tpl/my-order-list-detail_huize.html',

            data:{ title:'我的保单--我的订单--慧择' },

            controller: 'myOrderDetailHuizeCtrl'

        })
        ///////////////////////////////////////////

        $stateProvider.state('orderDetail', {

            url: '/myorderDetail/:orderNumber',

            templateUrl: 'tpl/order-detail.html',

            data:{ title:'保单详情' },

            controller: 'OrderDetailCtrl'

        })

        $stateProvider.state('freeInsurex', {

            url: '/freeInsurex/:type',

            templateUrl: 'tpl/free_insurex.html',

            data:{ title:'免费领取'},

            controller: 'freeCtrl'

        })
        $stateProvider.state('freeInsurexInput', {

            url: '/freeInsurexInput/:type',

            templateUrl: 'tpl/free_insurex_input.html',

            data:{ title:'免费领取' },

            controller: 'freeInputCtrl'

        })
        $stateProvider.state('paySuccess', {

            url: '/paySuccess',

            templateUrl: 'tpl/pay_success.html',

            data:{ title:'支付完成' },

            controller: 'paySuccessCtrl'

        })

        /*////微信支付///////////////////////////////////////*/
        $stateProvider.state('pay', {

            url: '/pay',

            templateUrl: 'tpl/pay.html',

            data:{ title:'微信支付页面' },

            controller: 'payCtrl'

        })
        /*////微信支付///////////////////////////////////////*/




    }])
