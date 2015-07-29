var appControllers = angular.module('example.controllers', ['example.services', 'ui.bootstrap']);


appControllers.controller("example.MixController", function ($log, $http, $scope, $rootScope, $authentication, $apiKey, $documeeApi, $queryGenerator) {

    $scope.providers = [
        {
            name: 'facebook',
            faClass: 'fa fa-facebook',
            login : $authentication.loginFacebook
        },
        {
            name: 'twitter',
            faClass: 'fa fa-twitter',
            login : $authentication.loginTwitter
        }
    ];

    var useProvider = {};


    $scope.isAuthenticated = function(providerName){
        return $authentication.isAuthenticated(providerName);
    }

    $scope.progState = {
        states : [
            {
                name: 'get_me',
                description: 'Fetch profile-infos',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'providers/me'
                },
                template : 'partials/mixed/user-profile.html'
            },
            {
                name: 'get_friends',
                description: 'Fetch friends',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'providers/friends'
                },
                template : 'partials/mixed/friends-list.html'
            },
        ],
        current : undefined
    };

    $scope.isUsed = function(providerName){
        return useProvider[providerName];
    };

    $scope.toggleUse = function(providerName){
        useProvider[providerName] = !useProvider[providerName];
    };


    $scope.switchState = function(newState){
        $scope.data = undefined;
        $scope.progState.current = undefined;

        if(newState){
            if(newState.api){
                var queryProviders = [];

                $scope.providers.forEach(function(provider){
                    if($scope.isAuthenticated(provider.name) && $scope.isUsed(provider.name)){
                        queryProviders.push(provider.name);
                    }
                });
                $log.debug(queryProviders);
                var params = {providers:queryProviders};


                $scope.query = $queryGenerator.genQuery(newState, params);
                $http[newState.api.method](newState.api.call, {params: params}).
                    success(function(data, status, headers, config) {
                        $log.debug("Success: " + JSON.stringify(data));
                        $scope.data = data;
                        $scope.progState.current = newState.name;
                        $apiKey.setError();
                    }).
                    error(function(data, status, headers, config) {
                        $log.debug("Error: " + JSON.stringify(data));
                        if(status === 401){
                            if(data.type === "KEY"){
                                $apiKey.setError(data.message);
                            }
                        }
                    });
            } else if(newState.template) {
                $scope.progState.current = newState.name;
            }
        }
    };

    $log.debug("Loaded MixController");
});


appControllers.controller("example.TwitterController", function ($log, $http, $scope, $rootScope, $authentication, $apiKey, $documeeApi, $queryGenerator) {
    $scope.twitterstate = {
        states : [
            {
                name : 'get_user',
                description : 'Fetch user information on twitter',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'twitter/me'
                },
                template : 'partials/twitter/user-profile.html'
            },
            {
                name: 'get_friends',
                description: 'Fetch friends on twitter',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'twitter/friends'
                },
                template : 'partials/twitter/friends-list.html'
            },
            {
                name: 'get_following',
                description: 'Fetch people following on twitter',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'twitter/following'
                },
                template : 'partials/twitter/friends-list.html'
            },
            {
                name: 'get_followers',
                description: 'Fetch followers on twitter',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'twitter/followers'
                },
                template : 'partials/twitter/friends-list.html'
            },
            {
                name: 'get_trends',
                description: 'Fetch top 10 trends on twitter',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'twitter/trends'
                },
                template : 'partials/twitter/trends-list.html'
            },
            {
                name : 'post_status',
                description : 'Post status-update on twitter',
                template : 'partials/twitter/post-update.html'
            }
        ],
        current : undefined
    };

    $scope.switchTwitterState = function(state){
        $scope.data_twitter = undefined;
        $scope.twitterstate.current = undefined;

        if(state){
            if(state.api){
                $scope.query = $queryGenerator.genQuery(state);
                $http[state.api.method](state.api.call).
                    success(function(data, status, headers, config) {
                        $log.debug(data);
                        $scope.data_twitter = data;
                        $scope.twitterstate.current = state.name;
                        $apiKey.setError();
                    }).
                    error(function(data, status, headers, config) {
                        $log.debug("Error: " + data);
                        if(status === 401){
                            if(data.type === "KEY"){
                                $apiKey.setError(data.message);
                            }
                        }
                    });
            } else if(state.template) {
                $scope.twitterstate.current = state.name;
            }
        }
    };


    $scope.login = function(){
        $authentication.loginFacebook();
    };

    $log.debug("Started controller Twitter-Controller");
});


