angular.module('app.package.controller', ['app.package.service','app.urltpl'])

//------------
// 商城首页
//------------
    .controller('homeCtrl', ['$scope','packageService','$state', function ($scope,packageService,$state) {

        $scope.activeTab = '0';
        $scope.packageList = [];
        $scope.helpPackageList = [];
        $scope.marketIn = $scope.source; //支付方式 "weixin" ， "market"
        /*var projectId; //项目id*/
        var InNum = '0';
        if($scope.marketIn == "weixin"){
            InNum = '0';
        }else{
            InNum = '1'
        }

        if(sessionStorage.getItem("switchLabelTGF") == null){
            $scope.switchLabelTGF = true; //推广费显示
            sessionStorage.setItem("switchLabelTGF",$scope.switchLabelTGF);
        }else{
            $scope.switchLabelTGF = sessionStorage.getItem("switchLabelTGF");
        }

        //根据不同类型获取保险产品列表
        function updateList(num){
            packageService.getProListData({type:num,source:InNum}).then(
                function(resp) {
                    if (resp.base.code==0) {
                        $scope.packageList = $scope.packageList.concat(resp.dataList);
                        //$scope.navBanner_img = resp.banner;
                    }else{
                    //to do something
                    }});
        }
        //初始化商品列表
        updateList($scope.activeTab);
        ////////////////////////////////////////////////////

        /*//切换保险类别
        $scope.tabSelect = function(tabName){
            $scope.packageList = [];
            $scope.activeTab = tabName;
            updateList($scope.activeTab);
        };*/

        //产品链接跳转
        $scope.gotoPackage=function(package){
            if(package.kind == "2"){
                var packageUrl = package.url;
                var token = localStorage.getItem('token');
                window.location.href = packageUrl+"&token="+token;
            }else{
                var packageUrl = package.url;
                window.location.href = packageUrl;
            }

        }

        //判断是否为免费的两款产品进行页面跳转
        $scope.jumpToDetail=function(data){
            if(data.code== 'fcb' ){
                $state.go('freeInsurex',{type:"fcb"})
            }else if(data.code== 'tdb'  ){
                $state.go('freeInsurex',{type:"tdb"})
            }else if(data.kind=='1'){
                window.location.href=data.url;
            }else{
                    $state.go('home.packageDetail.index',{id:data.id})
                }

        }

        $scope.gotoHistoryVersions = function(){
            var token = sessionStorage.getItem("token");
            window.location.href = "https://api.iboxpay.com/h5/insuranceMarket/index_s.html?token="+token;
        }

        $scope.zhonganbaoxian = function(){
            window.location.href = "https://m.zhongan.com/open/policy/policySearch"
        }

        $scope.homeIconChange = function(label){
            if(label == '0'){//首页
                //updateList($scope.activeTab);
            }else if(label == '1'){//我的订单
                $state.go('myOrder_huize');
            }
        }

        ////判断手指滑动方向 控制我的保单按钮的显示隐藏
        //$("body").on("touchstart", function(e) {
        //    startX = e.changedTouches[0].pageX,
        //        startY = e.changedTouches[0].pageY;
        //});
        //$("body").on("touchmove", function(e) {
        //    moveEndX = e.changedTouches[0].pageX,
        //        moveEndY = e.changedTouches[0].pageY,
        //        X = moveEndX - startX,
        //        Y = moveEndY - startY;
        //
        //    if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
        //        $('#myOrderBtn').css('display','block')
        //    }
        //    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
        //        $('#myOrderBtn').css('display', 'none')
        //    }
        //});

    }])
