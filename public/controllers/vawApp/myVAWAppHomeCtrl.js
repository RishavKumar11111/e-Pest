app.controller('myVAWAppHomeCtrl', function ($scope, $http) {

    $scope.checkUserDetails = function () {
        if ('indexedDB' in window) {
            readAllData('user-authentication').then(function success(response) {
                if (response.length == 0) {
                    location.href = 'http://localhost:3000/vawApp/authentication';
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

});