qolloApp.factory('qolloInterceptor', ['$rootScope', '$injector',
    function($rootScope, $injector) {
        var request = function($config) {
            var tokenPublic = window.localStorage.getItem('tokenPublic');
            var tokenPrivate = window.localStorage.getItem('tokenPrivate');
            var timestamp = Date.now();
            var hashObject = CryptoJS.SHA256(tokenPrivate + "" + timestamp);
            var hash = hashObject.toString(CryptoJS.enc.Base64);

            $config.headers['Tokenpublic'] = tokenPublic;
            $config.headers['Hash'] = hash;
            $config.headers['Timestamp'] = timestamp;

            return $config;
        };

        var response = function(response) {
            if (exists(response["data"])) {
                if (exists(response["data"]["filter"])) {
                    log("Interceptor {0}", JSON.stringify(response["filter"]));
                    $injector.get('$state').transitionTo('login');
                    return $q.reject(response);
                }
            }
            return response;
        }

        return {
            request : request,
            response : response
        };
}]);

qolloApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('qolloInterceptor');
}]);