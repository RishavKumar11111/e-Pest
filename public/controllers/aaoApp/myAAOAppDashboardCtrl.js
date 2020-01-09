app.controller('myAAOAppDashboardCtrl', function ($scope, $filter, $state, aaoService) {

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
    //         location.href = 'http://localhost:3000/aaoApp#!/home';
    //     }
    // };

    $scope.checkDay = function() {
        var dt = new Date();
        var d = dt.getDay();
        if (d == 0) {
            alert('You are not allowed to enter details on Sunday.');
            location.href = 'http://localhost:3000/aaoApp#!/home';
        }
    };

    $scope.getRefNos = function () {
        if ('indexedDB' in window) {
            readAllData('referenceNo').then(function success(response) {
                if (response.length > 0) {
                    readAllData('referenceNo-status').then(function success(response1) {
                        if (response1.length > 0) {
                            var filteredRefNos = ($filter('filter')(response1, { Status: 1 }, true));
                            $scope.refNos = response.filter(item => filteredRefNos.every(item2 => item2.ReferenceNo != item.ReferenceNo));
                            $scope.$apply();
                        }
                        else {
                            $scope.refNos = response;
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
                    location.href = 'http://localhost:3000/aaoApp#!/home';
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.proceedToCropDetails = function (refNo) {
        aaoService.setReferenceNo(refNo);
        $state.go('dashboard.cropDetails');
    };

    $scope.getRefNoDetails = function () {
        $scope.referenceNo = aaoService.getReferenceNo();
        if ('indexedDB' in window) {
            readItemFromData('crop-details', $scope.referenceNo).then(function success(response) {
                if (response != null && response != undefined && response != '') {
                    $scope.refNoDetails = response;
                    $scope.txtMobileNo = $scope.refNoDetails.MobileNo;
                    $scope.ddlCC = $scope.refNoDetails.CropCode;
                    $scope.ddlCaCo = $scope.refNoDetails.CategoryCode;
                    $scope.ddlCSC = $scope.refNoDetails.CropStageCode;
                    $scope.districtName = response.PDSDistrictName.toString().substr(0, 3);
                    $scope.getCrops($scope.refNoDetails.CategoryCode);
                    readAllData('refNo-fID-aID').then(function success(response1) {
                        if (response1.length > 0) {
                            $scope.faArray = ($filter('filter')(response1, { ReferenceNo: $scope.referenceNo }, true));
                            angular.forEach($scope.faArray, function(i) {
                                if (i.AadhaarNo != null) {
                                    i.AadhaarNo = atob(i.AadhaarNo);
                                }
                            });
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

    $scope.proceedToPhoto = function () {
        aaoService.setReferenceNo($scope.referenceNo);
        aaoService.setCropCategoryCode($scope.refNoDetails.CategoryCode);
        aaoService.setCropCode($scope.refNoDetails.CropCode);
        $state.go('dashboard.photo');
    };

    $scope.lblCropDetails = true;
    $scope.txtCropDetails = false;
    $scope.modifyCropDetails = function () {
        angular.element(document.querySelector('#lblCD')).addClass('ng-hide');
        angular.element(document.querySelector('#txtCD')).removeClass('ng-hide');
    };

    $scope.cancelCropDetails = function () {
        angular.element(document.querySelector('#lblCD')).removeClass('ng-hide');
        angular.element(document.querySelector('#txtCD')).addClass('ng-hide');
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

    $scope.checkPest = function(cropCode) {
        if (cropCode != null || cropCode != undefined) {
            readAllData('pest-disease').then(function success(response) {
                if (response.length > 0) {
                    var pests = ($filter('filter')(response, { CropCode: cropCode }, true));
                    if (pests.length == 0) {
                        alert('Pest is not found under the selected crop. Please contact Administrator.');
                        $scope.ddlCC = null;
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

    $scope.addFAID = function() {
        if (($scope.txtAadhaarNo != '' && $scope.txtAadhaarNo != null && $scope.txtAadhaarNo != undefined && $scope.txtAadhaarNo.length == 12) || ($scope.txtFarmerID != '' && $scope.txtFarmerID != null && $scope.txtFarmerID != undefined && ($scope.txtAadhaarNo == null || $scope.txtAadhaarNo == '' || $scope.txtAadhaarNo == undefined || $scope.txtAadhaarNo.length == 12))) {
            if ($scope.txtFarmerID != '' && $scope.txtFarmerID != null && $scope.txtFarmerID != undefined) {
                var l = $scope.districtName + '/' + $scope.txtFarmerID;
                var r = true;
                if ($scope.faArray.length > 0) {
                    angular.forEach($scope.faArray, function(i) {
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
                    angular.forEach($scope.faArray, function(i) {
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

    var modifyFAData = function(faData, callback) {
        if ('indexedDB' in window) {
            readAllData('refNo-fID-aID').then(function success(response) {
                if (response.length > 0) {
                    var fData = ($filter('filter')(response, { ReferenceNo: $scope.refNoDetails.ReferenceNo }, true));
                    angular.forEach(fData, function(i) {
                        clearItemFromData('refNo-fID-aID', i.ID).then(function() {
                        }, function error(response) {
                            console.log(response.status);
                        }).catch(function err(error) {
                            console.log('An error occurred...', error);
                        });
                    });
                    var counter = 0;
                    angular.forEach(faData, function(i) {
                        if (i.AadhaarNo != null) {
                            encodedAN = btoa(i.AadhaarNo);
                            i.AadhaarNo = encodedAN;
                        }
                        writeData('refNo-fID-aID', i).then(function() {
                            counter++;
                            if (counter == faData.length) {
                                callback();
                            }
                        }, function error(response) {
                            console.log(response.status);
                        }).catch(function err(error) {
                            console.log('An error occurred...', error);
                        });
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
    };

    $scope.updateCropDetails = function (isValid) {
        if (isValid) {
            if ($scope.faArray.length > 0) {
                var message = confirm('Do you really want to save the form?');
                if (message) {
                    if ('indexedDB' in  window) {
                        readItemFromData('crop-category', $scope.ddlCaCo).then(function success(response) {
                            if (response != null && response != undefined && response != '') {
                                $scope.CrCaN = response.CategoryName;
                                readItemFromData('crop', $scope.ddlCC).then(function success(response1) {
                                    if (response1 != null && response1 != undefined && response1 != '') {
                                        $scope.CrN = response1.CropName;
                                        readItemFromData('crop-stage', $scope.ddlCSC).then(function success(response2) {
                                            if (response2 != null && response2 != undefined && response2 != '') {
                                                $scope.CrStN = response2.CropStageName;
                                                readItemFromData('crop-details', $scope.refNoDetails.ReferenceNo).then(function success(response3) {
                                                    if (response3 != null && response3 != undefined && response3 != '') {
                                                        delete response3.CategoryCode; delete response3.CategoryName; delete response3.CropCode; delete response3.CropName; delete response3.CropStageCode; delete response3.CropStageName; delete response3.ReferenceNo;
                                                        $scope.staticCrDtls = response3;
                                                        var cropData = {
                                                            ReferenceNo: $scope.refNoDetails.ReferenceNo,
                                                            MobileNo: $scope.txtMobileNo,
                                                            CategoryCode: $scope.ddlCaCo,
                                                            CategoryName: $scope.CrCaN,
                                                            CropCode: $scope.ddlCC,
                                                            CropName: $scope.CrN,
                                                            CropStageCode: $scope.ddlCSC,
                                                            CropStageName: $scope.CrStN,
                                                            GPCode: $scope.staticCrDtls.GPCode,
                                                            GPName: $scope.staticCrDtls.GPName,
                                                            PDSDistrictName: $scope.staticCrDtls.PDSDistrictName,
                                                            Season: $scope.staticCrDtls.Season,
                                                            VAWCode: $scope.staticCrDtls.VAWCode,
                                                            VillageCode: $scope.staticCrDtls.VillageCode,
                                                            VillageName: $scope.staticCrDtls.VillageName
                                                        };
                                                        var faData = [];
                                                        angular.forEach($scope.faArray, function (i) {
                                                            var k = {};
                                                            k.ReferenceNo = $scope.refNoDetails.ReferenceNo;
                                                            k.FarmerID = i.FarmerID;
                                                            k.AadhaarNo = i.AadhaarNo;
                                                            faData.push(k);
                                                        });
                                                        var refNoStatus = {
                                                            ReferenceNo: $scope.refNoDetails.ReferenceNo,
                                                            Status: 0
                                                        };
                                                        writeData('crop-details', cropData).then(function() {
                                                            writeData('referenceNo-status', refNoStatus).then(function() {
                                                                modifyFAData(faData, function() {
                                                                    alert('The crop information is updated with the Reference No. ' + cropData.ReferenceNo + '.');
                                                                    aaoService.setReferenceNo(cropData.ReferenceNo);
                                                                    aaoService.setCropCategoryCode(cropData.CategoryCode);
                                                                    aaoService.setCropCode(cropData.CropCode);
                                                                    $state.go('dashboard.photo');
                                                                }, function error(response) {
                                                                    console.log(response.status);
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
            }
            else {
                alert('Please click on the "+ - signed" button to add Farmer ID and / or Aadhaar No.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.getCropPhotoDetailsData = function() {
        document.getElementById('top').scrollIntoView();
        $scope.referenceNo = aaoService.getReferenceNo();
        $scope.cropCategoryCode = aaoService.getCropCategoryCode();
        $scope.cropCode = aaoService.getCropCode();
        if ('indexedDB' in window) {
            readItemFromData('photo-location-details', $scope.referenceNo).then(function success(response) {
                if (response != null && response != undefined && response != '') {
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

    var getImage = function(a, b, c) {
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

    $scope.backToCropDetails = function() {
        aaoService.setReferenceNo($scope.referenceNo);
        aaoService.setCropCategoryCode($scope.cropCategoryCode);
        aaoService.setCropCode($scope.cropCode);
        $state.go('dashboard.cropDetails');
    };

    $scope.proceedToPestDetails = function() {
        aaoService.setReferenceNo($scope.referenceNo);
        aaoService.setCropCategoryCode($scope.cropCategoryCode);
        aaoService.setCropCode($scope.cropCode);
        $state.go('dashboard.pestDetails');
    };

    $scope.backToPhoto = function() {
        aaoService.setReferenceNo($scope.referenceNo);
        aaoService.setCropCategoryCode($scope.cropCategoryCode);
        aaoService.setCropCode($scope.cropCode);
        $state.go('dashboard.photo');
    };

    $scope.lblPestDetails = true;
    $scope.txtPestDetails = false;
    $scope.modifyPestDetails = function () {
        angular.element(document.querySelector('#lblPD')).addClass('ng-hide');
        angular.element(document.querySelector('#txtPD')).removeClass('ng-hide');
    };

    $scope.cancelPestDetails = function () {
        angular.element(document.querySelector('#lblPD')).removeClass('ng-hide');
        angular.element(document.querySelector('#txtPD')).addClass('ng-hide');
    };
    
    $scope.getCropPestDetails = function () {
        $scope.referenceNo = aaoService.getReferenceNo();
        $scope.cropCategoryCode = aaoService.getCropCategoryCode();
        $scope.cropCode = aaoService.getCropCode();
        if ('indexedDB' in window) {
            readItemFromData('pest-details', $scope.referenceNo).then(function success(response) {
                if (response != null && response != undefined && response != '') {
                    $scope.pestDetails = response;
                    $scope.rbPestIdentified = $scope.pestDetails.InfectionIdentified;
                    $scope.ddlPest = $scope.pestDetails.PestDiseaseCode;
                    $scope.txtAreaOfLand = $scope.pestDetails.AreaOfLand;
                    $scope.txtLowAreaAffected = $scope.pestDetails.LowIntensityAttackArea;
                    $scope.txtMediumAreaAffected = $scope.pestDetails.MediumIntensityAttackArea;
                    $scope.txtHighAreaAffected = $scope.pestDetails.HighIntensityAttackArea;
                    $scope.txtLowAreaTreated = $scope.pestDetails.LowIntensityTreatedArea;
                    $scope.txtMediumAreaTreated = $scope.pestDetails.MediumIntensityTreatedArea;
                    $scope.txtHighAreaTreated = $scope.pestDetails.HighIntensityTreatedArea;
                    $scope.ddlMPP = $scope.pestDetails.ModerateIntensityPestPopulation;
                    $scope.ddlHPP = $scope.pestDetails.HighIntensityPestPopulation;
                    $scope.ddlMAdvisory = $scope.pestDetails.AdvisoryModerate;
                    $scope.ddlHAdvisory = $scope.pestDetails.AdvisoryHigh;
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

    $scope.getPestDiseases = function() {
        if ('indexedDB' in window) {
            readAllData('pest-disease').then(function success(response) {
                if (response.length > 0) {
                    var cropType = ($scope.cropCode == 202) ? 'MS' : ($scope.cropCode == 201) ? 'GN' : ($scope.cropCode == 206) ? 'SN' : null;
                    if (cropType != null) {
                        $scope.pestDiseases = ($filter('filter')(response, { CropCode: $scope.cropCode, CropType: cropType }, true));
                        var found = $scope.pestDiseases.some(function(o) {
                            return o["PestDiseaseCode"] === $scope.ddlPest;
                        });
                        if (!found) {
                            $scope.ddlPest = null;
                        }
                    }
                    else {
                        $scope.pestDiseases = ($filter('filter')(response, { CropCode: $scope.cropCode }, true));
                        var found = $scope.pestDiseases.some(function(o) {
                            return o["PestDiseaseCode"] === $scope.ddlPest;
                        });
                        if (!found) {
                            $scope.ddlPest = null;
                        }
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

    $scope.getPestPopulation = function(pestCode) {
        if ('indexedDB' in window) {
            readAllData('pest-disease-intensity').then(function success(response) {
                if (response.length > 0) {
                    $scope.pestPopulation = ($filter('filter')(response, { PestDiseaseCode: pestCode }, true));
                    if ($scope.pestPopulation.length > 0) {
                        var mppArray = [];
                        var hppArray = [];
                        angular.forEach($scope.pestPopulation, function(i) {
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

    $scope.getPesticides = function(pestCode) {
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
                        if ($scope.referenceNo != null && $scope.referenceNo != undefined && $scope.referenceNo != '' && $scope.cropCategoryCode != null && $scope.cropCategoryCode != undefined && $scope.cropCategoryCode != '' && $scope.cropCode != null && $scope.cropCode != undefined && $scope.cropCode != '') {
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
                                                var pestData = {
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
                                                    AdvisoryHigh: $scope.ddlHAdvisory
                                                };
                                                var refNoStatus = {
                                                    ReferenceNo: $scope.referenceNo,
                                                    Status: 0
                                                };
                                                writeData('pest-details', pestData).then(function() {
                                                    writeData('referenceNo-status', refNoStatus).then(function() {
                                                        alert('The pest information is updated with the Reference No. ' + $scope.referenceNo + '.');
                                                        angular.element(document.querySelector('#lblPD')).removeClass('ng-hide');
                                                        angular.element(document.querySelector('#txtPD')).addClass('ng-hide');
                                                        $scope.getCropPestDetails();
                                                        $scope.getPestDiseases();
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

    $scope.submit = function () {
        var message = confirm('Do you really want to submit the record?');
        if (message) {
            var refNoStatus = {
                ReferenceNo: $scope.referenceNo,
                Status: 1
            };
            if ('indexedDB' in window) {
                writeData('referenceNo-status', refNoStatus).then(function() {
                    alert('The pest information is submitted with the Reference No. ' + $scope.referenceNo + '.');
                    location.href = 'http://localhost:3000/aaoApp#!/home';
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
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