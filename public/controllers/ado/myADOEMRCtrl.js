app.controller('myADOEMRCtrl', function($scope, $http, $filter, $timeout) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    var getImage = function(a, b, c) {
        var flp = "data:image/jpeg;base64," + a;
        document.getElementById('flp').setAttribute("src", flp);
        var rlp1 = "data:image/jpeg;base64," + b;
        document.getElementById('rlp1').setAttribute("src", rlp1);
        var rlp2 = "data:image/jpeg;base64," + c;
        document.getElementById('rlp2').setAttribute("src", rlp2);
    };

    $scope.getPestDiseases = function() {
        $http.get('http://localhost:3000/ado/getAllPestDiseases?cropCode=' + $scope.cropCode).then(function success(response) {
            $scope.pestDiseases = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPesticides = function(pestCode) {
        $http.get('http://localhost:3000/ado/getPesticide?pestCode=' + pestCode).then(function success(response) {
            var advisories = response.data;
            if (advisories.length > 0) {
                var mAdvisory = [];
                var hAdvisory = [];
                if ($scope.pestDiseases != undefined) {
                    var pest = ($filter('filter')($scope.pestDiseases, { PestDiseaseCode: pestCode }, true));
                    angular.forEach(advisories, function(i) {
                        var ma = {
                            maObj: $scope.rnd.CropName + ' - ' + pest[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                        };
                        mAdvisory.push(ma);
                        var ha = {
                            haObj: $scope.rnd.CropName + ' - ' + pest[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                        };
                        hAdvisory.push(ha);
                    });
                }
                else {
                    angular.forEach(advisories, function(i) {
                        var ma = {
                            maObj: $scope.rnd.CropName + ' - ' + $scope.rnd.PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                        };
                        mAdvisory.push(ma);
                        var ha = {
                            haObj: $scope.rnd.CropName + ' - ' + $scope.rnd.PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                        };
                        hAdvisory.push(ha);
                    });
                }
                $scope.moderateAdvisories = mAdvisory;
                $scope.highAdvisories = hAdvisory;
            }
            else {
                $scope.moderateAdvisories = null;
                $scope.highAdvisories = null;
            }
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropCategories = function() {
        $http.get('http://localhost:3000/ado/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function() {
        $http.get('http://localhost:3000/ado/getCropsByCategory?cropCategoryCode=' + $scope.ddlCropCategory).then(function success(response) {
            $scope.crops = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getRefNos = function() {
        $http.get('http://localhost:3000/ado/getRefNos?cropCategoryCode=' + $scope.ddlCropCategory + '&cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.referenceNos = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getRefNoDetails = function (refNo) {
        $http.get('http://localhost:3000/ado/getRefNoDetails?refNo=' + refNo).then(function success(response) {
            $scope.rnd = response.data[0];
            getImage($scope.rnd.FLP, $scope.rnd.RLP1, $scope.rnd.RLP2);
            $scope.cropCode = $scope.rnd.CropCode;
            $scope.getPestDiseases();
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

    $scope.getPestPopulation = function (pestCode) {
        $http.get('http://localhost:3000/ado/getPestPopulation?pestCode=' + pestCode).then(function success(response) {
            $scope.pestPopulation = response.data;
            if ($scope.pestPopulation.length > 0) {
                var mppArray = [];
                var hppArray = [];
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
            $scope.$apply();
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitADOEMR = function () {
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
                        DistrictCode: $scope.rnd.DistrictCode,
                        BlockCode: $scope.rnd.BlockCode,
                        MobileNo: $scope.rnd.MobileNo
                    };
                    $http.post('http://localhost:3000/ado/submitADOEMR', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                        var result = response.data;
                        if (result.includes('EMR/')) {
                            alert('The Crop Photo information is submitted with the Reference No. ' + result + '.');
                            document.getElementById('cropPhotoModal').style.display = "none";
                            $timeout(function () {
                                document.getElementById("cl").click();
                                $scope.getRefNos();
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

    var clearData = function() {
        $scope.ddlPest = null;
        $scope.ddlMAdvisory = null;
        $scope.ddlHAdvisory = null;
        $scope.ddlMPP = null;
        $scope.ddlHPP = null;
    };

});