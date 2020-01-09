app.controller('myAAOEMRCRCtrl', function($scope, $http, $filter, $timeout) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/aao/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        $http.get('http://localhost:3000/aao/getCropsByCategory?cropCategoryCode=' + $scope.ddlCropCategory).then(function success(response) {
            $scope.crops = response.data;
            $scope.ddlCrop = null;
            $scope.emrDetails = [];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    var getImage = function(a, b, c) {
        var flp = "data:image/jpeg;base64," + a;
        document.getElementById('flp').setAttribute("src", flp);
        var rlp1 = "data:image/jpeg;base64," + b;
        document.getElementById('rlp1').setAttribute("src", rlp1);
        var rlp2 = "data:image/jpeg;base64," + c;
        document.getElementById('rlp2').setAttribute("src", rlp2);
    };

    $scope.emrDetails = [];
    $scope.getEMRNosForAAO = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCrop != null && $scope.ddlCrop != undefined && $scope.ddlCropCategory != null && $scope.ddlCropCategory != undefined ) {
            $http.get('http://localhost:3000/aao/getEMRNosForAAO?dateOfEntry=' + document.getElementById('pdeDate').value + '&cropCategory=' + $scope.ddlCropCategory + '&crop=' + $scope.ddlCrop + '&financialYear=' + $scope.ddlFY ).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.emrDetails = response.data;
                }
                else {
                    alert('No emergency cases are found.')
                    $scope.emrDetails = [];
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

    $scope.getEMRReferenceNoDetailsAAO = function (emrRefNo) {
        $http.get('http://localhost:3000/aao/getEMRReferenceNoDetailsAAO?emrRefNo=' + emrRefNo).then(function success(response) {
            $scope.rnd = response.data[0];
            getImage($scope.rnd.FLP, $scope.rnd.RLP1, $scope.rnd.RLP2);
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});