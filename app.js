var app = angular.module('documee_demo', ['angular-loading-bar', 'ui.bootstrap', 'ui.router', 'ngRoute', 'LocalStorageModule', 'example.services', 'example.controllers']);

app.config(['cfpLoadingBarProvider', '$httpProvider', '$routeProvider', 'localStorageServiceProvider', '$documeeApiProvider',
    function(cfpLoadingBarProvider, $httpProvider, $routeProvider, localStorageServiceProvider, $documeeApiProvider) {

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

        $documeeApiProvider.setHostAddress("http://documee-protoype.herokuapp.com/");
        $documeeApiProvider.setApiPath("api/v0/");
    }]);


app.run(
    function ($log, $rootScope, $location, $cookies, $authentication) {
        $authentication.restoreCredentials();
    });