//------------
// 商品详情页
//------------

    .controller('packageDetailCtrl', ['$scope', 'packageService', '$stateParams','$state','$timeout', function ($scope, packageService, $stateParams,$state,$timeout) {
        $scope.activeTab = '0';
        $scope.suitData;
        packageService.getProDetail({id:$stateParams.id}).then(
            function(resp) {
                if (resp.base.code==0) {
                    $scope.allData=resp.data;
                    $scope.img=$scope.allData.img;
                    $scope.hasSuit=$scope.allData.hasSuit;
                    $scope.id=$scope.allData.id;
                    $scope.suitData=$scope.allData.productSuits;
                    $scope.advantage=$scope.allData.advantage;
                    console.log($scope.allData);
                    if($scope.allData.productSuits.length>1){
                        $scope.tabNameOne=$scope.allData.productSuits[0].description;
                        $scope.tabNameTwo=$scope.allData.productSuits[1].description;
                        $scope.tabNameTh=$scope.allData.productSuits[2].description;
                    }
                    getSuit($scope.activeTab);
                }
            })


        //套餐切换tab
        $scope.tabSelect = function(tabName){
            $scope.activeTab = tabName;
            $('#tbody').innerHTML="";
            getSuit(tabName);
        };

        $scope.healthLabel =false;
        $scope.buyTipLabel = false;
        $scope.isHealthNotice = function(label){
            if(label==1){
                $scope.buyTipLabel = true;
                var timer = $timeout(function(){
                    $scope.buyTipLabel = false;
                    $scope.healthLabel =false;
                },2000);
                $('#order_options_box').css('display', 'none');
            }else{
                $scope.healthLabel =false;
            }
        }


        //套餐选择窗口的显示与隐藏
        $scope.caclBoxShow = function () {
            if($scope.id == "pd4"){$scope.healthLabel = true;}
            $('#order_options_box').css('display', 'block');
        if($scope.allData.productAges.length>0){
            $scope.age=$scope.allData.productAges[0].id;}
        if($scope.allData.productDays.length>0){
           $scope.time=$scope.allData.productDays[0].id;
            $scope.section=$scope.allData.productDays[0].section;
            console.log($scope.section);
        }
        if($scope.allData.productSuits.length>0){
            $scope.suit=$scope.allData.productSuits[0].id;}
        if($scope.allData.productGenders.length>0){
            $scope.gender=$scope.allData.productGenders[0].id;}
        var pId=$scope.id
            getPrice($scope.age,$scope.time,$scope.suit,$scope.gender,pId);
        }
        $scope.closeWindow = function () {
            $('#order_options_box').css('display', 'none')
        };


        //保险套餐内容切换
        function getSuit(num) {
            if ($scope.suitData&&$scope.suitData.length!=0) {
                if (num == 0) {
                    $scope.d2 = $scope.suitData[0];
                    $('#tbody').html($scope.d2.content)
                }
                if (num == 1) {
                    $scope.d2 = $scope.suitData[1];
                    $('#tbody').html($scope.d2.content)
                }
                if (num == 2) {
                    $scope.d2 = $scope.suitData[2];
                    $('#tbody').html($scope.d2.content)
                }
            }
        }

        //控制年龄，时间选择框内容的显示
        $scope.optBoxShow=function(num){
            $('#ulDiv').show();
            $scope.chosing=true;
            if(num==0){
                $scope.optionData= $scope.allData.productAges
            }
            if(num==1){
                $scope.optionData= $scope.allData.productDays
            }
            if(num==2){
                $scope.optionData= $scope.allData.productSuits
            }
            if(num==3){
                $scope.optionData= $scope.allData.productGenders
            }

        }


        //根据选择不同获取套餐价格
       function getPrice(id1,id2,id3,id4,id5){
            var params={
                ageId:id1,
                dayId:id2,
                suitId:id3,
                genderId:id4,
                prodId:id5
            }
            packageService.getPrice(JSON.stringify(params)).then(function (resp) {
                console.log(resp.data)
                if(resp.data!=undefined){
                $scope.sellPrice=resp.data.price;
                $scope.ppId=resp.data.id;
                }
            })

        }

        //根据选择的内容显示到对应的区域
        $scope.insertContent=function(DATA){
            $('#ulDiv').hide();
            $scope.chosing=false;

            if(DATA.id.indexOf("pa")!=-1){
                $scope.d4=DATA.description;
                $scope.age=DATA.id;
            }else if(DATA.id.indexOf("pt")!=-1){
                $scope.d5=DATA.description;
                $scope.time=DATA.id;
                $scope.section=DATA.section;
            }else if(DATA.id.indexOf("ps")!=-1){
                $scope.d6=DATA.description;
                $scope.suit=DATA.id;
            }else if(DATA.id.indexOf("pg")!=-1){
                $scope.d7=DATA.description;
                $scope.gender=DATA.id;
            }
            var d5=$scope.id;
            getPrice($scope.age,$scope.time,$scope.suit,$scope.gender,d5)
        }

        //页面跳转至被保险人信息填写页面 并将部分Data作为路由参数传递
        $scope.jump=function(){
            $state.go('info-input');
            sessionStorage.setItem('ppid',$scope.ppId);
            sessionStorage.setItem('proId',$stateParams.id);
            sessionStorage.setItem('vaildTime',$scope.section);
        }
        $scope.closeOptions=function(){
            $('#ulDiv').hide();
            $scope.chosing=false;
        }
    }])


