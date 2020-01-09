app.controller('myVAWEGTCtrl', function($scope, $http, $filter) {
    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.month = function() {
        var m = new Date().getMonth();
        if (m >= 6 && m <= 10) {
            $scope.rbSeason = 'Kharif';
        }
        else {
            $scope.rbSeason = 'Rabi';
        }
        return $scope.rbSeason;
    };

    $scope.getFinancialYear = function() {
        $scope.fiscalYear = "";
        var today = new Date();
        if ((today.getMonth() + 1) <= 3) {
            $scope.fiscalYear = (today.getFullYear() - 1) + "-" + today.getFullYear().toString().substr(2, 3);
        }
        else {
            $scope.fiscalYear = today.getFullYear() + "-" + (today.getFullYear() + 1).toString().substr(2, 3);
        }
        return $scope.fiscalYear;
    };

    $scope.getRegisteredVAWs = function() {
        $http.get('http://localhost:3000/aao/getRegisteredVAWs').then(function success(response) {
            $scope.registeredVAWs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getRegisteredVAWDetails = function(vawCode) {
        $scope.registeredVAWDetails = ($filter('filter')($scope.registeredVAWs, { VAWCode: vawCode }, true));
    };
    
    $scope.ePestVAWGPs = [];
    $scope.getValue = function () {
        $scope.ePestVAWGPs = [];
        angular.forEach($scope.registeredVAWDetails, function (i) {
            if (i.selected) {
                $scope.ePestVAWGPs.push({VAWCode: i.VAWCode, GPCode: i.GPCode, GPName: i.GPName});
            }
        });
    };

    $scope.getAllocatedGPsVAWs = function() {
        $http.get('http://localhost:3000/aao/getAllocatedGPsVAWs').then(function success(response) {
            $scope.allocatedGPsVAWs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitEPestVAWGPs = function(isValid) {
        if (isValid) {
            if ($scope.ePestVAWGPs.length > 0) {
                $http.post('http://localhost:3000/aao/allocateGPsVAWs', { data: $scope.ePestVAWGPs }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('GP Targets are allocated for VAW.');
                        clearData();
                    }
                    else {
                        console.log(response.status);
                        clearData();
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
            else {
                alert('Please select atleast one GP.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    var clearData = function() {
        $scope.getRegisteredVAWs();
        $scope.getAllocatedGPsVAWs();
        $scope.registeredVAWs = [];
        $scope.registeredVAWDetails = [];
        $scope.ePestVAWGPs = [];
        $scope.allocatedGPsVAWs = [];
    };

});