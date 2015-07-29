angular.module('services', ['ngCookies', 'LocalStorageModule'])
    .provider('$authentication',  [function() {
        var oauthKey;

        return {
            setOauthKey : function(key){
                oauthKey = key;
            },
            $get : ['$log', '$http', '$rootScope', '$cookies', 'localStorageService', function($log, $http, $rootScope, $cookies, localStorageService){
                var service = {};

                function updateHeaders(){
                    if($rootScope.auth){
                        if($rootScope.auth.facebook){
                            $http.defaults.headers.common.fb_access_token = $rootScope.auth.facebook.credentials.access_token;
                        }
                        if($rootScope.auth.twitter){
                            $http.defaults.headers.common.twitter_oauth_token = $rootScope.auth.twitter.credentials.oauth_token;
                            $http.defaults.headers.common.twitter_oauth_token_secret = $rootScope.auth.twitter.credentials.oauth_token_secret;
                        }
                    }
                }

                service.isAuthenticated = function(provider){
                    if($rootScope.auth){
                        if($rootScope.auth[provider]){
                            return $rootScope.auth[provider].authenticated;
                        }
                    }
                    return false;
                }

                service.setCredentials = function (provider, credentials, persistent, apply) {
                    $log.debug('Setting credential for ' + provider + ' to ' + JSON.stringify(credentials));
                    if(!$rootScope.auth){
                        $rootScope.auth ={};
                    }
                    $rootScope.auth[provider] = {
                        authenticated : true,
                        credentials : credentials
                    };

                    updateHeaders();

                    if(persistent){
                        $log.debug('Persisting auth ' + JSON.stringify($rootScope.auth) + ' to local storage...');
                        localStorageService.set('auth', $rootScope.auth);
                    }
                    if(apply){
                        $log.debug('Calling apply for rootScope');
                        $rootScope.$apply();
                    }
                };

                service.restoreCredentials = function(){
                    var auth = localStorageService.get('auth');
                    $log.debug('Auth is ' +  JSON.stringify(auth));
                    if(auth){
                        for(var provider in auth){
                            service.setCredentials(provider, auth[provider].credentials);
                        }
                    }

                };

                service.clearCredentials = function (provider) {
                    if($rootScope.auth){
                        if(provider){
                            delete $rootScope.auth[provider];
                        } else {
                            delete $rootScope.auth;
                        }
                    }
                    $cookies.put('auth', $rootScope.auth);
                };

                service.loginTwitter = function(){
                    OAuth.initialize(oauthKey);
                    OAuth.popup('twitter', {cache: false}).done(function(result) {
                        $log.debug("Authenticated with twitter");
                        $log.debug(result);
                        service.setCredentials('twitter', {
                            oauth_token: result.oauth_token,
                            oauth_token_secret: result.oauth_token_secret
                        }, true, true);
                    });
                };

                service.loginFacebook = function(){
                    OAuth.initialize(oauthKey);
                    OAuth.popup('facebook', {cache: false}).done(function(result) {
                        $log.debug("Authenticated with facebook");
                        $log.debug(result);
                        service.setCredentials('facebook', {
                            access_token: result.access_token,
                            token_type: result.token_type,
                            expires_in: result.expires_in
                        }, true, true);
                    });
                };

                return service;
            }]
        };
    }])

    .factory('$queryGen', [function(){
        var service = {};

        service.fromParams = function(method, url, params, postData){
            var paramsArr = [];
            if(params){
                for(var paramName in params){
                    if( Object.prototype.toString.call( params[paramName] ) === '[object Array]' ) {
                        params[paramName].forEach(function(param){
                            paramsArr.push(paramName+"="+param);
                        });
                    } else {
                        paramsArr.push(paramName+"="+params[paramName]);
                    }
                }
            }
            var queryString = method.toUpperCase() + " - " + url;
            if(paramsArr.length>0){
                queryString += "?" + paramsArr.join("&");
            }
            if(postData){
                queryString+= "\n" + JSON.stringify(postData);
            }
            return queryString;
        }

        service.fromHttpConfig = function (config){
            return service.fromParams(config.method, config.url, config.params);
        };

        return service;
    }])

    .factory('$apiKey', ['$log', '$rootScope', '$http', function($log, $rootScope, $http){
        var service = {};

        service.setError = function(message){
            $rootScope.key_error = message;
            if(message){
                $rootScope.keyStyle = "red";
            } else {
                delete $rootScope.keyStyle;
            }
        };

        service.updateApiKey = function (api_key){
            $rootScope.api_key = api_key;
            $http.defaults.headers.common.api_key = api_key;
        };

        return service;
    }])
    .provider('$documeeApi', [function(){

        var apiPath;
        var apiHost;

        return {
            setHostAddress : function (host){
                apiHost = host;
            },

            setApiPath : function (path){
                apiPath = path;
            },

            $get : function(){
                return {
                    baseAddress : apiHost + apiPath
                };
            }
        };
    }]);