//------------
// 保险协议页
//------------
    .controller('packageNoticeCtrl', ['$scope', '$stateParams','packageService','$state',
        function ($scope, $stateParams,packageService,$state) {
            packageService.getProNotice({id:$stateParams.id}).then(function(resp){
                console.log(resp.data)
                //$scope.ProNotice=resp.data;
                $('#noticeWindow').html(resp.data.inform);
            })
            $scope.active_tab = 0;
            $scope.activeTabContent = true;
            $scope.insureNoticeChange = function(label){
                if(label == 0){
                    $scope.active_tab = 0;
                    $scope.activeTabContent = true;
                }else {
                    $scope.active_tab = 1;
                    $scope.activeTabContent = false;
                    packageService.getProWords({id:$stateParams.id}).then(function(resp){
                        console.log(resp)
                        $scope.wordTittleList=resp.dataList;

                    })
                }
            }
            $scope.hrefTo=function(w){
                var base=location.origin+'/insurex/';
                window.location.href=base+ w.url;
                //console.log(base+ w.url);
            }

            $scope.close = function () {
                //sessionStorage.setItem('id',$stateParams.id);
                history.go(-1);
            }



        }])
//------------
// 免费保单信息输入页
//------------
    .controller('freeCtrl', ['$scope', '$stateParams','packageService','$state','$interval','urlTplService',function ($scope, $stateParams,packageService,$state,$interval,urlTplService) {
        /*////////////////////////////////////////
         /!*************获取用户信息*******************!/
         /!*$scope.source; //支付方式 "weixin" ， "market"*!/
         if($scope.source == "market"){
         var tokenValue = sessionStorage.getItem("token");
         if(tokenValue != undefined){
         var params= {
         token: tokenValue
         };
         var url = urlTplService.get('/taikang/getUserInfo.json');
         $.ajax({
         type:"POST",
         url:url,
         data :params,
         contentType: "application/x-www-form-urlencoded"})
         .success(function(resp){
         console.log(resp);
         /!*{"name":"朱博斐","certificateNo":"610404199003110021","mobileNo":"13802581941"}*!/
         if(resp.name != undefined && resp.certificateNo != undefined && resp.mobileNo != undefined ){
         $scope.user.name = resp.name;
         $scope.user.id_number = resp.certificateNo;
         $scope.user.Mobile = resp.mobileNo;
         }

         }
         )
         }
         }
         /////////////////////////////////////////*/

        $scope.inputShow = function (label) {
            /*$('.img-pro').hide();
             $('#input_box').show();*/
            if (label == "0") {/*$state.go('freeInsurex',{type:"fcb"})*/
                $state.go('freeInsurexInput', {type: 'fcb'});
            } else {
                $state.go('freeInsurexInput', {type: 'tdb'});
            }
        }

        if($stateParams.type=='tdb'){
            $scope.prodtype=false;
        }else{
            $scope.prodtype=true;
        }
        /* $scope.change_img=function(){
         $scope.cbox_checked = !$scope.cbox_checked;
         }

         $scope.prodName=$stateParams.type=="tdb"?"铁定保":"飞常保";
         $scope.user={};
         $scope.paracont = "获取验证码";
         $scope.paraevent = false;
         var second = 60,
         timePromise = undefined;

         //获取验证码
         $scope.getCode=function(){
         var tel=$scope.user.Mobile;

         timePromise = $interval(function(){
         if(second<=0){
         $interval.cancel(timePromise);
         timePromise = undefined;
         second = 60;
         $scope.paracont = "重发验证码";
         $scope.sending =false;
         }else{
         $scope.paracont = second + "秒后可重发";
         $scope.sending = true;
         second--;

         }
         },1000,100);
         packageService.getCodeNum({mobileNo:tel}).then(function(resp){
         })
         }

         //华泰免费保险投保
         /!* $scope.successLabel = true;*!/
         $scope.InfoSubmit=function(userData){
         $scope.submitting=true;
         var params= {
         productCode: $stateParams.type,
         name:userData.name,
         verifyCode: userData.codeNum,
         mobileNo:userData.Mobile,
         certificateNo:userData.id_number,
         productName:$scope.prodName
         }

         /!*Form Data*!/
         var url = urlTplService.get('/taikang/purchase.json');
         $.ajax({
         type:"POST",
         url:url,
         data :params,
         contentType: "application/x-www-form-urlencoded"})
         .success(function(resp){
         console.log(resp);
         if(resp.success==true){
         $state.go('home.packageDetail.index');
         }else{
         alert(resp.message);
         $scope.submitting=false;
         /!* $scope.successLabel = resp.success;
         $scope.message = resp.message;*!/
         }

         })
         }}*/

    }])

    .controller('freeInputCtrl', ['$scope', '$stateParams','packageService','$state','$interval','urlTplService',function ($scope, $stateParams,packageService,$state,$interval,urlTplService) {
        ////////////////////////////////////////
        /*************获取用户信息*******************/
        /*$scope.source; //支付方式 "weixin" ， "market"*/
        $scope.user={}
        $scope.submitting=false;
        $scope.result={};

        $scope.freePutDiv = true;
        $scope.putOk = false;
        $scope.putNotOk = false;

        if($scope.source == "market"){
            var tokenValue = sessionStorage.getItem("token");
            console.log(tokenValue)
            if(tokenValue){
                var params= {
                    token: tokenValue,
                    productCode:$stateParams.type
                };
                var url = urlTplService.get('/taikang/getUserInfo.json');
                $.ajax({
                    type:"POST",
                    url:url,
                    data :params,
                    contentType: "application/x-www-form-urlencoded",
                    success:function(data){
                        if(data.name && data.certificateNo&& data.mobileNo ){
                            $scope.user.name=data.name;
                            $scope.user.id_number=data.certificateNo;
                            $scope.user.Mobile=data.mobileNo;

                            $("#name").attr("value",data.name);
                            $("#id_number").attr("value",data.certificateNo);
                            $("#Mobile").attr("value",data.mobileNo);
                            console.log($scope.user)
                    }}}
                )
            }
        }


        $scope.change_img=function(){
            $scope.cbox_checked = !$scope.cbox_checked;
        }
        $scope.prodName=$stateParams.type=="tdb"?"铁定保":"飞常保";
        $scope.paracont = "获取验证码";
        $scope.paraevent = false;
        var second = 60,
        timePromise = undefined;

        //获取验证码
        $scope.sending =false;
        $scope.getCode=function(){
            var tel=$scope.user.Mobile;

            timePromise = $interval(function(){
                if(second<=0){
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    second = 60;
                    $scope.paracont = "重发验证码";
                    $scope.sending =false;
                }else{
                    $scope.paracont = second + "秒后可重发";
                    $scope.sending = true;
                    second--;

                }
            },1000,100);
            packageService.getCodeNum({mobileNo:tel}).then(function(resp){
            })
        }


        //华泰免费保险投保
        $scope.InfoSubmit=function(userData){
            $scope.submitting=true;
            var params= {
                productCode: $stateParams.type,
                name:userData.name,
                 verifyCode: userData.codeNum,
                 mobileNo:userData.Mobile,
                 certificateNo:userData.id_number,
                productName:$scope.prodName,
                token:sessionStorage.getItem("token")
            }
            /*if($scope.source == "weixin"){//支付方式 "weixin" ， "market"
                params.openid = sessionStorage.getItem("openId");
            }else{
                params.token = sessionStorage.getItem("token");
            }*/

                /*Form Data*/
                var url = urlTplService.get('/taikang/purchase.json');
                $.ajax({
                    type:"POST",
                    url:url,
                    data :params,
                    contentType: "application/x-www-form-urlencoded"})
                    .success(function(resp){
                        console.log(resp);
                        if(resp.success==true){
                            /*$state.go('home.packageDetail.index');*/
                            $scope.freePutDiv = false;
                            $scope.putOk = true;
                        }else{
                            $scope.freePutDiv = false;
                            $scope.putNotOk = true;

                            alert(resp.message);
                            $scope.submitting=false;
                            /* $scope.successLabel = resp.success;
                             $scope.message = resp.message;*/
                        }
                    }
                )
            }

        //投保失败界面--确定按钮
        $scope.putFailure = function(){
            $scope.freePutDiv = true;
            $scope.putOk = false;
            $scope.putNotOk = false;
        }
        //投保成功界面--完成按钮
        $scope.putSuccess = function(){
            $state.go('home.index');
        }

    }])


