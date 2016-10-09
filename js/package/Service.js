/**
 * Created by wangji on 2016/5/19.
 */
angular.module('app.user.service', [
    'app.urltpl'
])

    //瀑布流分页数据
    .factory('Reddit', ['$http','urlTplService', function ($http, urlTplService) {
        var Reddit = function(url, params) {
            this.data = [];
            this.busy = false;
            this.after = 1;
            this.url = url;
            this.params = params;
        };

        Reddit.prototype.nextPage = function (extendParams) {
            if (this.isEnded || this.busy) return;
            this.busy = true;

            var url = urlTplService.get(this.url),
                page = this.params.page;

            if(extendParams){   //扩展参数
                for(o in extendParams){this.params[o] = extendParams[o];}
            }
            page.page = this.after;
            $http.post(url, this.params).success(function (resp) {

                var items = resp.data;
                if((!items || items.length==0) && this.after == 1) return this.empty = true;
                if(items) this.after += 1;

                for (var i = 0; i < items.length; i++) {
                    this.data.push(items[i]);
                }
                this.busy = false;
                this.empty = false;
                this.isEnded = (items && items.length>=page.rows) ? false : true;
            }.bind(this));
        };
        return Reddit;
    }])