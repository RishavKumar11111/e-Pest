app.controller('myEmergencyAppHomeCtrl', function ($scope, $http, emergencyAppService) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    var resetDiv = function() {
        $scope.fd = true;
        $scope.otp = false;
        $scope.isDisabled = false;
    };
    resetDiv();

    $scope.sendOTP = function() {
        $http.get('http://localhost:3000/emergencyApp/sendOTP?mobileNo=' + $scope.txtMobileNo).then(function success(response1) {
            if (response1.data.includes('Accepted')) {
                $scope.otp = true;
                $scope.fd = false;
                $scope.isDisabled = true;
            }
            else  {
                alert('Oops! An error occurred.');
                resetDiv();
            }
        }, function error(response1) {
            console.log(response1.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.checkfarmerIDs = function (isValid) {
        if (isValid) {
            $http.get('http://apicol.nic.in/api/FarmerData?farmerID=' + $scope.txtFarmerID).then(function success(response) {
                var result = response.data;
                if (result.ErrorMessage == null) {
                    if (result.LGDVillageCode != null) {
                        if (result.VCHAADHARNO == sha256($scope.txtAadhaarNo) && result.VCHVOTERIDCARDNO == sha256($scope.txtVoterIDNo)) {
                            emergencyAppService.setFarmerID($scope.txtFarmerID);
                            emergencyAppService.setAadhaarNo(sha256($scope.txtAadhaarNo));
                            emergencyAppService.setVoterIDNo(sha256($scope.txtVoterIDNo));
                            emergencyAppService.setMobileNo($scope.txtMobileNo);
                            $scope.sendOTP();
                        }
                        else {
                            alert('Please enter correct Aadhaar No. and Voter ID No.');
                            $scope.txtAadhaarNo = null;
                            $scope.txtVoterIDNo = null;
                            resetDiv();
                        }
                    }
                    else {
                        alert('The village mapping has not been mapped for the Farmer ID. Contact the Administrator.');
                        $scope.txtFarmerID = null;
                        $scope.txtAadhaarNo = null;
                        $scope.txtVoterIDNo = null;
                        resetDiv();
                    }
                }
                else {
                    alert('Farmer ID is invalid.');
                    $scope.txtFarmerID = null;
                    $scope.txtAadhaarNo = null;
                    $scope.txtVoterIDNo = null;
                    resetDiv();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please fill all the fields.');
            resetDiv();
        }
    };

    $scope.verifyOTP = function() {
        if ($scope.txtOTP != null && $scope.txtOTP != undefined && $scope.txtOTP != '') {
            $http.get('http://localhost:3000/emergencyApp/verifyOTP?otp=' + sha256($scope.txtOTP)).then(function success(response) {
                if (response.statusText == 'OK') {
                    location.href = 'http://localhost:3000/emergencyApp#!/home/cropPhotoDetails';
                }
                else if (response.data == 'Invalid OTP.') {
                    alert(response.data);
                    $scope.txtOTP = null;
                }
                else {
                    resetDiv();
                    $scope.txtFarmerID = null;
                    $scope.txtAadhaarNo = null;
                    $scope.txtVoterIDNo = null;
                    $scope.txtMobileNo = null;
                    $scope.txtOTP = null;
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please enter OTP');
            $scope.txtOTP = null;
        }
    };

    $scope.getCropCategories = function () {
        $scope.farmerID = emergencyAppService.getFarmerID();
        if ($scope.farmerID != null && $scope.farmerID != undefined && $scope.farmerID != '') {
            $http.get('http://localhost:3000/emergencyApp/getCropCategories').then(function success(response) {
                $scope.cropCategories = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please complete the Farmer Details section.');
            location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
        }
    };

    $scope.getCrops = function () {
        $http.get('http://localhost:3000/emergencyApp/getCrops?cropCategoryCode=' + $scope.ddlCaCo).then(function success(response) {
            $scope.crops = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getDistricts = function () {
        $http.get('http://localhost:3000/emergencyApp/getDistricts').then(function success(response) {
            $scope.districts = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getBlocksByDistrict = function (dc) {
        $http.get('http://localhost:3000/emergencyApp/getBlocksByDistrict?districtCode=' + dc).then(function success(response) {
            $scope.blocks = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getGPsByBlock = function (bc) {
        $http.get('http://localhost:3000/emergencyApp/getGPsByBlock?blockCode=' + bc).then(function success(response) {
            $scope.gps = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getVillagesByGP = function (gc) {
        $http.get('http://localhost:3000/emergencyApp/getVillagesByGP?gpCode=' + gc).then(function success(response) {
            $scope.villages = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitCropPhotoDetails = function (isValid) {
        if (isValid) {
            if (document.getElementById("image1") !== null) {
                if ($scope.firstLatitude != undefined && $scope.firstLatitude != null && $scope.firstLatitude != '' && $scope.firstLongitude != undefined && $scope.firstLongitude != null && $scope.firstLongitude != '') {
                    // if ($scope.firstLatitude != $scope.secondLatitude && $scope.secondLatitude != $scope.thirdLatitude && $scope.firstLatitude != $scope.thirdLatitude && $scope.firstLongitude != $scope.secondLongitude && $scope.secondLongitude != $scope.thirdLongitude && $scope.firstLongitude != $scope.thirdLongitude) {
                        if ($scope.ddlCaCo != null && $scope.ddlCrop != null && $scope.ddlDistrict != null && $scope.ddlBlock != null && $scope.ddlGP != null && $scope.ddlVillage != null) {
                            $scope.fID = emergencyAppService.getFarmerID();
                            $scope.aadhaarNo = emergencyAppService.getAadhaarNo();
                            $scope.voterIDNo = emergencyAppService.getVoterIDNo();
                            $scope.mobileNo = emergencyAppService.getMobileNo();
                            if ($scope.fID != undefined && $scope.fID != null && $scope.aadhaarNo != undefined && $scope.aadhaarNo != null && $scope.voterIDNo != undefined && $scope.voterIDNo != null && $scope.mobileNo != undefined && $scope.mobileNo != null) {
                                var message = confirm('Do you really want to submit the form?');
                                if (message) {
                                    $http.get('http://apicol.nic.in/api/FarmerData?farmerID=' + $scope.farmerID).then(function success(response) {
                                        var result = response.data;
                                        if (result.ErrorMessage == null) {
                                            if (result.LGDVillageCode != null) {
                                                if (result.VCHAADHARNO == $scope.aadhaarNo && result.VCHVOTERIDCARDNO == $scope.voterIDNo) {
                                                    var image1Data = document.getElementById("image1").src.replace('data:image/jpeg;base64,', '');
                                                    var image2Data = null;
                                                    if (document.getElementById("image2") !== null) {
                                                        image2Data = document.getElementById("image2").src.replace('data:image/jpeg;base64,', '');
                                                    }
                                                    var image3Data = null;
                                                    if (document.getElementById("image3") !== null) {
                                                        image3Data = document.getElementById("image3").src.replace('data:image/jpeg;base64,', '');
                                                    }
                                                    var myData = {
                                                        FarmerID: $scope.farmerID,
                                                        MobileNo: $scope.mobileNo,
                                                        CropCategoryCode: $scope.ddlCaCo,
                                                        CropCode: $scope.ddlCrop,
                                                        DistrictCode: $scope.ddlDistrict,
                                                        BlockCode: $scope.ddlBlock,
                                                        GPCode: $scope.ddlGP,
                                                        VillageCode: $scope.ddlVillage,
                                                        FLP: image1Data,
                                                        RLP1: image2Data == undefined ? null : image2Data,
                                                        RLP2: image3Data == undefined ? null : image3Data,
                                                        FixedLandLatitude: $scope.firstLatitude,
                                                        FixedLandLongitude: $scope.firstLongitude,
                                                        RandomLandLatitude1: $scope.secondLatitude == undefined ? null : $scope.secondLatitude,
                                                        RandomLandLongitude1: $scope.secondLongitude == undefined ? null : $scope.secondLongitude,
                                                        RandomLandLatitude2: $scope.thirdLatitude == undefined ? null : $scope.thirdLatitude,
                                                        RandomLandLongitude2: $scope.thirdLongitude == undefined ? null : $scope.thirdLongitude,
                                                    };
                                                    $http.post('http://localhost:3000/emergencyApp/submitCropPhotoDetails', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response2) {
                                                        var result = response2.data;
                                                        if (result.includes('EMR/')) {
                                                            alert('The Emergency Pest details are submitted with the Reference No. ' + result + '.');
                                                            location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
                                                        }
                                                        else if (result.includes('a Phone or a Tablet')) {
                                                            alert(result);
                                                            location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
                                                        }
                                                        else {
                                                            alert('Oops! An error occurred.');
                                                            console.log(response.status);
                                                        }
                                                    }, function error(response) {
                                                        console.log(response.status);
                                                    }).catch(function err(error) {
                                                        console.log('An error occurred...', error);
                                                    });
                                                }
                                                else {
                                                    alert('Aadhaar No. or Voter ID No. has been altered');
                                                    location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
                                                }
                                            }
                                            else {
                                                alert('Farmer ID is altered. The village mapping has not been mapped for the Farmer ID. Contact the Administrator.');
                                                location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
                                            }
                                        }
                                        else {
                                            alert('Farmer ID is altered.');
                                            location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
                                        }    
                                    }, function error(response) {
                                        console.log(response.status);
                                    }).catch(function err(error) {
                                        console.log('An error occurred...', error);
                                    });
                                }
                            }
                            else {
                                alert('Please complete the Farmer Details section.');
                                location.href = 'http://localhost:3000/emergencyApp#!/home/farmerDetails';
                            }
                        }
                        else {
                            alert('Please select the Crop Category, Crop, District, Block, GP and Village.');
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
                alert('Please upload atleast the 1st image.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
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

app.directive('alphaNumeric', function () {
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
                var clean = val.replace(/[^a-zA-Z0-9\/]/g, '');
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

app.directive('capitalize', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    ngModelCtrl.$setViewValue(capitalized);
                    ngModelCtrl.$render();
                }
                return capitalized;
            }
            ngModelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
});