//------------
// 订单信息输入页
//------------

    .controller('infoInputCtrl', ['$scope','$stateParams','packageService','$state','checkId','$timeout', function ($scope,$stateParams,packageService,$state,checkId,$timeout) {
        $scope.submitting = false;
        $scope.waiting=false;
        $scope.postFailed=false;
        $scope.addBox=false;
        $scope.fee;
        $scope.person_selected=false;
        $scope.persons=[];//被保险人信息
        $scope.isPossible=true;
        $scope.emptyPersons=true;
        $scope.vaildTime=sessionStorage.getItem('vaildTime');
        console.log($scope.vaildTime);
        $scope.idIsNotOk=true;
        $scope.nameIsNotOk=true;

        //协议的图标控制切换
        $scope.change_img = function () {
            $scope.cbox_checked = !$scope.cbox_checked;
        }
        //添加联系人窗口的显示
        $scope.addBoxShow=function(){
            $scope.addBox=true;
        }
        //  添加联系人窗口的隐藏
        $scope.cancalAdd=function(){
            $scope.addBox=false;
        }

        $scope.addPerson = {};
        $scope.oneAdd={};
        $scope.editer={};

        //添加新的联系人（被保人信息）
        $scope.Add=function(addInfo) {
            if(addInfo.idType == '01'){
                $scope.idIsNotOk = !(idValueCheck(addInfo.idNumber));
                $scope.nameIsNotOk = addInfo.name;
                console.log($scope.idIsNotOk);
            }
              if(!$scope.idIsNotOk&& addInfo.name || addInfo.idType != '01'){
                    var params = {
                        name: addInfo.name,
                        idType: addInfo.idType,
                        idNumber: addInfo.idNumber
                    }
                    packageService.addPersonInfo(JSON.stringify(params)).then(function (resp) {
                        if (resp.base.code == 0) {
                            getPreInfo();
                            $scope.emptyPersons = false;
                            $scope.addBox = false;
                            $scope.editerBox = false;
                        }
                    })
                }}


        $scope.cancalEiter=function(){
            $scope.editerBox=false;
            getPreInfo();//获取用户缓存信息
        }

        $scope.editerPerson=function(p){
            $scope.editerBox=true;
            console.log(p)
            $scope.editer=p;
        }
        $scope.yes=function(){
            $scope.idIsNotOk=true;
            $scope.nameIsNotOk=true;

        }

        //读取路由临时会话存储中产品信息
        $scope.user={};
        $scope.id= sessionStorage.getItem('proId');
        $scope.ppId= sessionStorage.getItem('ppid');

        //支付方式切换选择
        $scope.wechatpayLabel = "alipay";
        $scope.user.payType ="05";
        if($scope.source == "weixin"){
            $scope.user.payType ="06";
            $scope.wechatpayLabel = "wechatpay";
        }else{
            $scope.user.payType ="05";
            $scope.wechatpayLabel = "alipay";
        }

        /*$scope.payType = function(type){
            if(type == "alipay" ){
                $scope.wechatpayLabel = "alipay";
                $scope.user.payType ="05";
            }else{
                $scope.wechatpayLabel = "wechatpay";
                $scope.user.payType ="06";
            }
        }*/


        //获取用户缓存信息
        function getPreInfo(){
            var sourceType = $scope.source; //支付方式 "weixin" ， "market"
            $scope.headSourceType = sourceType;
            console.log(sourceType);

            var params={
                priceId:$scope.ppId
            }

            packageService.getPreInfo(JSON.stringify(params)).then(
                function(resp){
                    if(resp.base.code=='0'){
                        $scope.preInfo=resp.data;
                        $scope.startDate=$scope.preInfo.startDate.slice(0,10);
                        $('#endDate').html($scope.preInfo.endDate.slice(0,10));
                        $scope.endDate=$scope.preInfo.endDate.slice(0,10);
                        console.log($scope.preInfo);
                        if($scope.preInfo.contact){
                            $scope.user.contacts_name= $scope.preInfo.contact.name;
                            $scope.user.mobile= $scope.preInfo.contact.mobile;
                            $scope.user.idNumber= $scope.preInfo.contact.idNumber;
                            $scope.idIsNotOk = !(idValueCheck($scope.user.idNumber));
                        }
                        if($scope.preInfo.persons && $scope.preInfo.persons.length>0) {
                            $scope.userData = $scope.preInfo.persons;
                            $scope.emptyPersons=false;

                            //初始化付款价格（默认第一个人的价格）
                            var idNum=  $scope.userData[0].idNumber;
                            var params={
                                priceId:$scope.ppId,
                                idCard:idNum
                            }
                            packageService.checkPrice(params).then(function(resp){
                                if(resp.base.code=='0'){
                                    $scope.userData[0].fee=resp.data.price;
                                    $scope.price=$scope.userData[0].fee;
                                    $scope.userData[0].checkLabel =true;

                                    for(var i=1; i<$scope.userData.length; i++){
                                        $scope.userData[i].checkLabel = false;
                                        $scope.userData[i].fee=0;
                                    }
                                    //初始化被保人信息（默认勾选第一个人）
                                    for(var i=0; i<$scope.userData.length; i++){
                                        if($scope.userData[i].checkLabel ==true){
                                            $scope.persons.push({
                                                name: $scope.userData[i].name,
                                                idType: $scope.userData[i].idType,
                                                idNumber: $scope.userData[i].idNumber
                                            });
                                            //$scope.price+=$scope.userData[i].fee;
                                            $scope.isPossible=false
                                        }else{
                                            $scope.isPossible=true;
                                        }
                                    }
                                }
                            })

                        }else{
                            $scope.noPerson=true;
                        }
                    }
                }
            )
        }
        getPreInfo();


        //选择联系人时控制被保人的添加和删除
        $scope.selected=function(p,indexNum){
            $scope.persons=[];
            for(var i=0; i<$scope.userData.length; i++){
                if(i == indexNum){
                    if($scope.userData[i].checkLabel == false){
                        $scope.userData[i].checkLabel = true;
                    }else{
                        $scope.userData[i].checkLabel = false;
                    }
                }
            }
            if(p.fee==0){
                var idNum= p.idNumber;
                var params={
                    priceId:$scope.ppId,
                    idCard:idNum
                }
                packageService.checkPrice(params).then(function(resp){
                    if(resp.base.code=='0'){
                        p.fee=resp.data.price;
                        totalPrice();
                    }
                })
            }else{
                totalPrice();
            }

            console.log($scope.userData)
        }


        //获取总计及更新投保人$scope.persons的值
        function totalPrice(){
            $scope.price=0;
            for(var i=0; i<$scope.userData.length; i++){
                if($scope.userData[i].checkLabel ==true){
                    $scope.persons.push({
                        name: $scope.userData[i].name,
                        idType: $scope.userData[i].idType,
                        idNumber: $scope.userData[i].idNumber
                    });
                    $scope.price+=$scope.userData[i].fee;
                    $scope.isPossible=false
                }else{
                    $scope.isPossible=true;
                }
            }
            console.log($scope.persons)
        }

        //填写完身份证后验证身份信息
        function idValueCheck(idNumber){
            var b=0;
            return checkId.checkIdCard(idNumber,b);
        }

        //控制日期变化
        $('#appDate_start').change(function(){
            if($('#appDate_start').val() < $scope.preInfo.startDate.slice(0,10)){
                $('#startDateTipId').show();
                $('#appDate_start').val($scope.startDate);
                var timer = $timeout(function(){
                    $('#startDateTipId').hide();
                },2000);
            }else{
                $scope.newStartDay=$('#appDate_start').val();
                formatDate = function(d){
                    d = new Date(d);
                    var get = function(num){
                        return num<10 ? '0'+num : num;
                    }
                    return [d.getFullYear(),get(d.getMonth()+1),get(d.getDate())].join('-');
                }
                console.log($scope.newStartDay);
                if($scope.newStartDay){
                    var date=formatDate($scope.newStartDay);
                    $scope.startDate=date;
                    var ss=$scope.newStartDay.slice(0,11);
                    var dd=new Date(ss).getTime();
                    var endTime=dd+(($scope.vaildTime-1)*24*60*60*1000);
                    var endT=formatDate(endTime);
                    $('#endDate').html(endT);
                    $scope.endDate=endT;
                }
            }
        })

        /*$scope.user.payType='06';
        //选择支付方式
        $scope.selectPayMent = function (type) {
            $scope.user.payType = type == 1 ? '05' : '06';
        }*/

        $scope.sure=function(){
            $scope.notVaild=false;
        }

        //////////////////////////////////////////
        //当身份证号改变
        $scope.idNumberTest = function(idNumber){
            $scope.idIsNotOk = !(idValueCheck(idNumber));
        }
        //////////////////////////////////////////

        //投保并支付
        $scope.orderInfoSubmit = function (data) {
            if( idValueCheck($scope.user.idNumber) == true){
                if(!($scope.persons.length>0&&$scope.user.contacts_name&&$scope.user.mobile)) {
                    $scope.notVaild=true;
                }else {
                    $scope.submitting = true;
                    $scope.waiting = true;
                    //console.log(data);
                    //console.log($scope.user);
                    var params = {
                        id: $scope.id,
                        thirdType: $scope.user.payType,
                        fee: $scope.price,
                        tradeType: '08',
                        priceId:$scope.ppId,
                        persons: $scope.persons,
                        startDate:$scope.startDate,
                        endDate:$scope.endDate,
                        contact: {
                            id: "",
                            name: data.contacts_name,
                            mobile: data.mobile,
                            idType: data.idType,
                            idNumber: data.idNumber,
                            user_id: ""
                        }
                    }
                    console.log(params);

                    packageService.postOrderInfo(JSON.stringify(params)).then(function (resp) {
                        console.log(resp);
                        if (resp.base.code == 0) {
                            //alert(resp.data.payResponse)
                            $scope.postFailed = false;
                            $state.go('payment', {data: {paymentString: resp.data.payResponse}})
                        } else {
                            $scope.postFailed = true;
                        }
                        sessionStorage.clear('ppid')
                    })
                }
            }

        }
        //投保失败确认按钮
        $scope.reInput=function(){
            $scope.waiting=false;
            $scope.submitting=false;
            $scope.postFailed=false;
        }

        //日期选择插件配置
        var currYear = (new Date()).getFullYear();
        var opt = {};
        opt.date = {preset: 'date'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy-mm-dd',
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear, //开始年份
        };

        $("#appDate_start").mobiscroll($.extend(opt['date'], opt['default']));
        $("#appDate_end").mobiscroll($.extend(opt['date'], opt['default']));

    }])



