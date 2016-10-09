/**
 * Created by wangji on 2016/5/25.
 */

angular.module('app.directive', [
    'app.urltpl'
])
    .directive('bannerImage', ['$http','urlTplService', function($http, urlTplService) {
        return {
            restrict : 'EA',
            replace : true,
            require: '?ngModel',
            templateUrl : 'tpl/banner.html',
            link : function(scope, element, attrs, ngModel) {
                var mySwiper = new Swiper ('.swiper-container', {
                    direction: 'horizontal',
                    loop: true,
                    pagination: '.swiper-pagination',
                    autoplay: 2500,//可选选项，自动滑动
                    speed:500,
                    autoplayDisableOnInteraction : false,

                })
            }}
    }])


    //.directive('loading',[])