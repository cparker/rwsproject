!function(a){"use strict";function b(a,b){var h,i,j,k,l,m,n,o,p,q,r,s,t="",u=!1;if(isNaN(a))throw new Error("Invalid arguments");return b=b||{},j=b.bits===!0,o=b.unix===!0,i=void 0!==b.base?b.base:o?2:10,n=void 0!==b.round?b.round:o?1:2,p=void 0!==b.spacer?b.spacer:o?"":" ",s=void 0!==b.suffixes?b.suffixes:{},m=Number(a),l=0>m,k=i>2?1e3:1024,l&&(m=-m),0===m?o?t="0":(q="B",t="0"+p+(s[q]||q)):(h=Math.floor(Math.log(m)/Math.log(1e3)),h>8&&(t=1e3*t*(h-8),h=8),t=2===i?m/Math.pow(2,10*h):m/Math.pow(1e3,h),j&&(t=8*t,t>k&&(t/=k,h++)),t=t.toFixed(h>0?n:0),q=g[j?"bits":"bytes"][h],!u&&o?(j&&c.test(q)&&(q=q.toLowerCase()),q=q.charAt(0),r=t.replace(e,""),"B"===q?q="":j||"k"!==q||(q="K"),f.test(r)&&(t=parseInt(t,d)),t+=p+(s[q]||q)):o||(t+=p+(s[q]||q))),l&&(t="-"+t),t}var c=/b$/,d=10,e=/.*\./,f=/^0$/,g={bits:["B","kb","Mb","Gb","Tb","Pb","Eb","Zb","Yb"],bytes:["B","kB","MB","GB","TB","PB","EB","ZB","YB"]};"undefined"!=typeof exports?module.exports=b:"function"==typeof define?define(function(){return b}):a.filesize=b}(this),angular.module("rwsprojectApp",["angularFileUpload","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/launcher.html",controller:"launcherCtrl"}).when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl",reloadOnSearch:!1}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/files",{templateUrl:"views/files.html",controller:"filesCtrl",reloadOnSearch:!1}).when("/dirs",{templateUrl:"views/dirs.html",controller:"filesCtrl",reloadOnSearch:!1}).when("/#tab:*/",{reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]),angular.module("rwsprojectApp").factory("dataService",["$http",function(a){var b={selectedFixtureLine:void 0,fixtureLines:[],fixtureLineSelectChoices:[],addFixtureLine:function(a,b,c,d,e){a.fixtureLineId=this.fixtureLines.length,a.selectedAccessories=b,a.projectId=c,a.notes=e,this.fixtureLines.push(a),this.fixtureLineSelectChoices[a.fixtureLineId]=d,this.selectedFixtureLine=a.fixtureLineId,this.submitFixtureLine(a)},getFixtureLines:function(){return this.fixtureLines},deleteFixtureLine:function(a){for(var b=void 0,c=0;c<this.fixtureLines.length;c++)a===this.fixtureLines[c][this.fixtureLineId];this.fixtureLines.splice(b,1)},selectFixtureLine:function(a){this.selectedFixtureLine=a;var b=_.find(this.fixtureLines,function(b){return b.fixtureLineId===a});return[b,this.fixtureLineSelectChoices[a]]},isLineSelected:function(a){return this.selectedFixtureLine===a},submitProjectInfo:function(b){return a({method:"POST",url:"/server/submitProjectInfo",data:b})},fetchProjectInfo:function(){return a({method:"GET",url:"/server/getProjectInfo"})},fetchRegions:function(){return a.get("/server/regions")},fetchFixtureTypes:function(b){return a.get("/server/getFixtureTypes?regionId="+b)},fetchMountTypes:function(b,c){return a.get("/server/getMountTypes?regionId="+b+"&fixtureTypeId="+c)},fetchFixtureSizes:function(b,c,d){return a.get("/server/getFixtureSizes?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d)},fetchDistributions:function(b,c,d,e){return a.get("/server/getDistributions?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d+"&fixtureSizeId="+e)},fetchLumens:function(b,c,d,e,f){return a.get("/server/getLumens?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d+"&fixtureSizeId="+e+"&distributionId="+f)},fetchChannels:function(b,c,d,e,f,g){return a.get("/server/getChannels?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d+"&fixtureSizeId="+e+"&distributionId="+f+"&lumensId="+g)},fetchManufacturers:function(b,c,d,e,f,g,h){return a.get("/server/getManufacturers?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d+"&fixtureSizeId="+e+"&distributionId="+f+"&lumensId="+g+"&channelsId="+h)},fetchControlMethods:function(b,c,d,e,f,g,h,i){return a.get("/server/getControlMethods?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d+"&fixtureSizeId="+e+"&distributionId="+f+"&lumensId="+g+"&channelsId="+h+"&manufacturerId="+i)},getPartInfo:function(b,c,d,e,f,g,h,i,j){return a.get("/server/getPartInfo?regionId="+b+"&fixtureTypeId="+c+"&mountTypeId="+d+"&fixtureSizeId="+e+"&distributionId="+f+"&lumensId="+g+"&channelsId="+h+"&manufacturerId="+i+"&controlMethodId="+j)},fetchAccessories:function(){return a.get("/server/getAccessories")},submitFixtureLine:function(b){return a({method:"POST",url:"/server/submitFixture",data:b})},getFiles:function(b){return a.get(b?"/server/getFiles?dir="+b:"/server/getFiles")},checkAccess:function(){return a.get("/server/checkAccess")},doLogin:function(b,c){var d={username:b,password:c};return a({method:"POST",url:"/server/login",data:d})}};return b}]),angular.module("rwsprojectApp").controller("MainCtrl",["$scope","$http","$rootScope",function(){}]),angular.module("rwsprojectApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("rwsprojectApp").controller("HomeCtrl",["$scope",function(){}]),angular.module("rwsprojectApp").controller("filesCtrl",["$scope","FileUploader","dataService","$route",function(a,b,c,d){console.log("current params"),console.log(d),a.baseUploadURL="/server/uploadFile",a.fileData={files:[],dirs:[]},a.filesize=filesize;var e=function(b){c.getFiles(b).success(function(b){a.fileData=b.payload}).error(function(a){console.log(a)})};a.selectDir=function(a){console.log("dirUrl is "+a.url),e(a)},a.uploader=new b,a.uploader.url=a.baseUploadURL,a.uploader.removeAfterUpload=!0,a.uploader.onWhenAddingFileFailed=function(a,b,c){console.info("onWhenAddingFileFailed",a,b,c)},a.uploader.onAfterAddingFile=function(a){console.info("onAfterAddingFile",a)},a.uploader.onAfterAddingAll=function(a){console.info("onAfterAddingAll",a)},a.uploader.onBeforeUploadItem=function(a){console.info("onBeforeUploadItem",a)},a.uploader.onProgressItem=function(a,b){console.info("onProgressItem",a,b)},a.uploader.onProgressAll=function(a){console.info("onProgressAll",a)},a.uploader.onSuccessItem=function(a,b,c,d){console.info("onSuccessItem",a,b,c,d)},a.uploader.onErrorItem=function(a,b,c,d){console.info("onErrorItem",a,b,c,d)},a.uploader.onCancelItem=function(a,b,c,d){console.info("onCancelItem",a,b,c,d)},a.uploader.onCompleteItem=function(a,b,c,d){console.info("onCompleteItem",a,b,c,d)},a.uploader.onCompleteAll=function(){console.info("onCompleteAll"),e(d.current.params.dir)},d.current.params.dir&&(a.selectedDir=d.current.params.dir,a.uploader.url=a.baseUploadURL+"?dir="+d.current.params.dir,e(d.current.params.dir))}]),angular.module("rwsprojectApp").controller("launcherCtrl",["$scope","FileUploader","dataService","$route","$rootScope",function(a,b,c,d,e){a.user={},c.checkAccess().success(function(){e.isLoggedIn=!0,a.$emit("loggedInChanged",!0)}).error(function(){e.isLoggedIn=!1,a.$emit("loggedInChanged",!1)}),a.doLogin=function(){c.doLogin(a.user.name,a.user.password).success(function(){e.isLoggedIn=!0,a.invalidCredentials=!1,a.$emit("loggedInChanged",!0)}).error(function(b){a.invalidCredentials=!0,a.$emit("loggedInChanged",!1),console.log(b)})}}]),angular.module("rwsprojectApp").controller("projectInfoFormController",["$scope","$filter","$rootScope","dataService",function(a,b,c,d){a.regions=[{name:"EMEA",id:1},{name:"APAC",id:2}],c.tabs.tabOne={dateTime:b("date")(new Date,"yyyy-MM-dd hh:mm:ss a"),projectName:void 0,address:void 0,region:{name:"EMEA",id:2},createdBy:void 0,basedOn:void 0,email:void 0,notes:void 0,region_id:2},d.fetchRegions().success(function(b){a.regions=b.payload}).error(function(){a.$emit("error retrieving regions")}),d.fetchProjectInfo().success(function(a){console.log("received project info"),console.log(a),c.tabs.tabOne=a,console.log(c.tabs.tabOne)}).error(function(){console.log("no active project")}),c.$on("tabLosingFocus",function(b,e,f){"tab1"===e?a.projectInfo.$valid?(d.submitProjectInfo(c.tabs.tabOne),c.tabs.activeTab=f):a.projectInfo.$setSubmitted():c.tabs.activeTab=f})}]),angular.module("rwsprojectApp").controller("fixtureFormController",["$scope","$filter","$rootScope","dataService",function(a,b,c,d){c.dropDownChoices={fixtureTypes:[{name:"FIXTURE ONE",id:1},{name:"FIXTURE TWO",id:2}],mountTypes:[{name:"MOUNT ONE",id:1},{name:"MOUNT TWO",id:2}],fixtureSizes:[{name:"SIZE ONE",id:1},{name:"SIZE TWO",id:2}],distributions:[{name:"dist1",id:1},{name:"dist2",id:2}],lumens:[{name:"100",id:1},{name:"200",id:2}],channels:[{name:"1",id:1},{name:"2",id:2}],manufacturers:[{name:"m1",id:1},{name:"m2",id:2}],controlMethods:[{name:"c1",id:1},{name:"c2",id:2}],sensorTypes:[{name:"None",id:1},{name:"Normal",id:2},{name:"Low",id:3},{name:"High",id:4}]},c.fixtureForm={},a.fixtureLines=[],c.$on("tabLosingFocus",function(a,b,e){"tab2"===e&&d.fetchFixtureTypes(c.tabs.tabOne.region.id).success(function(a){c.dropDownChoices.fixtureTypes=a.payload}).error(function(a){console.log(a)})}),a.changeFixtureType=function(){d.fetchMountTypes(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id).success(function(a){c.dropDownChoices.mountTypes=a.payload}).error(function(a){console.log(a)})},a.changeMountType=function(){d.fetchFixtureSizes(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id).success(function(a){c.dropDownChoices.fixtureSizes=a.payload}).error(function(a){console.log(a)})},a.changeFixtureSize=function(){d.fetchDistributions(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id,c.fixtureForm.fixtureSize.id).success(function(a){c.dropDownChoices.distributions=a.payload}).error(function(a){console.log(a)})},a.changeDistribution=function(){d.fetchLumens(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id,c.fixtureForm.fixtureSize.id,c.fixtureForm.distribution.id).success(function(a){c.dropDownChoices.lumens=a.payload}).error(function(a){console.log(a)})},a.changeLumens=function(){d.fetchChannels(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id,c.fixtureForm.fixtureSize.id,c.fixtureForm.distribution.id,c.fixtureForm.lumens.id).success(function(a){c.dropDownChoices.channels=a.payload}).error(function(a){console.log(a)})},a.changeChannels=function(){d.fetchManufacturers(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id,c.fixtureForm.fixtureSize.id,c.fixtureForm.distribution.id,c.fixtureForm.lumens.id,c.fixtureForm.channels.id).success(function(a){c.dropDownChoices.manufacturers=a.payload}).error(function(a){console.log(a)})},a.changeManufacturers=function(){d.fetchControlMethods(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id,c.fixtureForm.fixtureSize.id,c.fixtureForm.distribution.id,c.fixtureForm.lumens.id,c.fixtureForm.channels.id,c.fixtureForm.manufacturer.id).success(function(a){c.dropDownChoices.controlMethods=a.payload}).error(function(a){console.log(a)})},a.changeControlMethod=function(){d.getPartInfo(c.tabs.tabOne.region.id,c.fixtureForm.fixtureType.id,c.fixtureForm.mountType.id,c.fixtureForm.fixtureSize.id,c.fixtureForm.distribution.id,c.fixtureForm.lumens.id,c.fixtureForm.channels.id,c.fixtureForm.manufacturer.id,c.fixtureForm.controlMethod.id).success(function(a){c.fixtureForm.partInfo=a.payload[0]}).error(function(a){console.log(a)})},a.addFixtureLine=function(){a.fixtureTabForm.$setSubmitted();var b=_.map(c.selectedAccessories,function(b,c){return{accessoryCount:b,accessory:a.accessories[c]}}),e=_.filter(b,function(a){return void 0!=a.accessoryCount});a.fixtureTabForm.$valid&&d.addFixtureLine(c.fixtureForm,e,c.tabs.tabOne.dateTime,c.dropDownChoices,c.copiedFixtureNotes)},a.resetFixtureForm=function(){c.fixtureForm={},a.fixtureTabForm.$setPristine(),d.selectedFixtureLine=void 0,c.selectedAccessories=[]},a.hasLineBeenAdded=function(){return void 0!=a.fixtureForm.fixtureLineId}}]),angular.module("rwsprojectApp").controller("tabController",["$scope","$rootScope","$route","$http","$filter","dataService",function(a,b,c,d,e,f){b.isLoggedIn=void 0,a.invalidCredentials=!1,a.user={},b.tabs={},b.tabs.activeTab="tab1",a.selectedLineId=void 0,b.tabs.accessoriesDialogHide=!0,b.tabs.notesDialogHide=!0,a.regions=[],a.selectedRegion=0,a.accessories=[],b.selectedAccessories=[],a.fixtureNotes="these are notes",f.fetchAccessories().success(function(b){a.accessories=b.payload}).error(function(b){a.$emit("httpError","Failed to fetch accessories "+b)}),a.deleteFixtureLine=function(a){f.deleteFixtureLine(a)},a.fixtureLineSelect=function(a){var c=f.selectFixtureLine(a.fixtureLineId);b.dropDownChoices=c[1],b.fixtureForm=c[0]},a.isLineSelected=function(a){return f.isLineSelected(a.fixtureLineId)},a.tabs.tabClick=function(b){a.$emit("tabLosingFocus",a.tabs.activeTab,b)},a.tabs.isTabActive=function(b){return b==a.tabs.activeTab},a.tabs.toggleAccessoriesDialog=function(){a.tabs.accessoriesDialogHide=0==a.tabs.accessoriesDialogHide},a.tabs.toggleNotesDialog=function(){b.copiedFixtureNotes=a.fixtureNotes,a.tabs.notesDialogHide=0==a.tabs.notesDialogHide},d.get("/server/checkAccess").success(function(){console.log("we are logged in"),b.isLoggedIn=!0,a.$emit("loggedInChanged",!0)}).error(function(){console.log("we are not logged in"),b.isLoggedIn=!1,a.$emit("loggedInChanged",!1)}),b.tempToggleLogin=function(){b.isLoggedIn=!b.isLoggedIn},a.getFixtureLines=function(){return f.getFixtureLines()},a.tabClass=function(a,c,d){return d==b.tabs.activeTab?a:c}}]);