appControllers.controller("example.FacebookController", function ($log, $http, $scope, $rootScope, $authentication, $apiKey, $documeeApi, $queryGenerator) {
    $scope.fbstate = {
        states : [
            {
                name: 'get_me',
                description: 'Fetch profile-infos from Facebook',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'fb/me'
                },
                template : 'partials/facebook/user-profile.html'
            },
            {
                name: 'get_friends',
                description: 'Fetch tagable friends from Facebook',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'fb/friends'
                },
                template : 'partials/facebook/friends-list.html'
            },

            {
                name: 'get_feeds',
                description: 'Fetch latest feeds on Facebook',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'fb/feeds'
                },
                template : 'partials/facebook/feeds-list.html'
            },
            {
                name: 'get_permissions',
                description: 'Fetch all app-permissions',
                api : {
                    method : 'get',
                    call : $documeeApi.baseAddress + 'fb/permissions'
                },
                template : 'partials/facebook/permissions-list.html'
            },
            {
                name: 'delete_permissions',
                description: 'Delete all Facebook app-permissions',
                api : {
                    method : 'delete',
                    call : $documeeApi.baseAddress + 'fb/permissions'
                }
            },
            {
                name : 'post_status',
                description : 'Post status-update on facebook',
                template : 'partials/facebook/post-update.html'
            }

        ],
        current : undefined
    };

    $scope.switchFbState = function(state){
        $scope.data_fb = undefined;
        $scope.fbstate.current = undefined;

        if(state){
            if(state.api){
                $scope.query = $queryGenerator.genQuery(state);
                $http[state.api.method](state.api.call).
                    success(function(data, status, headers, config) {
                        $log.debug("Success: " + JSON.stringify(data));
                        $scope.data_fb = data;
                        $scope.fbstate.current = state.name;
                        $apiKey.setError();
                    }).
                    error(function(data, status, headers, config) {
                        $log.debug("Error: " + JSON.stringify(data));
                        if(status === 401){
                            if(data.type === "KEY"){
                                $apiKey.setError(data.message);
                            }
                        }
                    });
            } else if(state.template) {
                $scope.fbstate.current = state.name;
            }
        }
    };

    $scope.login = function(){
        $authentication.loginFacebook();
    };

    $log.debug("Started controller Facebook-Controller")
});


appControllers.controller('example.NavbarController', function($scope, $http, $rootScope, $modal, $apiKey){
    $scope.showKeyDialog = function(size){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'partials/dialogs/change-api-key.html',
            controller: 'example.ChangeApiKeyController',
            size: size,
            resolve: {
                api_key: function () {
                    return $rootScope.api_key;
                }
            }
        });

        modalInstance.result.then(function (api_key) {
            $apiKey.updateApiKey(api_key);
        }, function (param) {
            console.log('Modal dismissed at: ' + new Date() +" - " +param);
        });

    };


});


appControllers.controller('example.ChangeApiKeyController', function($scope, $modalInstance, api_key) {
    $scope.api_key = api_key;


    $scope.save = function(){
        $modalInstance.close($scope.api_key);
    };

    $scope.cancel = function(){
        $modalInstance.dismiss('user - cancel');
    };

});

appControllers.controller("example.PostFbStatusController", function($http, $scope, $apiKey, $documeeApi){

    $scope.status = undefined;

    $scope.postStatus = function(){
        $http.post($documeeApi.baseAddress + "fb/status", {status: $scope.status}).
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.status = undefined;
                $apiKey.setError();
            }).
            error(function(data, status, headers, config) {
                console.log("Error: " + data);
                if(status === 401){
                    if(data.type === "KEY"){
                        $apiKey.setError(data.message);
                    }
                }
            });
    };
});

appControllers.controller("example.PostTwitterStatusController", function($http, $scope, $apiKey, $documeeApi){

    $scope.status = undefined;

    $scope.postStatus = function(){
        $http.post($documeeApi.baseAddress + "twitter/status", {status: $scope.status}).
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.status = undefined;
                $apiKey.setError();
            }).
            error(function(data, status, headers, config) {
                console.log("Error: " + data);
                if(status === 401){
                    if(data.type === "KEY"){
                        $apiKey.setError(data.message);
                    }
                }
            });
    };
});