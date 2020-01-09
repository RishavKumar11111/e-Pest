app.controller('myCDAOEMRCRCtrl', function($scope, $http, $filter, $timeout) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/cdao/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        $http.get('http://localhost:3000/cdao/getCropsByCategory?cropCategoryCode=' + $scope.ddlCropCategory).then(function success(response) {
            $scope.crops = response.data;
            $scope.ddlCrop = null;
            $scope.emrDetails = [];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };
    
    $scope.getBlocksByCDAO = function () {
        $http.get('http://localhost:3000/cdao/getBlocksByCDAO').then(function success(response) {
            $scope.blocks = response.data;
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
    $scope.getEMRNosForCDAO = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCrop != null && $scope.ddlCrop != undefined && $scope.ddlCropCategory != null && $scope.ddlCropCategory != undefined ) {
            var blkcd = 0;
            $scope.ddlBlock == undefined || $scope.ddlBlock == null ? blkcd = 0 : blkcd = $scope.ddlBlock;
            $http.get('http://localhost:3000/cdao/getEMRNosForCDAO?dateOfEntry=' + document.getElementById('pdeDate').value + '&cropCategory=' + $scope.ddlCropCategory + '&crop=' + $scope.ddlCrop + '&financialYear=' + $scope.ddlFY  + '&blockCode=' + blkcd).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.emrDetails = response.data;
                    if (response.data[0].hasOwnProperty('BlockName')) {
                        $scope.sbg = true;
                        $scope.sg = false;
                    }
                    else if (response.data[0].hasOwnProperty('GPName')) {
                        $scope.sbg = false;
                        $scope.sg = true;
                    }
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

    $scope.getEMRReferenceNoDetailsCDAO = function (emrRefNo) {
        $http.get('http://localhost:3000/cdao/getEMRReferenceNoDetailsCDAO?emrRefNo=' + emrRefNo).then(function success(response) {
            $scope.rnd = response.data[0];
            getImage($scope.rnd.FLP, $scope.rnd.RLP1, $scope.rnd.RLP2);
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});