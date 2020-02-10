app.controller('myCDAOHomeCtrl', function ($scope, $http) {

    $scope.getDistrict = function () {
        $http.get('http://localhost:3000/cdao/getDistrict').then(function success(response) {
            $scope.district = response.data[0].DistrictName;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});