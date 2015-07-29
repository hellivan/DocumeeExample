var app = angular.module('documee_demo', ['angular-loading-bar', 'ui.bootstrap', 'ui.router', 'ngRoute', 'LocalStorageModule', 'example.services', 'example.controllers']);

app.config(['cfpLoadingBarProvider', '$httpProvider', '$routeProvider', 'localStorageServiceProvider', '$documeeApiProvider', '$authenticationProvider',
    function(cfpLoadingBarProvider, $httpProvider, $routeProvider, localStorageServiceProvider, $documeeApiProvider, $authenticationProvider) {

        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;

        $httpProvider.interceptors.push(function ($q, $rootScope) {
            return {
                'response': function (response) {
                    return response || $q.when(response);
                },
                'responseError': function (rejection) {
                    console.log("Injected error method");
                    console.log(rejection);
                    return $q.reject(rejection);
                }
            };
        });

        localStorageServiceProvider.setPrefix('ls');
        $authenticationProvider.setOauthKey("U7oog1cN5o_ZsjeoQ_rPOxbFaKA");
        $documeeApiProvider.setHostAddress("http://documee-protoype.herokuapp.com/");
        $documeeApiProvider.setApiPath("api/v0/");
    }]);


app.run(
    function ($log, $rootScope, $location, $cookies, $authentication, $apiKey) {
        $authentication.restoreCredentials();
        $apiKey.updateApiKey("a43d4cda-fecf-44e6-b351-71f6ffc1f7f7");
    });



