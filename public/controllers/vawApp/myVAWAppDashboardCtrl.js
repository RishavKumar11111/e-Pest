app.controller('myVAWAppDashboardCtrl', function ($scope, $filter, $state, vawService) {

    $scope.checkUserDetails = function () {
        if ('indexedDB' in window) {
            readAllData('user-login').then(function success(response) {
                if (response.length == 0) {
                    logout();
                }
                else {
                    $scope.vawCode = response[0].Username;
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
    //     if (d == 0 || d == 5 || d == 6) {
    //         alert('You are only allowed to enter details on Monday, Tuesday, Wednesday & Thursday.');
    //         location.href = 'http://localhost:3000/vawApp#!/home';
    //     }
    // };

    $scope.checkDay = function () {
        var dt = new Date();
        var d = dt.getDay();
        if (d == 0) {
            alert('You are not allowed to enter details on Sunday.');
            location.href = 'http://localhost:3000/vawApp#!/home';
        }
    };

    $scope.clearData = function () {
        if ('indexedDB' in window) {
            readAllData('referenceNo-status').then(function success(response) {
                if (response.length > 0) {
                    angular.forEach(response, function (i) {
                        if (i.Status == 0) {
                            clearItemFromData('crop-details-entry', i.ReferenceNo).then(function () {
                                readAllData('refNo-fID-aID').then(function success(response1) {
                                    if (response1.length > 0) {
                                        angular.forEach(response1, function (j) {
                                            if (j.ReferenceNo == i.ReferenceNo) {
                                                clearItemFromData('refNo-fID-aID', j.ID).then(function () {
                                                }, function error(response) {
                                                    console.log(response.status);
                                                }).catch(function err(error) {
                                                    console.log('An error occurred...', error);
                                                });
                                            }
                                        });
                                    }
                                    clearItemFromData('pest-details-entry', i.ReferenceNo).then(function () {
                                        clearItemFromData('photo-location-entry', i.ReferenceNo).then(function () {
                                            clearItemFromData('referenceNo-status', i.ReferenceNo).then(function () {
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
                    });
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getVAWGPs = function () {
        if ('indexedDB' in window) {
            readAllData('gp').then(function success(response) {
                if (response.length > 0) {
                    $scope.vawGPs = response;
                    $scope.districtName = $scope.vawGPs[0].PDSDistrictName.toString().substr(0, 3);
                    $scope.$apply();
                }
                else {
                    alert('You have not been allotted GP targets. Please contact the concerned authority.');
                    logout();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getVillages = function (gpCode) {
        if ('indexedDB' in window) {
            readAllData('village').then(function success(response) {
                if (response.length > 0) {
                    $scope.villages = ($filter('filter')(response, { GPCode: gpCode }, true));
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
            readAllData('crop-details-entry').then(function success(response1) {
                if (response1.length > 0) {
                    angular.forEach(response1, function (i) {
                        if (($scope.ddlGP).toString() == i.ReferenceNo.substr(11, 6)) {
                            $scope.refNo = i.ReferenceNo.substr(0, 18) + (parseInt(i.ReferenceNo.substr(18)) + 1).toString();
                        }
                    });
                    if ($scope.refNo == undefined || $scope.refNo == null || $scope.refNo == '') {
                        readAllData('referenceNo-count').then(function success(response2) {
                            if (response2.length > 0) {
                                angular.forEach(response2, function (i) {
                                    if (($scope.ddlGP).toString() == i.semiRefNo.substr(11, 6)) {
                                        $scope.refNo = i.semiRefNo + (i.countRefNo + 1).toString();
                                    }
                                });
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
                }
                else {
                    readAllData('referenceNo-count').then(function success(response3) {
                        if (response3.length > 0) {
                            angular.forEach(response3, function (i) {
                                if (($scope.ddlGP).toString() == i.semiRefNo.substr(11, 6)) {
                                    $scope.refNo = i.semiRefNo + (i.countRefNo + 1).toString();
                                }
                            });
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
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.faArray = [];
    $scope.addFAID = function () {
        if (($scope.txtAadhaarNo != '' && $scope.txtAadhaarNo != null && $scope.txtAadhaarNo != undefined && $scope.txtAadhaarNo.length == 12) || ($scope.txtFarmerID != '' && $scope.txtFarmerID != null && $scope.txtFarmerID != undefined && ($scope.txtAadhaarNo == null || $scope.txtAadhaarNo == '' || $scope.txtAadhaarNo == undefined || $scope.txtAadhaarNo.length == 12))) {
            if ($scope.txtFarmerID != '' && $scope.txtFarmerID != null && $scope.txtFarmerID != undefined) {
                var l = $scope.districtName + '/' + $scope.txtFarmerID;
                var r = true;
                if ($scope.faArray.length > 0) {
                    angular.forEach($scope.faArray, function (i) {
                        if (i.FarmerID == l || (i.AadhaarNo == $scope.txtAadhaarNo && i.AadhaarNo != null && $scope.txtAadhaarNo != null)) {
                            alert('The Farmer ID or Aadhaar No. is already entered.');
                            r = false;
                        }
                    });
                }
                if (r == true) {
                    var m = ($scope.txtAadhaarNo == undefined) ? null : ($scope.txtAadhaarNo == null) ? null : ($scope.txtAadhaarNo == '') ? null : $scope.txtAadhaarNo;
                    var k = { FarmerID: l, AadhaarNo: m };
                    $scope.faArray.push(k);
                }
                $scope.txtFarmerID = null;
                $scope.txtAadhaarNo = null;
            }
            else {
                var r = true;
                if ($scope.faArray.length > 0) {
                    angular.forEach($scope.faArray, function (i) {
                        if (i.AadhaarNo == $scope.txtAadhaarNo) {
                            alert('The Aadhaar No. is already entered.');
                            r = false;
                        }
                    });
                }
                if (r == true) {
                    var k = { FarmerID: null, AadhaarNo: $scope.txtAadhaarNo };
                    $scope.faArray.push(k);
                }
                $scope.txtFarmerID = null;
                $scope.txtAadhaarNo = null;
            }
        }
        else {
            alert('Please enter a valid Aadhaar No. or Farmer ID.');
        }
    };

    $scope.removeFarmerID = function (index) {
        $scope.faArray.splice(index, 1);
    };

    $scope.month = function () {
        var m = new Date().getMonth();
        if (m >= 6 && m <= 10) {
            $scope.rbSeason = 'Kharif';
        }
        else {
            $scope.rbSeason = 'Rabi';
        }
        return $scope.rbSeason;
    };

    $scope.getCropCategories = function () {
        if ('indexedDB' in window) {
            readAllData('crop-category').then(function success(response) {
                if (response.length > 0) {
                    $scope.cropCategories = response;
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

    $scope.getCrops = function (cropCategoryCode) {
        if ('indexedDB' in window) {
            readAllData('crop').then(function success(response) {
                if (response.length > 0) {
                    $scope.crops = ($filter('filter')(response, { CropCategoryCode: cropCategoryCode }, true));
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

    $scope.checkPest = function (cropCode) {
        if (cropCode != null || cropCode != undefined) {
            readAllData('pest-disease').then(function success(response) {
                if (response.length > 0) {
                    var pests = ($filter('filter')(response, { CropCode: cropCode }, true));
                    if (pests.length == 0) {
                        alert('Pest is not found under the selected crop. Please contact Administrator.');
                        $scope.ddlCrop = null;
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

    $scope.getCropStages = function () {
        if ('indexedDB' in window) {
            readAllData('crop-stage').then(function success(response) {
                if (response.length > 0) {
                    $scope.cropStages = response;
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

    var addFarmerData = function (faData, callback) {
        angular.forEach(faData, function (i) {
            writeData('refNo-fID-aID', i).then(function () {
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        });
        callback();
    };

    $scope.submitCropDetails = function (isValid) {
        if (isValid) {
            if ($scope.faArray.length > 0) {
                var message = confirm('Do you really want to submit the form?');
                if (message) {
                    var cropData = {
                        ReferenceNo: $scope.refNo,
                        GPCode: $scope.ddlGP,
                        VillageCode: $scope.ddlVillage,
                        Season: $scope.month(),
                        MobileNo: $scope.txtMobileNo,
                        CropCategoryCode: $scope.ddlCropCategory,
                        CropCode: $scope.ddlCrop,
                        CropStageCode: $scope.ddlCropStage,
                        VAWCode: $scope.vawCode
                    };
                    var faData = [];
                    angular.forEach($scope.faArray, function (i) {
                        var encodedAN = null;
                        if (i.AadhaarNo != null) {
                            encodedAN = btoa(i.AadhaarNo);
                        }
                        var k = {
                            ReferenceNo: $scope.refNo,
                            FarmerID: i.FarmerID,
                            AadhaarNo: encodedAN
                        };
                        faData.push(k);
                    });
                    var refNoStatus = {
                        ReferenceNo: $scope.refNo,
                        Status: 0
                    };
                    if ('indexedDB' in window) {
                        writeData('crop-details-entry', cropData).then(function () {
                            addFarmerData(faData, function () {
                                writeData('referenceNo-status', refNoStatus).then(function () {
                                    alert('The crop information is submitted with the Reference No. ' + cropData.ReferenceNo + '.');
                                    vawService.setReferenceNo(cropData.ReferenceNo);
                                    vawService.setCropCode(cropData.CropCode);
                                    $state.go('dashboard.pestDetails');
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                        }, function error(response) {
                            console.log(response.status);
                        }).catch(function err(error) {
                            console.log('An error occurred...', error);
                        });
                    }
                }
            }
            else {
                alert('Please click on the "+ - signed" button to add Farmer ID and / or Aadhaar No.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.getCropDetailsData = function () {
        document.getElementById('top').scrollIntoView();
        $scope.referenceNo = vawService.getReferenceNo();
        $scope.cropCode = vawService.getCropCode();
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
                    else {
                        $scope.moderatePestPopulation = null;
                        $scope.highPestPopulation = null;
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

    $scope.getPesticides = function (pestCode) {
        if ('indexedDB' in window) {
            readAllData('pesticide').then(function success(response) {
                if (response.length > 0) {
                    var advisories = ($filter('filter')(response, { PestDiseaseCode: pestCode }, true));
                    if (advisories.length > 0) {
                        var mAdvisory = [];
                        var hAdvisory = [];
                        var pestDetails = ($filter('filter')($scope.pestDiseases, { PestDiseaseCode: pestCode }, true));
                        readItemFromData('crop', $scope.cropCode).then(function success(response) {
                            if (response != null && response != undefined && response != '') {
                                var cropName = response.CropName;
                                angular.forEach(advisories, function (i) {
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
    $scope.checkAdvisoryandPP = function (pestCode) {
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

    $scope.submitPestDetails = function (isValid) {
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
                                        var pestData = {
                                            ReferenceNo: $scope.referenceNo,
                                            InfectionIdentified: $scope.rbPestIdentified,
                                            PestDiseaseCode: $scope.ddlPest,
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
                                        var refNoStatus = {
                                            ReferenceNo: $scope.referenceNo,
                                            Status: 0
                                        };
                                        if ('indexedDB' in window) {
                                            writeData('pest-details-entry', pestData).then(function () {
                                                writeData('referenceNo-status', refNoStatus).then(function () {
                                                    alert('The pest information is submitted with the Reference No. ' + pestData.ReferenceNo + '.');
                                                    vawService.setReferenceNo(pestData.ReferenceNo);
                                                    $state.go('dashboard.capturePhoto');
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

    $scope.getPestDetailsData = function () {
        document.getElementById('top').scrollIntoView();
        $scope.referenceNo = vawService.getReferenceNo();
    };

    $scope.readFile = function (e) {
        var file = e.files[0];
        if (e.files && file) {
            var reader = new FileReader();
            var blob = file.slice(0, 4);
            reader.readAsArrayBuffer(blob);
            reader.onload = function (event) {
                checkMIMEType(event, file, function (obj) {
                    if (obj.fileName == null || obj.fileName == '' || obj.fileName == undefined || obj.fileType == 'Unknown / Missing Extension' || obj.binaryFileType == 'Unknown File Type') {
                        alert('Invalid File.');
                        return false;
                    }
                    else {
                        compressImage(file, reader, obj.fileName, function (compressedFile) {
                            getImage(compressedFile, e, reader);
                            getGeolocation(e.parentElement.id);
                        });
                    }
                });
            };
        }
    };

    var checkMIMEType = function (event, file, callback) {
        if (event.target.readyState === FileReader.DONE) {
            var uint = new Uint8Array(event.target.result);
            var bytes = [];
            uint.forEach(function (byte) {
                bytes.push(byte.toString(16));
            })
            var hex = bytes.join('').toUpperCase();
            var obj = {
                fileName: file.name,
                fileType: file.type ? file.type : 'Unknown / Missing Extension',
                binaryFileType: getMIMEType(hex)
            };
            callback(obj);
        }
    };

    var getMIMEType = function (signature) {
        switch (signature) {
            case '89504E47':
                return 'image/png'
            case '47494638':
                return 'image/gif'
            case 'FFD8FFDB':
            case 'FFD8FFE0':
            case 'FFD8FFE1':
            case 'FFD8FFE2':
            case 'FFD8FFE3':
            case 'FFD8FFE8':
                return 'image/jpeg'
            default:
                return 'Unknown File Type'
        }
    };

    var compressImage = function (file, reader, fileName, callback) {
        var width = 500;
        var height = 300;
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            var img = new Image();
            img.src = evt.target.result;
            img.onload = function () {
                var elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                var ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                ctx.canvas.toBlob(function (blob) {
                    var compressedFile = new File([blob], fileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    callback(compressedFile);
                }, 'image/jpeg', 1);
            };
        };
        reader.onerror = function (err) {
            console.log('Error: ', err);
        };
    };

    var getImage = function (file, e, reader) {
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            appendImage(e.parentElement.id, evt);
        };
        reader.onerror = function (err) {
            console.log('Error: ', err);
        };
    };

    var appendImage = function (id, evt) {
        if (id == 'recapture1') { id = 'image1'; } else if (id == 'recapture2') { id = 'image2'; } else if (id == 'recapture3') { id = 'image3'; }
        var divID = document.getElementById(id);
        if (divID) {
            divID.outerHTML = '<img src="' + evt.target.result + '" id="image' + id.slice(-1) + '" style="width: 100%; height: 172.8px" />';
        }
        else {
            alert('Please capture the image first.');
        }
    };

    var getGeolocation = function (id) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = parseFloat(position.coords.latitude.toFixed(7));
                var long = parseFloat(position.coords.longitude.toFixed(7));
                if (id == 'cameraBtn1' || id == 'recapture1') {
                    if (document.getElementById('image1')) {
                        $scope.firstLatitude = lat;
                        $scope.firstLongitude = long;
                    }
                    else {
                        $scope.firstLatitude = undefined;
                        $scope.firstLongitude = undefined;
                    }
                }
                else if (id == 'cameraBtn2' || id == 'recapture2') {
                    if (document.getElementById('image2')) {
                        $scope.secondLatitude = lat;
                        $scope.secondLongitude = long;
                    }
                    else {
                        $scope.secondLatitude = undefined;
                        $scope.secondLongitude = undefined;
                    }
                }
                else if (id == 'cameraBtn3' || id == 'recapture3') {
                    if (document.getElementById('image3')) {
                        $scope.thirdLatitude = lat;
                        $scope.thirdLongitude = long;
                    }
                    else {
                        $scope.thirdLatitude = undefined;
                        $scope.thirdLongitude = undefined;
                    }
                }
                $scope.$apply();
            }, function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('User denied the request for Geolocation. Please visit "https://support.google.com/chrome/answer/142065" to re-enable and use the application.');
                        if (id == 'cameraBtn1' || id == 'recapture1') {
                            $scope.firstLatitude = undefined;
                            $scope.firstLongitude = undefined;
                        }
                        else if (id == 'cameraBtn2' || id == 'recapture2') {
                            $scope.secondLatitude = undefined;
                            $scope.secondLongitude = undefined;
                        }
                        else if (id == 'cameraBtn3' || id == 'recapture3') {
                            $scope.thirdLatitude = undefined;
                            $scope.thirdLongitude = undefined;
                        }
                        $scope.$apply();
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Location information is unavailable.');
                        if (id == 'cameraBtn1' || id == 'recapture1') {
                            $scope.firstLatitude = 0;
                            $scope.firstLongitude = 0;
                        }
                        else if (id == 'cameraBtn2' || id == 'recapture2') {
                            $scope.secondLatitude = 0;
                            $scope.secondLongitude = 0;
                        }
                        else if (id == 'cameraBtn3' || id == 'recapture3') {
                            $scope.thirdLatitude = 0;
                            $scope.thirdLongitude = 0;
                        }
                        $scope.$apply();
                        break;
                    case error.TIMEOUT:
                        alert('The request to get user location timed out.');
                        break;
                    case error.UNKNOWN_ERROR:
                        alert('An unknown error occurred.');
                        break;
                }
            });
        }
        else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    $scope.submitPhotoDetails = function (isValid) {
        if (isValid) {
            if (document.getElementById("image1") !== null) {
                // if ($scope.firstLatitude != undefined && $scope.firstLatitude != null && $scope.firstLatitude != '' && $scope.firstLongitude != undefined && $scope.firstLongitude != null && $scope.firstLongitude != '') {
                if ($scope.firstLatitude != undefined && $scope.firstLatitude != null && $scope.firstLongitude != undefined && $scope.firstLongitude != null) {
                    // if ($scope.firstLatitude != $scope.secondLatitude && $scope.firstLatitude != $scope.thirdLatitude && $scope.firstLongitude != $scope.secondLongitude && $scope.firstLongitude != $scope.thirdLongitude && (($scope.secondLatitude != undefined && $scope.secondLatitude != null && $scope.thirdLatitude != undefined && $scope.thirdLatitude != null && $scope.secondLatitude != $scope.thirdLatitude) || (($scope.secondLatitude == undefined || $scope.secondLatitude == null) && ($scope.thirdLatitude == undefined || $scope.thirdLatitude == null) && $scope.secondLatitude == $scope.thirdLatitude) || (((($scope.secondLatitude == undefined || $scope.secondLatitude == null) && $scope.thirdLatitude != undefined && $scope.thirdLatitude != null) || ($scope.secondLatitude != undefined && $scope.secondLatitude != null && ($scope.thirdLatitude == undefined || $scope.thirdLatitude == null))) && $scope.secondLatitude != $scope.thirdLatitude)) && (($scope.secondLongitude != undefined && $scope.secondLongitude != null && $scope.thirdLongitude != undefined && $scope.thirdLongitude != null && $scope.secondLongitude != $scope.thirdLongitude) || (($scope.secondLongitude == undefined || $scope.secondLongitude == null) && ($scope.thirdLongitude == undefined || $scope.thirdLongitude == null) && $scope.secondLongitude == $scope.thirdLongitude) || (((($scope.secondLongitude == undefined || $scope.secondLongitude == null) && $scope.thirdLongitude != undefined && $scope.thirdLongitude != null) || ($scope.secondLongitude != undefined && $scope.secondLongitude != null && ($scope.thirdLongitude == undefined || $scope.thirdLongitude == null))) && $scope.secondLongitude != $scope.thirdLongitude))) {
                    var message = confirm('Do you really want to submit the form?');
                    if (message) {
                        if ($scope.referenceNo != null && $scope.referenceNo != undefined && $scope.referenceNo != '') {
                            var image1Data = document.getElementById("image1").src.replace('data:image/jpeg;base64,', '');
                            if (document.getElementById("image2") !== null) {
                                var image2Data = document.getElementById("image2").src.replace('data:image/jpeg;base64,', '');
                            }
                            else {
                                var image2Data = null; $scope.secondLatitude = null; $scope.secondLongitude = null;
                            }
                            if (document.getElementById("image3") !== null) {
                                var image3Data = document.getElementById("image3").src.replace('data:image/jpeg;base64,', '');
                            }
                            else {
                                var image3Data = null; $scope.thirdLatitude = null; $scope.thirdLongitude = null;
                            }
                            var plData = {
                                ReferenceNo: $scope.referenceNo,
                                Image1: image1Data,
                                Image2: image2Data,
                                Image3: image3Data,
                                FixedLandLatitude: $scope.firstLatitude,
                                FixedLandLongitude: $scope.firstLongitude,
                                RandomLandLatitude1: $scope.secondLatitude,
                                RandomLandLongitude1: $scope.secondLongitude,
                                RandomLandLatitude2: $scope.thirdLatitude,
                                RandomLandLongitude2: $scope.thirdLongitude
                            };
                            var refNoStatus = {
                                ReferenceNo: $scope.referenceNo,
                                Status: 1
                            };
                            if ('indexedDB' in window) {
                                writeData('photo-location-entry', plData).then(function () {
                                    writeData('referenceNo-status', refNoStatus).then(function () {
                                        alert('The photo and location information is submitted with the Reference No. ' + plData.ReferenceNo + '.');
                                        location.href = 'http://localhost:3000/vawApp#!/home';
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
                            alert('Please submit the Crop Details & Pest Details Sections.');
                        }
                    }
                    // }
                    // else {
                    //     alert('GPS Location of all photos must be different.');
                    // }
                }
                else {
                    alert('Please enable your device location and allow browser to access your location. Recapture the images which do not have location details after completing the previous process. Please visit "https://support.google.com/chrome/answer/142065".');
                }
            }
            else {
                alert('Please upload the first image.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

});

app.directive('mobileNoOnly', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            element.on('input change', function () {
                if (this.value === '0' || this.value === '1' || this.value === '2' || this.value === '3' || this.value === '4' || this.value === '5') {
                    this.value = null;
                }
            });
        }
    };
});

app.directive('numbersOnly', function () {
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
                var clean = val.replace(/[^0-9]/g, '');
                var negativeCheck = clean.split('-');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }
                }
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
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