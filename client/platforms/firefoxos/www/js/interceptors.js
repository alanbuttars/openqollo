qolloApp.factory('qolloInterceptor', ['$injector', '$q', '$rootScope',
    function($injector, $q, $rootScope) {
        var request = function($config) {
            $config.headers = getHttpHeaders();
            return $config;
        };

        var response = function(response) {
            if (exists(response.filter)) {
                log("[ERROR] Interceptor {0}", response.filter);
                $injector.get('$state').transitionTo('login');
                return $q.reject(response);
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