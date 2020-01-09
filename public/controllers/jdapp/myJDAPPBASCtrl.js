app.controller('myJDAPPBASCtrl', function($scope, $http, $filter, $timeout) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    $scope.getDistricts = function () {
        $http.get('http://localhost:3000/jdapp/getDistricts').then(function success(response) {
            $scope.districts = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getBlocksByDistrict = function () {
        $http.get('http://localhost:3000/jdapp/getBlocksByDistrict?districtCode=' + $scope.ddlDistrict).then(function success(response) {
            $scope.blocks = response.data;
            $scope.ddlBlock = null;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getAdvisorySMS = function () {
        $http.get('http://localhost:3000/jdapp/getAdvisorySMS').then(function success(response) {
            $scope.smsAdvisories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };
    
    $scope.submitBAS = function (isValid) {
        if (isValid) {
            var block = ($filter('filter')($scope.blocks, { BlockCode: $scope.ddlBlock }, true));
            var message = confirm('Do you really want to submit the advisory for the block ' + block[0].BlockName + ' ?');
            if (message) {
                var myData = {
                    AdvisorySMS: $scope.taBAS,
                    DistrictCode: $scope.ddlDistrict,
                    BlockCode: $scope.ddlBlock
                };
                $http.post('http://localhost:3000/jdapp/submitBAS', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    if (response.data == 'OK') {
                        alert('The advisory is submitted.');
                        $scope.taBAS = null;
                        $scope.ddlDistrict = null;
                        $scope.ddlBlock = null;
                        $scope.getAdvisorySMS();
                    }
                    else {
                        console.log(response.status);
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

});