angular.module('app.constant', [])
    .constant('__ROOT', (function(){
        var path = location.pathname.split('/');
        var str = '';
        for(var i=0; i<path.length; i++){
            if(path[i]!='' && path[i].indexOf('.html')==-1)str += '/'+path[i]+'/'
        }
        return str;
    })())/**
 * Created by wangji on 2016/5/10.
 */
