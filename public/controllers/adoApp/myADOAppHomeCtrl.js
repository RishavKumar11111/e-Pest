app.controller('myADOAppHomeCtrl', function ($scope) {

    $scope.checkUserDetails = function () {
        if ('indexedDB' in window) {
            readAllData('user-authentication').then(function success(response) {
                if (response.length == 0) {
                    location.href = 'http://localhost:3000/adoApp/authentication';
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

});