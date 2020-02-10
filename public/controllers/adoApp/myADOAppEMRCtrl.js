app.controller('myADOAppEMRCtrl', function ($scope) {

    $scope.checkUserDetails = function () {
        if ('indexedDB' in window) {
            readAllData('user-login').then(function success(response) {
                if (response.length == 0) {
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getRefNoFarmerID = function () {
        if ('indexedDB' in window) {
            readAllData('emrRefNo-fID').then(function success(response) {
                if (response.length > 0) {
                    $scope.emrRefNoFID = response;
                    $scope.$apply();
                }
                else {
                    $scope.emrRefNoFID = [];
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