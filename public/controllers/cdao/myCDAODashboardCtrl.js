app.controller('myCDAODashboardCtrl', function($scope, $http) {
    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getDashboardDetails = function () {
        $http.get('http://localhost:3000/cdao/getDashboardDetails').then(function success(response) {
            $scope.getCDAODetails = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});