//------------
// 支付页
//------------

    .controller('paymentCtrl', ['$scope', '$stateParams','packageService', function ($scope,$stateParams,packageService) {
        document.write($stateParams.data.paymentString);
    }])


    //------------
// 我的订单页 -- 微信入口
//------------

    .controller('myOrderCtrl', ['$scope', '$stateParams','packageService','$state','urlTplService',function ($scope,$stateParams,packageService,$state,urlTplService) {
        $scope.activeTab = '0';
        $scope.orderList='';
        var InNum = '0';
        if($scope.source == "weixin"){
            InNum = '0';
        }else{
            InNum = '1'
        }

        //////////////////////////////
        /*var token = sessionStorage.getItem("token");
        if(token != undefined && token != null && token != ''){
            var params= {
                status:$scope.activeTab
            };
            var url = urlTplService.params('/order/list.json', params);
            $.ajax({
                type:"GET",
                url:url,
                /!*openid:sessionStorage.getItem("token"),*!/
                /!*data :params,*!/
                headers: {
                    openid: sessionStorage.getItem("token")
                }
            })
                /!*.beforeSend(token, openid)*!/
                .success(function(resp){
                    if (resp.base.code==0) {
                        console.log(resp)
                        $scope.orderList = resp.dataList;
                        console.log($scope.orderList)
                    }

                }
            )
        }*/
        packageService.getHelpProjectlist({source:InNum}).then(
            function(resp) {
                if (resp.base.code==0) {
                    $scope.helpProjectlist = resp.dataList;
                    console.log($scope.helpProjectlist);
                }
            }
        );

        packageService.getOrderListData({status:$scope.activeTab}).then(
            function(resp) {
                if (resp.base.code==0) {
                    console.log(resp)
                    $scope.orderList = resp.dataList;
                    console.log($scope.orderList)
                }
            }
        );
        /////////////////////////////

       /* function updateOrderList(num){
            packageService.getOrderListData({status:num}).then(
                function(resp) {
                    if (resp.base.code==0) {
                    console.log(resp)
                    $scope.orderList = resp.dataList;
                    console.log($scope.orderList)
                } }
            );
        }*/
        /*updateOrderList($scope.activeTab);*/

        //已加入被保险人
        $scope.perAddedPerson = function(data){
            var projectId = data.projectId;
            sessionStorage.setItem('projectId',projectId);
            $state.go("helpPlanCenter");
        }

        $scope.tabSelect = function(tabName){
            $scope.orderList='';
            $scope.activeTab = tabName;
            packageService.getOrderListData({status:$scope.activeTab}).then(
                function(resp) {
                    if (resp.base.code==0) {
                        console.log(resp)
                        $scope.orderList = resp.dataList;
                        console.log($scope.orderList);
                    }
                }
            );
        };


        $scope.payIt=function(Num){
            var params=JSON.stringify({id:Num});
            packageService.payAgain(params).then(
                function(resp){
                    if(resp.base.code==0){
                        $state.go('payment',{data:{paymentString:resp.data.payResponse}})}
                }
            )

        }

        //if($rootScope.fromState.name != 'user.myOrderDetail'){$rootScope.lastInfiniteData = null;}
        ////检查是否有最后浏览记录
        //if($rootScope.lastInfiniteData && $rootScope.lastInfiniteData.myOrder){
        //    var _last = $rootScope.lastInfiniteData;
        //
        //    $scope.activeTab = _last.activeTab;
        //    $scope.myOrder = _last.myOrder;
        //    setTimeout(function(){$('body').scrollTop(_last.top);_last = null;},100);
        //}else{
        //    $rootScope.lastInfiniteData = null;
        //    getListData($scope.activeTab);
        //}
        //
        //function getListData(tabName){
        //    var _data = $scope.myOrder[tabName];
        //
        //    if(_data){
        //        var top = _data.scrollTop ? _data.scrollTop : 0;
        //        return setTimeout(function(){$('body').scrollTop(top)},100);
        //    }
        //    var params = {
        //        reqSource:  __SOURCE,
        //        secKey:     userAuthInfo.secKey,
        //        userId:     userAuthInfo.userId,
        //        status:     $scope.activeTab,
        //        page:{page:1, rows:5}
        //    };
        //    $scope.myOrder[tabName] = new Reddit('/opportunity/list', params);
        //    $scope.myOrder[tabName].nextPage();
        //}


    }])



