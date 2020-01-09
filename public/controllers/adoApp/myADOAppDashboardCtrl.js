app.controller('myADOAppDashboardCtrl', function ($scope, $filter, $state, adoService) {

    $scope.checkUserDetails = function() {
        if ('indexedDB' in window) {
            readAllData('user-login').then(function success(response) {
                if (response.length == 0) {
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    // $scope.checkDay = function() {
    //     var dt = new Date();
    //     var d = dt.getDay();
    //     if (d == 0 || d == 6) {
    //         alert('You are only allowed to enter details on Monday, Tuesday, Wednesday, Thursday & Friday.');
    //         location.href = 'http://localhost:3000/adoApp#!/home';
    //     }
    // };

    $scope.checkDay = function() {
        var dt = new Date();
        var d = dt.getDay();
        if (d == 0) {
            alert('You are not allowed to enter details on Sunday.');
            location.href = 'http://localhost:3000/adoApp#!/home';
        }
    };

    $scope.getBlock = function () {
        if ('indexedDB' in window) {
            readAllData('block').then(function success(response) {
                if (response != null) {
                    $scope.blocks = response;
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getADORef = function (blockCode) {
        if ('indexedDB' in window) {
            readAllData('referenceNo').then(function success(response) {
                if (response.length > 0) {
                    var refNos = ($filter('filter')(response, { BlockCode: blockCode }, true));
                    readAllData('referenceNo-status').then(function success(response1) {
                        if (response1.length > 0) {
                            var filteredRefNos = ($filter('filter')(response1, { Status: 1 }, true));
                            $scope.ADORef = refNos.filter(item => filteredRefNos.every(item2 => item2.ReferenceNo != item.ReferenceNo));
                            $scope.$apply();
                        }
                        else {
                            $scope.ADORef = refNos;
                            $scope.$apply();
                        }
                    }, function error(response) {
                        console.log(response.status);
                    }).catch(function err(error) {
                        console.log('An error occurred...', error);
                    });
                }
                else {
                    alert('No records were found.');
                    location.href = 'http://localhost:3000/adoApp#!/home';
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.gotoCropPage = function () {
        adoService.setReferenceNo($scope.ddlRefNo);
        $state.go('dashboard.cropDetails');
    };

    $scope.getRefNoDetails = function () {
        $scope.referenceNo = adoService.getReferenceNo();
        if ('indexedDB' in window) {
            readItemFromData('crop-details', $scope.referenceNo).then(function success(response) {
                if (response != null) {
                    $scope.refNoDetails = response;
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.gotoPhotoDetails = function () {
        adoService.setReferenceNo($scope.refNoDetails.ReferenceNo);
        adoService.setCropCode($scope.refNoDetails.CropCode);
        adoService.setBlockCode($scope.refNoDetails.BlockCode);
        adoService.setDistrictCode($scope.refNoDetails.DistrictCode);
        $state.go('dashboard.photo');
    };

    $scope.getCropPhotoDetailsData = function () {
        document.getElementById('top').scrollIntoView();
        $scope.referenceNo = adoService.getReferenceNo();
        $scope.cropCode = adoService.getCropCode();
        $scope.blockCode = adoService.getBlockCode();
        $scope.districtCode = adoService.getDistrictCode();
        if ('indexedDB' in window) {
            readItemFromData('photo-location', $scope.referenceNo).then(function success(response) {
                if (response != null) {
                    $scope.result = response;
                    getImage($scope.result.FLP, $scope.result.RLP1, $scope.result.RLP2);
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
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

    $scope.gotoPestDetails = function () {
        adoService.setReferenceNo($scope.referenceNo);
        adoService.setCropCode($scope.cropCode);
        adoService.setBlockCode($scope.blockCode);
        adoService.setDistrictCode($scope.districtCode);
        $state.go('dashboard.pestDetails');
    };

    $scope.getPestDetails = function () {
        $scope.referenceNo = adoService.getReferenceNo();
        $scope.cropCode = adoService.getCropCode();
        $scope.blockCode = adoService.getBlockCode();
        $scope.districtCode = adoService.getDistrictCode();
        if ('indexedDB' in window) {
            readItemFromData('pest-details', $scope.referenceNo).then(function success(response) {
                if (response != null && response != undefined && response != '') {
                    $scope.pestDetails = response;
                    var pc = null;
                    $scope.ddlPest == null ? pc = 0 : $scope.ddlPest == undefined ? pc = 0 : pc = $scope.pestDetails.PestDiseaseCode;
                    readItemFromData('pest-disease', pc).then(function success(res) {
                        $scope.ddlPestname = (pc == 0) ? null : res.PestDiseaseName;
                    }, function error(response) {
                        console.log(response.status);
                    }).catch(function err(error) {
                        console.log('An error occurred...', error);
                    });
                    $scope.txtLowAreaAffected = $scope.pestDetails.LowIntensityAttackArea;
                    $scope.txtMediumAreaAffected = $scope.pestDetails.MediumIntensityAttackArea;
                    $scope.txtHighAreaAffected = $scope.pestDetails.HighIntensityAttackArea;
                    $scope.ddlMAdvisory = $scope.pestDetails.AdvisoryModerate;
                    $scope.ddlHAdvisory = $scope.pestDetails.AdvisoryHigh;
                    $scope.txtAreaOfLand = $scope.pestDetails.AreaOfLand;
                    $scope.ddlMPP = $scope.pestDetails.ModerateIntensityPestPopulation;
                    $scope.ddlHPP = $scope.pestDetails.HighIntensityPestPopulation;
                    $scope.txtLowAreaTreated = $scope.pestDetails.LowIntensityTreatedArea;
                    $scope.txtMediumAreaTreated = $scope.pestDetails.MediumIntensityTreatedArea;
                    $scope.txtHighAreaTreated = $scope.pestDetails.HighIntensityTreatedArea;
                    $scope.rbPestIdentified = $scope.pestDetails.InfectionIdentified;
                    $scope.getPestPopulation($scope.pestDetails.PestDiseaseCode);
                    $scope.getPesticides($scope.pestDetails.PestDiseaseCode);
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getPestDiseases = function () {
        if ('indexedDB' in window) {
            readAllData('pest-disease').then(function success(response) {
                if (response.length > 0) {
                    var cropType = ($scope.cropCode == 202) ? 'MS' : ($scope.cropCode == 201) ? 'GN' : ($scope.cropCode == 206) ? 'SN' : null;
                    if (cropType != null) {
                        $scope.pestDiseases = ($filter('filter')(response, { CropCode: $scope.cropCode, CropType: cropType }, true));
                    }
                    else {
                        $scope.pestDiseases = ($filter('filter')(response, { CropCode: $scope.cropCode }, true));
                    }
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getPestPopulation = function (pestCode) {
        if ('indexedDB' in window) {
            readAllData('pest-disease-intensity').then(function success(response) {
                if (response.length > 0) {
                    $scope.pestPopulation = ($filter('filter')(response, { PestDiseaseCode: pestCode }, true));
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
                    $scope.$apply();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getPesticides = function(pestCode) {
        if ('indexedDB' in window) {
            readAllData('pesticide').then(function success(response) {
                if (response.length > 0) {
                    var advisories = ($filter('filter')(response, { PestDiseaseCode: pestCode }, true));
                    if (advisories.length > 0) {
                        var mAdvisory = [];
                        var hAdvisory = [];
                        var pestDetails = ($filter('filter')($scope.pestDiseases, { PestDiseaseCode: pestCode }, true));
                        readItemFromData('crop-details', $scope.referenceNo).then(function success(response) {
                            if (response != null && response != undefined && response != '') {
                                var cropName = response.CropName;
                                angular.forEach(advisories, function(i) {
                                    var ma = {
                                        maObj: cropName + ' - ' + pestDetails[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                                    };
                                    mAdvisory.push(ma);
                                    var ha = {
                                        haObj: cropName + ' - ' + pestDetails[0].PestDiseaseName + ' - ' + i.PesticideName + ' - ' + i.RecommendedDose + ' / ' + i.PesticideNameOdia + ' - ' + i.RecommendedDoseOdia
                                    };
                                    hAdvisory.push(ha);
                                });
                                $scope.moderateAdvisories = mAdvisory;
                                $scope.highAdvisories = hAdvisory;
                                $scope.$apply();
                            }
                            else {
                                alert('Please complete the Synchronization process to get all the details.');
                                logout();
                            }
                        }, function error(response) {
                            console.log(response.status);
                        }).catch(function err(error) {
                            console.log('An error occurred...', error);
                        });
                    }
                    else {
                        $scope.moderateAdvisories = null;
                        $scope.highAdvisories = null;
                        $scope.$apply();
                    }
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.pdIntensity = [];
    $scope.checkAdvisoryandPP = function(pestCode) {
        if (pestCode != null || pestCode != undefined) {
            readAllData('pesticide').then(function success(response) {
                if (response.length > 0) {
                    var pesticides = ($filter('filter')(response, { PestDiseaseCode: pestCode }, true));
                    if (pesticides.length == 0) {
                        alert('Advisory is not found under the selected pest. Please contact Administrator.');
                        $scope.ddlPest = null;
                    }
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
            readAllData('pest-disease-intensity').then(function success(response1) {
                if (response1.length > 0) {
                    $scope.pdIntensity = ($filter('filter')(response1, { PestDiseaseCode: pestCode }, true));
                    $scope.$apply();
                }
                else {
                    alert('Please complete the Synchronization process to get all the details.');
                    logout();
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
                if (($scope.rbPestIdentified == "Yes" && $scope.ddlPest != null && ((maa != 0.0 && haa != 0.0 && $scope.ddlMAdvisory != null && $scope.ddlHAdvisory != null) || (maa != 0.0 && haa == 0.0 && $scope.ddlMAdvisory != null && $scope.ddlHAdvisory == null) || (maa == 0.0 && haa != 0.0 && $scope.ddlMAdvisory == null && $scope.ddlHAdvisory != null))) || ($scope.rbPestIdentified == "No" && $scope.ddlPest == null && $scope.ddlMAdvisory == null && $scope.ddlHAdvisory == null && (maa != 0.0 || haa != 0.0))) {
                    var message = confirm('Do you really want to submit the form?');
                    if (message) {
                        if ($scope.referenceNo != null && $scope.referenceNo != undefined && $scope.referenceNo != '' && $scope.cropCode != null && $scope.cropCode != undefined && $scope.cropCode != '') {
                            var totalAreaAffected = parseFloat($scope.txtLowAreaAffected) + parseFloat($scope.txtMediumAreaAffected) + parseFloat($scope.txtHighAreaAffected);
                            var totalAreaOfLand = parseFloat($scope.txtAreaOfLand);
                            if (totalAreaAffected <= totalAreaOfLand) {
                                var totalAreaToBeTreated = parseFloat($scope.txtLowAreaTreated) + parseFloat($scope.txtMediumAreaTreated) + parseFloat($scope.txtHighAreaTreated);
                                if (totalAreaToBeTreated <= totalAreaAffected) {
                                    var lowAreaAffected = parseFloat($scope.txtLowAreaAffected); var mediumAreaAffected = parseFloat($scope.txtMediumAreaAffected); var highAreaAffected = parseFloat($scope.txtHighAreaAffected); var lowAreaTreated = parseFloat($scope.txtLowAreaTreated); var mediumAreaTreated = parseFloat($scope.txtMediumAreaTreated); var highAreaTreated = parseFloat($scope.txtHighAreaTreated);
                                    if (lowAreaTreated <= lowAreaAffected && mediumAreaTreated <= mediumAreaAffected && highAreaTreated <= highAreaAffected) {
                                        if ('indexedDB' in window) {
                                            var pc = null;
                                            $scope.ddlPest == null ? pc = 0 : $scope.ddlPest == undefined ? pc = 0 : pc = $scope.ddlPest;
                                            readItemFromData('pest-disease', pc).then(function success(response) {
                                                var myData = {
                                                    ReferenceNo: $scope.referenceNo,
                                                    InfectionIdentified: $scope.rbPestIdentified,
                                                    PestDiseaseCode: $scope.ddlPest,
                                                    PestDiseaseName: pc == 0 ? null : response.PestDiseaseName,
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
                                                    AdvisoryHigh: $scope.ddlHAdvisory,
                                                    BlockCode: $scope.blockCode,
                                                    DistrictCode: $scope.districtCode
                                                };
                                                var refNoStatus = {
                                                    ReferenceNo: $scope.referenceNo,
                                                    Status: 0
                                                };
                                                writeData('pest-details', myData).then(function () {
                                                    writeData('referenceNo-status', refNoStatus).then(function () {
                                                        alert('The pest information is Updated with the Reference No. ' + myData.ReferenceNo + '.');
                                                        angular.element(document.querySelector('#lblPD')).removeClass('ng-hide');
                                                        angular.element(document.querySelector('#txtPD')).addClass('ng-hide');
                                                        $scope.getPestDetails();
                                                        $scope.getPestDiseases();
                                                        $state.go('dashboard.pestDetails');
                                                    }, function error(response) {
                                                        console.log(response.status);
                                                    }).catch(function err(error) {
                                                        console.log('An error occurred...', error);
                                                    });
                                                }, function error(response) {
                                                    console.log(response.status);
                                                }).catch(function err(error) {
                                                    console.log('An error occurred...', error);
                                                });
                                            }, function error(response) {
                                                console.log(response.status);
                                            }).catch(function err(error) {
                                                console.log('An error occurred...', error);
                                            });
                                        }
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
                            alert('Please submit the Crop Details Section.');
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

    $scope.backToPhoto = function () {
        adoService.setReferenceNo($scope.referenceNo);
        adoService.setCropCode($scope.cropCode);
        adoService.setBlockCode($scope.blockCode);
        adoService.setDistrictCode($scope.districtCode);
        $state.go('dashboard.photo');
    };

    $scope.cancelPestDetails = function () {
        angular.element(document.querySelector('#lblPD')).removeClass('ng-hide');
        angular.element(document.querySelector('#txtPD')).addClass('ng-hide');
    };

    $scope.EditPestDetailsPage = true;
    $scope.SavePestDetails = false;
    $scope.editPestDetails = function () {
        angular.element(document.querySelector('#lblPD')).addClass('ng-hide');
        angular.element(document.querySelector('#txtPD')).removeClass('ng-hide');
    };
    
    $scope.backToCropDetails = function () {
        $scope.referenceNo = adoService.getReferenceNo();
        $scope.cropCode = adoService.getCropCode();
        $scope.blockCode = adoService.getBlockCode();
        $scope.districtCode = adoService.getDistrictCode();
        $state.go('dashboard.cropDetails');
    };

    $scope.submit = function () {
        var message = confirm('Do you really want to submit the form?');
        if (message) {
            var refNoStatus = {
                ReferenceNo: $scope.referenceNo,
                Status: 1
            };
            if ('indexedDB' in window) {
                writeData('referenceNo-status', refNoStatus).then(function () {
                    alert('The pest information is Submit with the Reference No. ' + refNoStatus.ReferenceNo + '.');
                    $state.go('home');
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
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