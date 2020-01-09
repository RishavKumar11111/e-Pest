app.controller('myAAOHomeCtrl', function($scope, $http) {
    
    $scope.getBlock = function() {
        $http.get('http://localhost:3000/aao/getBlock').then(function success(response) {
            $scope.block = response.data[0].BlockName;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});