//------------
// 我的订单页 -- 钱盒入口
//------------

    .controller('myOrderMarketCtrl', ['$scope', '$stateParams','packageService','$state','urlTplService',function ($scope,$stateParams,packageService,$state,urlTplService) {
        $scope.activeTab = '0';

        var InNum = '0';
        if($scope.source == "weixin"){
            InNum = '0';
        }else{
            InNum = '1'
        }
        packageService.getHelpProjectlist({source:InNum}).then(
            function(resp) {
                if (resp.base.code==0) {
                    $scope.helpProjectlist = resp.dataList;
                    console.log($scope.helpProjectlist);
                }
            }
        );
        //已加入被保险人
        $scope.perAddedPerson = function(data){
            var projectId = data.projectId;
            sessionStorage.setItem('projectId',projectId);
            $state.go("helpPlanCenter");
        }

        $scope.tabSelect = function(tabName){
            //$scope.orderList='';
            $scope.activeTab = tabName;
            //updateOrderList($scope.activeTab);
        };

    }])

//------------
// 我的 -- 慧择入口
//------------

    .controller('myOrderHuizeCtrl', ['$scope', '$stateParams','packageService','$state','urlTplService',function ($scope,$stateParams,packageService,$state,urlTplService) {
        $scope.questionLabel = false;

        if(sessionStorage.getItem("switchLabelTGF") == null){
            $scope.switchLabelTGF = true; //推广费显示
            sessionStorage.setItem("switchLabelTGF",$scope.switchLabelTGF);
        }else{
            $scope.switchLabelTGF = sessionStorage.getItem("switchLabelTGF");
        }

        packageService.getHuiZeOrderTotal().then(
            function(resp) {
                if (resp.base.code==0) {
                    $scope.lastMonthIncome = resp.data.lastMonthIncome;
                    $scope.thisMonthIncome = resp.data.thisMonthIncome;
                    $scope.totalIncome = resp.data.totalIncome;
                }
            }
        );

        //点击上个月上边的？
        $scope.questionShow = function(){
            $scope.questionLabel = !$scope.questionLabel;
        }

        //我的订单
        $scope.showMyOrder = function(){
            $state.go("myOrderDetail_huize")
        }

        //推广费显示
        $scope.showTGFSwitch = function(){
            $scope.switchLabelTGF = !$scope.switchLabelTGF;
            sessionStorage.setItem("switchLabelTGF",$scope.switchLabelTGF);
        }
        //点击最下排-- 首页 我的 icon
        $scope.homeIconChange = function(label){
            if(label == '0'){//首页
                $state.go('home.index');
            }else if(label == '1'){//我的订单
                //$state.go('myOrder_huize');
            }
        }

    }])

