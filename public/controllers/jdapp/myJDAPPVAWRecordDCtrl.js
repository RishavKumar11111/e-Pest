app.controller('myJDAPPVAWRecordDCtrl', function ($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getVAWRecordDetails = function () {
        if ($scope.vawCode != null && $scope.vawCode != undefined) {
            $http.get('http://localhost:3000/jdapp/getVAWRecordDetails?vawCode=' + $scope.vawCode).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.vawDetails = response.data;
                }
                else {
                    alert('Pest details were not entered.')
                    $scope.pestDetails = [];
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please select all the fields.');
        }
    };

});