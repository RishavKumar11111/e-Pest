app.controller('myADODashboardCtrl', function($scope, $http) {

    $scope.getDashboardDetails = function () {
        $http.get('http://localhost:3000/ado/getDashboardDetails').then(function success(response) {
            $scope.getADODD = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});