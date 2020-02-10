app.controller('myAAOAppHomeCtrl', function ($scope) {

    $scope.checkUserDetails = function () {
        if ('indexedDB' in window) {
            readAllData('user-authentication').then(function success(response) {
                if (response.length == 0) {
                    location.href = 'http://localhost:3000/aaoApp/authentication';
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.blockName = null;
    $scope.getBlock = function () {
        if ('indexedDB' in window) {
            readAllData('user-login').then(function success(response) {
                if (response.length > 0) {
                    $scope.blockName = response[0].BlockName;
                    $scope.$apply();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

});