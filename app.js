var app = angular.module('documee_demo', ['angular-loading-bar', 'ui.bootstrap', 'ui.router', 'ngRoute', 'LocalStorageModule', 'example.services', 'example.controllers', 'example.directives']);

app.config(['cfpLoadingBarProvider', '$httpProvider', '$routeProvider', 'localStorageServiceProvider', '$documeeApiProvider', '$authenticationProvider',
    function(cfpLoadingBarProvider, $httpProvider, $routeProvider, localStorageServiceProvider, $documeeApiProvider, $authenticationProvider) {

        var apiHostAddress = "http://documee-protoype.herokuapp.com/";

        function genQuery(config){
            var paramsArr = [];
            if(config.params){
                for(var paramName in config.params){
                    if( Object.prototype.toString.call( config.params[paramName] ) === '[object Array]' ) {
                        config.params[paramName].forEach(function(param){
                            paramsArr.push(paramName+"="+param);
                        });
                    } else {
                        paramsArr.push(paramName+"="+config.params[paramName]);
                    }
                }
            }
            var queryString = config.method + " - " + config.url;
            if(paramsArr.length>0){
                queryString += "?" + paramsArr.join("&");
            }
            return queryString;
        };

        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;

        $httpProvider.interceptors.push(function ($log, $q, $rootScope) {
            return {
                'response': function (response) {
                    return response || $q.when(response);
                },
                'responseError': function (rejection) {
                    $log.debug("Injected error method");
                    $log.debug(rejection);
                    return $q.reject(rejection);
                },
                'request': function(config) {
                    if(config.url.indexOf(apiHostAddress)>-1){
                        $rootScope.currentQuery = genQuery(config);
                    }
                    return config;
                }
            };
        });

        localStorageServiceProvider.setPrefix('ls');
        $authenticationProvider.setOauthKey("U7oog1cN5o_ZsjeoQ_rPOxbFaKA");
        $documeeApiProvider.setHostAddress(apiHostAddress);
        $documeeApiProvider.setApiPath("api/v0/");
    }]);


app.run(
    function ($log, $rootScope, $location, $cookies, $authentication, $apiKey) {
        $authentication.restoreCredentials();
        $apiKey.updateApiKey("a43d4cda-fecf-44e6-b351-71f6ffc1f7f7");
    });



