qolloApp.factory('AuthService', function($http, $q) {

    var authenticate = function() {
        var deferred = $q.defer();

        $http({
            method : 'POST',
            url : 'http://qollo.alanbuttars.com/server/rest/authenticate.php',
            headers : { 'content-type':'application/json' }
        })
        .success(function(data) {
            log("authenticate success: {0}", JSON.stringify(data));
            deferred.resolve(data);
        })
        .error(function(error) {
            log("authenticate error: {0}", JSON.stringify(error));
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var login = function(user) {
        var deferred = $q.defer();

        $http({
            method	: 'POST',
            url		: 'http://qollo.alanbuttars.com/server/rest/login.php',
            data	: user,
            headers : { 'content-type':'application/json' }
        })
        .success(function(data) {
            log("login success: {0}", JSON.stringify(data));
            deferred.resolve(data);
        })
        .error(function(error) {
            log("login error: {0}", JSON.stringify(error));
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var logout = function() {
        window.localStorage.setItem("tokenPublic", "");
        window.localStorage.setItem("tokenPrivate", "");
        window.localStorage.setItem("userId", "");
    };

    var register = function(user) {
        var deferred = $q.defer();

        $http({
            method	: 'POST',
            url		: 'http://qollo.alanbuttars.com/server/rest/register.php',
            data	: user,
            headers : { 'content-type':'application/json' }
        })
        .success(function(data) {
            log("login success: {0}", JSON.stringify(data));
            deferred.resolve(data);
        })
        .error(function(error) {
            log("login error: {0}", JSON.stringify(error));
            deferred.reject(error);
        });

        return deferred.promise;
    };

    return {
        authenticate : authenticate,
        login: login,
        logout : logout,
        register : register
    }

});

qolloApp.factory('UserService', function($http, $q) {

    var getProfile = function() {
        var deferred = $q.defer();

        $http({
            method : 'POST',
            url : 'http://qollo.alanbuttars.com/server/rest/user-profile.php',
            headers : { 'content-type':'application/json' }
        })
        .success(function(data) {
            log("getProfile success: {0}", JSON.stringify(data));
            deferred.resolve(data);
        })
        .error(function(error) {
            log("getProfile error: {0}", JSON.stringify(error));
            deferred.reject(error);
        });

        return deferred.promise;
    };

    return {
        getProfile : getProfile
    };
});