//------------
// 我的--我的订单 -- 慧择入口
//------------

    .controller('myOrderDetailHuizeCtrl', ['$scope', '$stateParams','packageService','$state','urlTplService',function ($scope,$stateParams,packageService,$state,urlTplService) {
        $scope.orderDetailList = [];
        packageService.getHuiZeOrderList().then(
            function(resp) {
                if (resp.base.code == 0) {
                    $scope.orderDetailList = resp.dataList;
                }
            }
        );

    }])


    //------------
    // 保险订单详情页
    //------------

    .controller('OrderDetailCtrl', ['$scope', '$stateParams','packageService', function ($scope, $stateParams,packageService) {
        $scope.emailWaitLabel = false;
        $scope.email_num =" ";
        $scope.emailResultLabel =false;

        packageService.getOrderDetail({id:$stateParams.orderNumber}).then(
            function(resp) {
                if (resp.base.code==0) {
                    console.log(resp);
                    $scope.orderDetailData = resp.data;
            }   }
        );
        $scope.Ewords=function(data){
           /* window.location.href=$scope.persons.policyAddress;*/
            window.location.href=data.policyAddress;
        }

        $scope.emailBoxShow = function () {
            $('#email_box').css('display', 'block')
        }

        $scope.submit_email = function(){
            $scope.emailWaitLabel = true;
            console.log($scope.email_num);
            packageService.postEmailInfo({id:$stateParams.orderNumber, email:$scope.email_num}).then(
                function(resp) {
                    $scope.emailWaitLabel = false;
                    if (resp.base.code==0) {
                        console.log(resp);
                        $scope.emailResultLabel =true;
                    }else{
                    }
                }
            );
            $('#email_box').css('display', 'none');
        }
        $scope.cancelWindow = function () {
            $('#email_box').css('display', 'none');
        }

        $scope.orderPageDisplay = function(){
            $scope.emailResultLabel =false;
        }

    }])

//付款成功后的页面
    .controller('paySuccessCtrl', ['$scope', '$stateParams','getUrlParams','$state', function ($scope, $stateParams,getUrlParams,$state) {
        //function getId(url){
        //    var b=url.indexOf('?'),c=url.slice(b+1).split('&')[0];
        //    return c.split('=')[1]
        //}
        var url=location.href;
         //var id=getId(url);
        var id=getUrlParams.getURLRequestParam(url)['id'];

        $scope.toOrderDetail=function(){
            $state.go('orderDetail',{orderNumber:id})
        }

    }])






