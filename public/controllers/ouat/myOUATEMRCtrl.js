app.controller('myOUATEMRCtrl', function ($scope, $http, $filter, $timeout) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/ouat/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        $http.get('http://localhost:3000/ouat/getCropsByCategory?cropCategoryCode=' + $scope.ddlCropCategory).then(function success(response) {
            $scope.crops = response.data;
            $scope.ddlCrop = null;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    var getImage = function (a, b, c) {
        var flp = "data:image/jpeg;base64," + a;
        document.getElementById('flp').setAttribute("src", flp);
        var rlp1 = "data:image/jpeg;base64," + b;
        document.getElementById('rlp1').setAttribute("src", rlp1);
        var rlp2 = "data:image/jpeg;base64," + c;
        document.getElementById('rlp2').setAttribute("src", rlp2);
    };

    $scope.pestPopulation = [];
    $scope.getPestPopulation = function (pestCode) {
        if (pestCode != undefined) {
            $http.get('http://localhost:3000/ouat/getPestPopulation?pestCode=' + pestCode).then(function success(response) {
                $scope.pestPopulation = response.data;
                var mppArray = [];
                var hppArray = [];
                if ($scope.pestPopulation.length > 0) {
                    angular.forEach($scope.pestPopulation, function (i) {
                        var mpp = {
                            mppObj: i.ModerateIntensityPopulation
                        };
                        mppArray.push(mpp);
                        var hpp = {
                            hppObj: i.HighIntensityPopulation
                        };
                        hppArray.push(hpp);
                    });
                    $scope.moderatePestPopulation = mppArray;
                    $scope.highPestPopulation = hppArray;
                }
                else {
                    $scope.moderatePestPopulation = null;
                    $scope.highPestPopulation = null;
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getPestDiseases = function () {
        $http.get('http://localhost:3000/ouat/getPestDiseases?cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.pestDiseases = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPesticides = function (pestCode) {
        if (pestCode != undefined) {
            $http.get('http://localhost:3000/ouat/getPesticide?pestCode=' + pestCode).then(function success(response) {
                var advisories = response.data;
                if (advisories.length > 0) {
                    var mAdvisory = [];
                    var hAdvisory = [];
                    var crop = [];
                    crop = ($filter('filter')($scope.crops, { CropCode: $scope.ddlCrop }, true));
                    if ($scope.pestDiseases.length > 0) {
                        var pest = ($filter('filter')($scope.pestDiseases, { PestDiseaseCode: pestCode }, true));
                        angular.forEach(advisories, function (i) {
                            var ma = {
                                maObj: crop[0].CropName + ' - ' + pest[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                            };
                            mAdvisory.push(ma);
                            var ha = {
                                haObj: crop[0].CropName + ' - ' + pest[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                            };
                            hAdvisory.push(ha);
                        });
                    }
                    $scope.moderateAdvisories = mAdvisory;
                    $scope.highAdvisories = hAdvisory;
                }
                else {
                    alert('Advisory is not found under the selected pest.');
                    $scope.moderateAdvisories = null;
                    $scope.highAdvisories = null;
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getEMRRefNos = function () {
        $http.get('http://localhost:3000/ouat/getEMRRefNos?cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.emrReferenceNos = response.data;
            document.getElementById('rbypi').checked = false;
            document.getElementById('rbnpi').checked = false;
            $scope.rbPestIdentified = null;
            $scope.ddlPest = null;
            $scope.moderateAdvisories = [];
            $scope.highAdvisories = [];
            $scope.ddlMAdvisory = null;
            $scope.ddlHAdvisory = null;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getEMRRefNoDetails = function (refNo) {
        $http.get('http://localhost:3000/ouat/getEMRRefNoDetails?refNo=' + refNo).then(function success(response) {
            $scope.rnd = response.data[0];
            getImage($scope.rnd.FLP, $scope.rnd.RLP1, $scope.rnd.RLP2);
            $scope.getPestDiseases();
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitEMRDetails = function () {
        if ($scope.rbPestIdentified != null) {
            if (($scope.rbPestIdentified == "Yes" && $scope.ddlPest != null && (($scope.ddlMAdvisory != null && $scope.ddlHAdvisory != null && $scope.ddlMPP != null && $scope.ddlHPP != null) || ($scope.ddlMAdvisory != null && $scope.ddlHAdvisory == null && $scope.ddlMPP != null && $scope.ddlHPP == null) || ($scope.ddlMAdvisory == null && $scope.ddlHAdvisory != null && $scope.ddlMPP == null && $scope.ddlHPP != null))) || ($scope.rbPestIdentified == "No" && $scope.ddlPest == null && $scope.ddlMAdvisory == null && $scope.ddlHAdvisory == null && $scope.ddlMPP == null && $scope.ddlHPP == null)) {
                var message = confirm('Do you really want to submit the form?');
                if (message) {
                    var myData = {
                        EMRReferenceNo: $scope.rnd.EMRReferenceNo,
                        InfectionIdentified: $scope.rbPestIdentified,
                        PestDiseaseCode: $scope.ddlPest,
                        ModerateIntensityPestPopulation: $scope.ddlMPP == null ? 'NA' : $scope.ddlMPP,
                        HighIntensityPestPopulation: $scope.ddlHPP == null ? 'NA' : $scope.ddlHPP,
                        AdvisoryModerate: $scope.ddlMAdvisory == null ? 'NA' : $scope.ddlMAdvisory,
                        AdvisoryHigh: $scope.ddlHAdvisory == null ? 'NA' : $scope.ddlHAdvisory,
                        MobileNo: $scope.rnd.MobileNo
                    };
                    $http.post('http://localhost:3000/ouat/submitEMRDetails', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                        var result = response.data;
                        if (result.includes('EMR/')) {
                            alert('The Crop Photo information is submitted with the Reference No. ' + result + '.');
                            document.getElementById('cropPhotoModal').style.display = "none";
                            $timeout(function () {
                                document.getElementById("cl").click();
                                $scope.getEMRRefNos();
                            }, 1);
                            clearData();
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
                alert('Please fill the fields correctly.');
                clearData();
            }
        }
        else {
            alert('Please select if the pest is identified or not.');
            clearData();
        }
    };

    var clearData = function () {
        $scope.ddlPest = null;
        $scope.ddlMAdvisory = null;
        $scope.ddlHAdvisory = null;
        $scope.ddlMPP = null;
        $scope.ddlHPP = null;
    };

});