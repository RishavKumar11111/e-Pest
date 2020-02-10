app.controller('myJDAPPETLCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getCrops = function () {
        $http.get('http://localhost:3000/jdapp/getCrops').then(function success(response) {
            $scope.crops = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPestDiseases = function (cc) {
        $http.get('http://localhost:3000/jdapp/getPestDiseases?cropCode=' + cc).then(function success(response) {
            $scope.pests = response.data;
            $scope.intensityArray = [];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.intensityArray = [];
    $scope.addPestIntensity = function () {
        if ($scope.ddlPest != '' && $scope.ddlPest != null && $scope.ddlPest != undefined && $scope.txtModerateIntensityPopulation != '' && $scope.txtModerateIntensityPopulation != null && $scope.txtModerateIntensityPopulation != undefined && $scope.txtHighIntensityPopulation != '' && $scope.txtHighIntensityPopulation != null && $scope.txtHighIntensityPopulation != undefined) {
            var pestName = ($filter('filter')($scope.pests, { PestDiseaseCode: $scope.ddlPest }, true));
            var r = true;
            if ($scope.intensityArray.length > 0) {
                angular.forEach($scope.intensityArray, function (i) {
                    if (i.PestDiseaseDetails.PestDiseaseName == pestName[0].PestDiseaseName) {
                        alert("The Pest, '" + pestName[0].PestDiseaseName + "' is already entered.");
                        r = false;
                    }
                });
            }
            if (r == true) {
                var k = { PestDiseaseDetails: pestName[0], ModerateIntensityPopulation: $scope.txtModerateIntensityPopulation, HighIntensityPopulation: $scope.txtHighIntensityPopulation };
                $scope.intensityArray.push(k);
            }
            clearData();
        }
        else {
            alert("Please enter ETL details.");
        }
    };

    $scope.removePesticide = function (index) {
        $scope.intensityArray.splice(index, 1);
    };

    var clearData = function () {
        $scope.ddlPest = null;
        $scope.txtModerateIntensityPopulation = null;
        $scope.txtHighIntensityPopulation = null;
    };

    $scope.submitETL = function (isValid) {
        if (isValid) {
            if ($scope.intensityArray.length > 0) {
                var obj = { CropCode: $scope.ddlCC };
                $http.post('http://localhost:3000/jdapp/submitETL', { data: { cropCode: obj, pestIntensity: $scope.intensityArray } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'The ETL details already exists.') {
                        alert(result);
                    }
                    else if (result == 'OK') {
                        alert('The ETL details submitted.');
                    }
                    clearData();
                    $scope.ddlCC = null;
                    $scope.ddlCrop = null;
                    $scope.ddlPestD = null;
                    $scope.intensityArray = [];
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
            else {
                alert("Please enter ETL details.");
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.getETLDetails = function () {
        if ($scope.ddlPestD != null) {
            $http.get('http://localhost:3000/jdapp/getETLDetails?pestdiseaseCode=' + $scope.ddlPestD).then(function success(response) {
                $scope.etlDetails = response.data;
                $scope.slht = true;
                $scope.sthl = false;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.showTextHideLabel = function () {
        $scope.sthl = true;
        $scope.slht = false;
    };

    $scope.showLabelHideText = function () {
        $scope.slht = true;
        $scope.sthl = false;
        $scope.getETLDetails();
    };

    $scope.updateETLDetails = function (isValid) {
        if (isValid) {
            var message = confirm('Do you really want to submit the form?');
            if (message) {
                if ($scope.ddlCrop != null && $scope.ddlPestD != null) {
                    var pestCode = $scope.ddlPestD;
                    var myData = [];
                    var count = 0;
                    angular.forEach($scope.etlDetails, function (i) {
                        if (i.ModerateIntensityPopulation != null && i.ModerateIntensityPopulation != undefined && i.ModerateIntensityPopulation != '' && i.HighIntensityPopulation != null && i.HighIntensityPopulation != undefined && i.HighIntensityPopulation != '') {
                            var k = {
                                PestdiseaseCode: $scope.ddlPestD,
                                ModerateIntensityPopulation: i.ModerateIntensityPopulation,
                                HighIntensityPopulation: i.HighIntensityPopulation
                            }
                            count++;
                            myData.push(k);
                        }
                    });
                    if (count == $scope.etlDetails.length) {
                        $http.post('http://localhost:3000/jdapp/updateETLDetails', { data: { uad: myData, pcode: pestCode } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                            var result = response.data;
                            if (result == 'OK') {
                                alert('The records are updated.');
                                $scope.slht = false;
                                $scope.sthl = true;
                                $scope.getETLDetails();
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
                    else {
                        alert('Please fill all the Moderate and High Intensity Pest Population.');
                    }
                }
                else {
                    alert('Please enter all the fields correctly.');
                }
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.removeETL = function () {
        var message = confirm('Do you really want to delete the intensity?');
        if (message) {
            var myData = { pestDiseaseCode: $scope.ddlPestD };
            $http.post('http://localhost:3000/jdapp/removeETL', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                if (response.data == 'OK') {
                    alert('The ETL was successfully removed.');
                    $scope.getETLDetails();
                }
                else {
                    console.log(response.status);
                    alert('Oops! An error occurred.');
                }
            }).catch(function error(err) {
                console.log('An error occurred...', err);
            });
        }
    };

});