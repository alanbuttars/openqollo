qolloApp.factory('AuthService', function($http, $q) {

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
        login: login,
        register : register
    }

});