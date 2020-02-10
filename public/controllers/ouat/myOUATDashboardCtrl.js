app.controller('myOUATDashboardCtrl', function ($scope, $http, $filter, $timeout) {

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
            $scope.ddlPest = null;
            $scope.pests = [];
            $scope.clearData();
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPests = function () {
        $http.get('http://localhost:3000/ouat/getPestDiseases?cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.pests = response.data;
            var k = { PestDiseaseCode: 1, PestDiseaseName: 'Unidentified Pests' };
            $scope.pests.push(k);
            $scope.ddlPest = null;
            $scope.clearData();
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.clearData = function () {
        // document.getElementById('cbmi').checked = false;
        // document.getElementById('cbhi').checked = false;
        // $scope.cbMIntensity = false;
        // $scope.cbHIntensity = false;
        // $scope.ddlPest = null;
        $scope.refNoDetails = [];
        document.getElementById('rbypi').checked = false;
        document.getElementById('rbypi').checked = false;
        $scope.rbPI = false;
        $scope.ddlMA = null;
        $scope.ddlHA = null;
        document.getElementById('rbyoa').checked = false;
        document.getElementById('rbnoa').checked = false;
        $scope.rbOwnAdvisory = false;
        $scope.taOMAdvisory = null;
        $scope.taOHAdvisory = null;
    };

    $scope.checkPestIntensityPest = function () {
        if ($scope.ddlPest == null || ($scope.cbMIntensity == false || $scope.cbMIntensity == undefined) && ($scope.cbHIntensity == false || $scope.cbHIntensity == undefined)) {
            alert('Please select the Pest and Pest Intensity.');
        }
    };

    $scope.refNoDetails = [];
    $scope.getRefNoDetails = function () {
        var pdcd = $scope.ddlPest == undefined || $scope.ddlPest == null ? 0 : $scope.ddlPest;
        var intensityType = ($scope.cbMIntensity == true && ($scope.cbHIntensity == false || $scope.cbHIntensity == undefined)) ? 'M' : (($scope.cbMIntensity == false || $scope.cbMIntensity == undefined) && $scope.cbHIntensity == true) ? 'H' : ($scope.cbMIntensity == true && $scope.cbHIntensity == true) ? 'MH' : 'NA';
        if ($scope.ddlCropCategory != null && $scope.ddlCropCategory != undefined && $scope.ddlCrop != null && $scope.ddlCrop != undefined && $scope.rbs != null && $scope.rbs != undefined) {
            $http.get('http://localhost:3000/ouat/getRefNoDetails?cropCode=' + $scope.ddlCrop + '&pestDiseaseCode=' + pdcd + '&intensityType=' + intensityType + '&season=' + $scope.rbs).then(function success(response) {
                $scope.refNoDetails = response.data;
                if ($scope.refNoDetails.length > 0) {
                    if (response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sad = false;
                        $scope.sbd = true;
                    }
                    else if (!(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sad = true;
                        $scope.sbd = false;
                    }
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please select atleast Crop Category and Crop.');
        }
    };

    $scope.removeRefNo = function (referenceNo) {
        var message = confirm('Do you really want to delete the Reference No. ' + referenceNo + ' ?');
        if (message) {
            $http.post('http://localhost:3000/ouat/removeRefNo', { data: referenceNo }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                if (response.data.includes('21/')) {
                    alert('The Reference No. ' + response.data + ' was successfully removed.');
                    $scope.getRefNoDetails();
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

    $scope.getCD = function (referenceNo) {
        $http.get('http://localhost:3000/ouat/getCD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.cd = response.data[0];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPLD = function (referenceNo) {
        $http.get('http://localhost:3000/ouat/getPLD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.pld = response.data[0];
            getImage($scope.pld.FLP, $scope.pld.RLP1, $scope.pld.RLP2);
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    var getImage = function (a, b, c) {
        var flp = "data:image/jpeg;base64," + a;
        document.getElementById('flp').setAttribute("src", flp);
        if (b != null) {
            var rlp1 = "data:image/jpeg;base64," + b;
            document.getElementById('rlp1').setAttribute("src", rlp1);
        }
        if (c != null) {
            var rlp2 = "data:image/jpeg;base64," + c;
            document.getElementById('rlp2').setAttribute("src", rlp2);
        }
    };

    $scope.getPD = function (referenceNo) {
        $scope.lblPestDetails = true;
        $scope.txtPestDetails = false;
        $http.get('http://localhost:3000/ouat/getPD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.pd = response.data[0];
            $scope.rbPestIdentified = $scope.pd.InfectionIdentified;
            $scope.ddlPestDisease = $scope.pd.PestDiseaseCode;
            $scope.txtAreaOfLand = $scope.pd.AreaOfLand;
            $scope.txtLowAreaAffected = $scope.pd.LowIntensityAttackArea;
            $scope.txtMediumAreaAffected = $scope.pd.MediumIntensityAttackArea;
            $scope.txtHighAreaAffected = $scope.pd.HighIntensityAttackArea;
            $scope.txtLowAreaTreated = $scope.pd.LowIntensityTreatedArea;
            $scope.txtMediumAreaTreated = $scope.pd.MediumIntensityTreatedArea;
            $scope.txtHighAreaTreated = $scope.pd.HighIntensityTreatedArea;
            $scope.ddlMPP = $scope.pd.ModerateIntensityPestPopulation;
            $scope.ddlHPP = $scope.pd.HighIntensityPestPopulation;
            $scope.ddlMAdvisory = $scope.pd.AdvisoryModerate;
            $scope.ddlHAdvisory = $scope.pd.AdvisoryHigh;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.lblPestDetails = true;
    $scope.txtPestDetails = false;
    $scope.modifyPestDetails = function () {
        $scope.lblPestDetails = false;
        $scope.txtPestDetails = true;
        $scope.getPestDiseases();
        $scope.getPestPopulation($scope.pd.PestDiseaseCode);
        $scope.getPesticides($scope.pd.PestDiseaseCode);
    };

    $scope.cancelPestDetails = function () {
        $scope.lblPestDetails = true;
        $scope.txtPestDetails = false;
        //angular.element(document.querySelector('#lblPD')).removeClass('ng-hide');
        //angular.element(document.querySelector('#txtPD')).addClass('ng-hide');
    };

    $scope.pestDiseases = [];
    $scope.getPestDiseases = function () {
        var crop = ($filter('filter')($scope.refNoDetails, { ReferenceNo: $scope.pd.ReferenceNo }, true));
        $http.get('http://localhost:3000/ouat/getPestDiseases?cropCode=' + crop[0].CropCode).then(function success(response) {
            $scope.pestDiseases = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
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

    $scope.getPesticides = function (pestCode) {
        if (pestCode != undefined) {
            $http.get('http://localhost:3000/ouat/getPesticide?pestCode=' + pestCode).then(function success(response) {
                var advisories = response.data;
                if (advisories.length > 0) {
                    var mAdvisory = [];
                    var hAdvisory = [];
                    var crop = [];
                    if ($scope.pd != undefined) {
                        crop = ($filter('filter')($scope.refNoDetails, { ReferenceNo: $scope.pd.ReferenceNo }, true));
                    }
                    else {
                        crop = ($filter('filter')($scope.crops, { CropCode: $scope.ddlCrop }, true));
                    }
                    if ($scope.pestDiseases.length > 0) {
                        var pest = ($filter('filter')($scope.pestDiseases, { PestDiseaseCode: pestCode }, true));
                        angular.forEach(advisories, function (i) {
                            var ma = {
                                maObj: crop[0].CropName + ' - ' + pest[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose
                            };
                            mAdvisory.push(ma);
                            var ha = {
                                haObj: crop[0].CropName + ' - ' + pest[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose
                            };
                            hAdvisory.push(ha);
                        });
                    }
                    else if ($scope.pd != undefined) {
                        angular.forEach(advisories, function (i) {
                            var ma = {
                                maObj: crop[0].CropName + ' - ' + $scope.pd.PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose
                            };
                            mAdvisory.push(ma);
                            var ha = {
                                haObj: crop[0].CropName + ' - ' + $scope.pd.PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose
                            };
                            hAdvisory.push(ha);
                        });
                    }
                    else {
                        var pest = ($filter('filter')($scope.pests, { PestDiseaseCode: pestCode }, true));
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
                    $scope.moad = mAdvisory;
                    $scope.highAdvisories = hAdvisory;
                    $scope.hiad = hAdvisory;
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

    $scope.updatePestDetails = function (isValid) {
        if (isValid) {
            var maa = parseFloat($scope.txtMediumAreaAffected);
            var haa = parseFloat($scope.txtHighAreaAffected);
            if (parseFloat($scope.txtAreaOfLand) <= 0.4) {
                if (($scope.rbPestIdentified == "Yes" && $scope.ddlPestDisease != null && ((maa != 0.0 && haa != 0.0 && $scope.ddlMAdvisory != null && $scope.ddlHAdvisory != null) || (maa != 0.0 && haa == 0.0 && $scope.ddlMAdvisory != null && $scope.ddlHAdvisory == null) || (maa == 0.0 && haa != 0.0 && $scope.ddlMAdvisory == null && $scope.ddlHAdvisory != null))) || ($scope.rbPestIdentified == "No" && $scope.ddlPestDisease == null && $scope.ddlMAdvisory == null && $scope.ddlHAdvisory == null && (maa != 0.0 || haa != 0.0))) {
                    var message = confirm('Do you really want to submit the form?');
                    if (message) {
                        if ($scope.pd.ReferenceNo != null && $scope.pd.ReferenceNo != undefined && $scope.pd.ReferenceNo != '') {
                            var totalAreaAffected = parseFloat($scope.txtLowAreaAffected) + parseFloat($scope.txtMediumAreaAffected) + parseFloat($scope.txtHighAreaAffected);
                            var totalAreaOfLand = parseFloat($scope.txtAreaOfLand);
                            if (totalAreaAffected <= totalAreaOfLand) {
                                var totalAreaToBeTreated = parseFloat($scope.txtLowAreaTreated) + parseFloat($scope.txtMediumAreaTreated) + parseFloat($scope.txtHighAreaTreated);
                                if (totalAreaToBeTreated <= totalAreaAffected) {
                                    var lowAreaAffected = parseFloat($scope.txtLowAreaAffected); var mediumAreaAffected = parseFloat($scope.txtMediumAreaAffected); var highAreaAffected = parseFloat($scope.txtHighAreaAffected); var lowAreaTreated = parseFloat($scope.txtLowAreaTreated); var mediumAreaTreated = parseFloat($scope.txtMediumAreaTreated); var highAreaTreated = parseFloat($scope.txtHighAreaTreated);
                                    if (lowAreaTreated <= lowAreaAffected && mediumAreaTreated <= mediumAreaAffected && highAreaTreated <= highAreaAffected) {
                                        var myData = {
                                            ReferenceNo: $scope.pd.ReferenceNo,
                                            InfectionIdentified: $scope.rbPestIdentified,
                                            PestDiseaseCode: $scope.ddlPestDisease,
                                            AreaOfLand: $scope.txtAreaOfLand,
                                            LowIntensityAttackArea: $scope.txtLowAreaAffected,
                                            MediumIntensityAttackArea: $scope.txtMediumAreaAffected,
                                            HighIntensityAttackArea: $scope.txtHighAreaAffected,
                                            LowIntensityTreatedArea: $scope.txtLowAreaTreated,
                                            MediumIntensityTreatedArea: $scope.txtMediumAreaTreated,
                                            HighIntensityTreatedArea: $scope.txtHighAreaTreated,
                                            ModerateIntensityPestPopulation: $scope.ddlMPP,
                                            HighIntensityPestPopulation: $scope.ddlHPP,
                                            AdvisoryModerate: $scope.ddlMAdvisory,
                                            AdvisoryHigh: $scope.ddlHAdvisory
                                        };
                                        $http.post('http://localhost:3000/ouat/updatePestDetails', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                                            var result = response.data;
                                            if (result.includes('21/')) {
                                                alert('The pest information is updated with the Reference No. ' + result + '.');
                                                $scope.lblPestDetails = true;
                                                $scope.txtPestDetails = false;
                                                $timeout(function () {
                                                    document.getElementById("cl").click();
                                                }, 1);
                                                $scope.getRefNoDetails();
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
                                        alert('Total Area to be Treated components cannot be more than Total Area Affected components.');
                                        $scope.txtLowAreaAffected = null;
                                        $scope.txtMediumAreaAffected = null;
                                        $scope.txtHighAreaAffected = null;
                                        $scope.txtLowAreaTreated = null;
                                        $scope.txtMediumAreaTreated = null;
                                        $scope.txtHighAreaTreated = null;
                                    }
                                }
                                else {
                                    alert('Total Area to be Treated cannot be more than Total Area Affected.');
                                    $scope.txtLowAreaTreated = null;
                                    $scope.txtMediumAreaTreated = null;
                                    $scope.txtHighAreaTreated = null;
                                }
                            }
                            else {
                                alert('Total Area Affected cannot be more than Total Area of Land.');
                                $scope.txtLowAreaAffected = null;
                                $scope.txtMediumAreaAffected = null;
                                $scope.txtHighAreaAffected = null;
                            }
                        }
                        else {
                            alert('Please select the Reference No.');
                        }
                    }
                }
                else {
                    alert('Low intensity area can only be entered when there is area under high and moderate intensity along with it. Area affected under both moderate and high intensity cannot be 0. If area is affected under both moderate and high intensity, then both the advisories must be given.');
                    $scope.ddlMPP = null;
                    $scope.ddlHPP = null;
                    $scope.ddlMAdvisory = null;
                    $scope.ddlHAdvisory = null;
                }
            }
            else {
                alert('Area of land cannot be more than 0.4 ha.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.updateMADetails = function (isValid) {
        if (isValid) {
            if ($scope.refNoDetails != [] && $scope.rbPI == 'Yes' && (($scope.cbMIntensity == true && ($scope.cbHIntensity == false || $scope.cbHIntensity == undefined) && $scope.ddlMA != null && $scope.ddlHA == null) || ($scope.cbHIntensity == true && ($scope.cbMIntensity == false || $scope.cbMIntensity == undefined) && $scope.ddlHA != null && $scope.ddlMA == null) || ($scope.cbMIntensity == true && $scope.cbHIntensity == true && $scope.ddlMA != null && $scope.ddlHA != null))) {
                var message = confirm('Do you really want to submit the form?');
                if (message) {
                    var myData = [];
                    angular.forEach($scope.refNoDetails, function (i) {
                        var k = {};
                        k.ReferenceNo = i.ReferenceNo;
                        myData.push(k);
                    });
                    var l = {
                        pi: $scope.rbPI,
                        ma: $scope.ddlMA,
                        ha: $scope.ddlHA
                    };
                    $http.post('http://localhost:3000/ouat/updateMADetails', { data: { refNos: myData, pestData: l } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                        var result = response.data;
                        if (result == '1') {
                            alert('The records are updated.');
                            $scope.crops = []; $scope.pests = []; $scope.refNoDetails = []; $scope.ddlCropCategory = null; $scope.ddlCrop = null; $scope.ddlPest = null; $scope.pestDiseases = []; $scope.pestPopulation = []; document.getElementById('cbmi').checked = false; document.getElementById('cbhi').checked = false; $scope.cbMIntensity = false; $scope.cbHIntensity = false; document.getElementById('rbyoa').checked = false; document.getElementById('rbnoa').checked = false; $scope.rbOwnAdvisory = false; $scope.taOMAdvisory = null; $scope.taOHAdvisory = null;
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
                alert('Please enter all the fields correctly.');
                $scope.ddlMA = null;
                $scope.ddlHA = null;
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.submitDetails = function (isValid) {
        if (isValid) {
            if ($scope.ddlPest != null && $scope.ddlPest != undefined) {
                if (($scope.refNoDetails != [] && $scope.rbOwnAdvisory == 'Yes' && ($scope.cbMIntensity == true && $scope.cbHIntensity == false && $scope.taOMAdvisory != null && $scope.taOMAdvisory != undefined && $scope.taOMAdvisory != '' && ($scope.taOHAdvisory == null || $scope.taOHAdvisory == undefined || $scope.taOHAdvisory == '')) || ($scope.cbHIntensity == true && $scope.cbMIntensity == false && $scope.taOHAdvisory != null && $scope.taOHAdvisory != undefined && $scope.taOHAdvisory != '' && ($scope.taOMAdvisory == null || $scope.taOHAdvisory == undefined || $scope.taOHAdvisory == '')) || ($scope.cbMIntensity == true && $scope.cbHIntensity == true && $scope.taOMAdvisory != null && $scope.taOMAdvisory != undefined && $scope.taOMAdvisory != '' && $scope.taOHAdvisory != null && $scope.taOHAdvisory != undefined && $scope.taOHAdvisory != '')) || ($scope.refNoDetails != [] && $scope.rbOwnAdvisory == 'No' && ($scope.taOMAdvisory == null || $scope.taOMAdvisory == undefined || $scope.taOMAdvisory == '') && ($scope.taOHAdvisory == null || $scope.taOHAdvisory == undefined || $scope.taOHAdvisory == ''))) {
                    var message = confirm('Do you really want to submit the form?');
                    if (message) {
                        var myData = [];
                        angular.forEach($scope.refNoDetails, function (i) {
                            var k = {};
                            k.ReferenceNo = i.ReferenceNo;
                            k.ouatAdvisoryModerate = $scope.taOMAdvisory;
                            k.ouatAdvisoryHigh = $scope.taOHAdvisory;
                            myData.push(k);
                        });
                        $http.post('http://localhost:3000/ouat/submitDetails', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                            var result = response.data;
                            if (result == '1') {
                                alert('The records are submitted.');
                                $scope.crops = []; $scope.pests = []; $scope.refNoDetails = []; $scope.ddlCropCategory = null; $scope.ddlCrop = null; $scope.ddlPest = null; $scope.pestDiseases = []; $scope.pestPopulation = []; document.getElementById('cbmi').checked = false; document.getElementById('cbhi').checked = false; $scope.cbMIntensity = false; $scope.cbHIntensity = false; document.getElementById('rbyoa').checked = false; document.getElementById('rbnoa').checked = false; $scope.rbOwnAdvisory = false; $scope.taOMAdvisory = null; $scope.taOHAdvisory = null;
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
                    alert('Please enter all the fields correctly.');
                    $scope.taOMAdvisory = null;
                    $scope.taOHAdvisory = null;
                }
            }
            else {
                alert('Please select the Pest.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

});

app.directive('validNumberUptoOneDecimal', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }
                }
                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 1);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.on('blur', function () {
                if (element.val().slice(-1) == '.') {
                    ngModelCtrl.$setViewValue(element.val() + '0');
                }
                if (element.val().charAt(0) == 0) {
                    var decimalNo = parseFloat(element.val(), 10)
                    ngModelCtrl.$setViewValue(decimalNo.toString());
                }
                ngModelCtrl.$render();
                scope.$apply();
            });
            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

app.directive('integerAll', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.on('keydown', function (event) {
                var keyCode = []
                if (attrs.allowNegative == "true") {
                    keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 173, 190, 189];
                }
                else {
                    var keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 173, 190];
                }
                if (attrs.allowDecimal == "false") {
                    var index = keyCode.indexOf(190);
                    if (index > -1) {
                        keyCode.splice(index, 1);
                    }
                }
                if ($.inArray(event.which, keyCode) == -1) event.preventDefault();
                else {
                    var oVal = ngModelCtrl.$modelValue || '';
                    if ($.inArray(event.which, [109, 173]) > -1 && oVal.indexOf('-') > -1) event.preventDefault();
                    else if ($.inArray(event.which, [110, 190]) > -1 && oVal.indexOf('.') > -1) event.preventDefault();
                }
            })
                .on('blur', function () {
                    if (element.val() == '' || element.val() == '-') {
                        ngModelCtrl.$setViewValue('');
                    }
                    else if (parseFloat(element.val()) == 0.0) {
                        ngModelCtrl.$setViewValue('0');
                    }
                    else if (attrs.allowDecimal == "false") {
                        ngModelCtrl.$setViewValue(element.val());
                    }
                    else {
                        if (attrs.decimalUpto) {
                            var fixedValue = parseFloat(element.val()).toFixed(attrs.decimalUpto);
                        }
                        else { var fixedValue = parseFloat(element.val()).toFixed(2); }
                        ngModelCtrl.$setViewValue(fixedValue);
                    }
                    ngModelCtrl.$render();
                    scope.$apply();
                });
            ngModelCtrl.$parsers.push(function (text) {
                var oVal = ngModelCtrl.$modelValue;
                var nVal = ngModelCtrl.$viewValue;
                if (parseFloat(nVal) != nVal) {
                    if (nVal === null || nVal === undefined || nVal == '' || nVal == '-') oVal = nVal;
                    ngModelCtrl.$setViewValue(oVal);
                    ngModelCtrl.$render();
                    return oVal;
                }
                else {
                    var decimalCheck = nVal.split('.');
                    if (!angular.isUndefined(decimalCheck[1])) {
                        if (attrs.decimalUpto)
                            decimalCheck[1] = decimalCheck[1].slice(0, attrs.decimalUpto);
                        else
                            decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        nVal = decimalCheck[0] + '.' + decimalCheck[1];
                    }
                    ngModelCtrl.$setViewValue(nVal);
                    ngModelCtrl.$render();
                    return nVal;
                }
            });
            ngModelCtrl.$formatters.push(function (text) {
                if (text == '0' && attrs.allowDecimal == "false") return '0';
                else if (text == null && attrs.allowDecimal == "false") return '';
                else if (text == '0' && attrs.allowDecimal != "false" && attrs.decimalUpto == undefined) return '';
                else if (text == null && attrs.allowDecimal != "false" && attrs.decimalUpto == undefined) return '';
                else if (text == '0') return '0';
                else if (text == null) return '';
                else if (text == '0' && attrs.allowDecimal != "false" && attrs.decimalUpto != undefined) return parseFloat(0).toFixed(attrs.decimalUpto);
                else if (text == null && attrs.allowDecimal != "false" && attrs.decimalUpto != undefined) return '';
                else if (attrs.allowDecimal != "false" && attrs.decimalUpto != undefined) return parseFloat(text).toFixed(attrs.decimalUpto);
                else return parseFloat(text).toFixed(2);
            });
        }
    };
});