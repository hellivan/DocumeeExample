angular.module('documee_example', ['angular-loading-bar', 'ui.bootstrap', 'ui.router', 'ngRoute', 'LocalStorageModule', 'services', 'controllers', 'directives'])
    .config(['cfpLoadingBarProvider', '$httpProvider', '$routeProvider', 'localStorageServiceProvider', '$documeeApiProvider', '$authenticationProvider',
        function(cfpLoadingBarProvider, $httpProvider, $routeProvider, localStorageServiceProvider, $documeeApiProvider, $authenticationProvider) {

            var apiHostAddress = "http://documee-protoype.herokuapp.com/";

            cfpLoadingBarProvider.includeSpinner = false;
            cfpLoadingBarProvider.includeBar = true;

            $httpProvider.interceptors.push(function ($log, $q, $rootScope, $queryGen) {
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
                            $rootScope.currentQuery = $queryGen.fromHttpConfig(config);
                        }
                        return config;
                    }
                };
            });

            localStorageServiceProvider.setPrefix('ls');
            $authenticationProvider.setOauthKey("U7oog1cN5o_ZsjeoQ_rPOxbFaKA");
            $documeeApiProvider.setHostAddress(apiHostAddress);
            $documeeApiProvider.setApiPath("api/v0/");
        }])

    .run(['$log', '$rootScope', '$location', '$cookies', '$authentication', '$apiKey', function ($log, $rootScope, $location, $cookies, $authentication, $apiKey) {
        $authentication.restoreCredentials();
        $apiKey.updateApiKey("a43d4cda-fecf-44e6-b351-71f6ffc1f7f7");
    }]);



