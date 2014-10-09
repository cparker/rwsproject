angular.module('rwsprojectApp')
    .factory('myHttpInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
        return {
            // optional method
            'responseError': function (response) {
                console.log(response.status);
                if (response.status == 401) {
                    console.log('denied');
                    $rootScope.authenticatedUser = {};
                    $rootScope.isLoggedIn = rwsMockEnabled ? true : undefined;
                }

                return $q.reject(response);
            }
        };
    }]);

