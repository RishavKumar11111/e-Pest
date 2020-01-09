app.controller('myVAWDECtrl', function($scope, $http) {
    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '300px',
        keyboardControls: true,
        enableSearch: true,
        styleActive: true
    };

    $scope.customTexts = {buttonDefaultText: 'Select New GP(s)'};

    $scope.RestGPs = [];
    $scope.getGPs = function() {
        $http.get('http://localhost:3000/aao/getGPs').then(function success(response) {
            $scope.gps = response.data;
            $http.get('http://localhost:3000/aao/getUnallocatedGPs').then(function success(response1) {
                $scope.unallocatedGPs = response1.data;
                $scope.filteredGPs = response.data.filter(item => response1.data.every(item2 => item2.GPCode != item.GPCode));
                $scope.RestGPs = [];
                angular.forEach($scope.filteredGPs, function (value, index) {
                    $scope.RestGPs.push({ id: value.GPCode, label: value.GPName });
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
    };

    $scope.RestGPsSelected = [];
    $scope.selectedRestGPs = [];
    $scope.submitRestGPsData = function () {
        $scope.selectedRestGPs = [];
        if ($scope.RestGPsSelected.length > 0) {
            angular.forEach($scope.RestGPsSelected, function (value, index) {
                $scope.selectedRestGPs.push({ GPCode: value.id, GPName: value.label });
            });
            angular.forEach($scope.selectedRestGPs, function (i) {
                $scope.populateRGPs.push(i);
            });
        }
        else {
            alert('Please select atleast one GP.');
        }
    };
    
    $scope.populateGPs = [];
    $scope.getValue = function () {
        $scope.populateGPs = [];
        angular.forEach($scope.gps, function (i) {
            if (i.selected) {
                $scope.populateGPs.push(i);
            }
        });
    };

    $scope.removeData = function (index, gpCode) {
        $scope.populateGPs.splice(index, 1);
        angular.forEach($scope.gps, function (i) {
            if (i.selected && i.GPCode == gpCode) {
                i.selected = false;
            }
        });
    };

    $scope.registerVAW = function(isValid) {
        if (isValid) {
            if ($scope.populateGPs.length > 0) {
                var encodedVAN = null;
                if ($scope.txtVAWAadhaarNo != undefined && $scope.txtVAWAadhaarNo != null && $scope.txtVAWAadhaarNo != '') {
                    encodedVAN = btoa($scope.txtVAWAadhaarNo);
                }
                var myData = [];
                angular.forEach($scope.populateGPs, function(i) {
                    var k = {};
                    k.GPCode = i.GPCode;
                    k.GPName = i.GPName;
                    k.VAWName = $scope.txtVAWName;
                    k.VAWMobileNo = $scope.txtVAWMobileNo;
                    k.VAWAadhaarNo = encodedVAN;
                    myData.push(k);
                });
                $http.post('http://localhost:3000/aao/registerVAWs', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('VAW(s) are assigned to their respective GP(s).');
                        clearData();
                    }
                    else if (result == 'This Mobile No. is already registered against another VAW Code.') {
                        alert(result);
                        clearData();
                    }
                    else {
                        console.log(response.status);
                        clearData();
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
            else {
                alert('Please select atleast one GP.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    var clearData = function() {
        $scope.getGPs();
        $scope.getRegisteredVAWs();
        $scope.getAllRegisteredVAWs();
        $scope.populateRGPs = [];
        $scope.registeredVAWDetails = [];
        $scope.allRegisteredVAWs = [];
        $scope.populateGPs = [];
        $scope.RestGPsSelected = [];
        $scope.selectedRestGPs = [];
        myData = [];
        $scope.txtVAWName = null;
        $scope.txtVAWMobileNo = null;
        $scope.txtVAWAadhaarNo = null;
    };

    $scope.getRegisteredVAWs = function() {
        $http.get('http://localhost:3000/aao/getRegisteredVAWs').then(function success(response) {
            $scope.registeredVAWs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.removeVAW = function(vawCode, gpCode, gpName) {
        if (confirm('Do you want to remove ' + vawCode + ' from the assigned GP - ' + gpName + '?')) {
            var myData = { VAWCode: vawCode, GPCode: gpCode };
            $http.post('http://localhost:3000/aao/removeVAW', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                var result = response.statusText;
                if (result == 'OK') {
                    alert('The VAW was successfully removed from the assigned GP.');
                    clearData();
                }
                else {
                    console.log(response.status);
                    clearData();
                }
            }).catch(function error(err) {
                console.log('An error occurred...', err);
            });
        }
    };

    $scope.getAllRegisteredVAWs = function() {
        $http.get('http://localhost:3000/aao/getAllRegisteredVAWs').then(function success(response) {
            $scope.allRegisteredVAWs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getRegisteredVAWDetails = function(vawCode) {
        $http.get('http://localhost:3000/aao/getRegisteredVAWDetails?vawCode=' + vawCode).then(function success(response) {
            $scope.registeredVAWDetails = response.data;
            $scope.txtMVAWName = null; $scope.txtMVAWMobileNo = null; $scope.txtMVAWAadhaarNo = null;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.populateRGPs = [];
    $scope.getGPValue = function () {
        $scope.populateRGPs = [];
        angular.forEach($scope.unallocatedGPs, function (i) {
            if (i.gpSelected) {
                $scope.populateRGPs.push(i);
            }
        });
    };

    $scope.lblVAWDetails = true;
    $scope.txtVAWDetails = false;
    $scope.modifyVAWDetails = function() {
        $scope.txtVAWDetails = true;
        $scope.lblVAWDetails = false;
    };

    $scope.cancelVAWDetails = function() {
        $scope.lblVAWDetails = true; $scope.txtVAWDetails = false; $scope.txtMVAWName = null; $scope.txtMVAWMobileNo = null; $scope.txtMVAWAadhaarNo = null;
    };
    
    $scope.updateVAWDetails = function() {
        if ($scope.txtMVAWName != null && $scope.txtMVAWName != undefined && $scope.txtMVAWName != '' && $scope.txtMVAWMobileNo != null && $scope.txtMVAWMobileNo != undefined && $scope.txtMVAWMobileNo != '') {
            $scope.registeredVAWDetails[0].VAWName = $scope.txtMVAWName;
            $scope.registeredVAWDetails[0].VAWMobileNo = $scope.txtMVAWMobileNo;
            $scope.lblVAWDetails = true; $scope.txtVAWDetails = false;
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.assignVAW = function(isValid) {
        if (isValid) {
            if ($scope.populateRGPs.length > 0) {
                var myData = [];
                var obj = {};
                if ($scope.txtMVAWAadhaarNo == undefined || $scope.txtMVAWAadhaarNo == '') {
                    $scope.txtMVAWAadhaarNo = null;
                }
                if ($scope.txtMVAWName != null && $scope.txtMVAWName != undefined && $scope.txtMVAWName != '' && $scope.txtMVAWMobileNo != null && $scope.txtMVAWMobileNo != undefined && $scope.txtMVAWMobileNo != '') {
                    var encodedMVAN = null;
                    if ($scope.txtMVAWAadhaarNo != undefined && $scope.txtMVAWAadhaarNo != null && $scope.txtMVAWAadhaarNo != '') {
                        encodedMVAN = btoa($scope.txtMVAWAadhaarNo);
                    }
                    obj.VAWName = $scope.txtMVAWName;
                    obj.VAWMobileNo = $scope.txtMVAWMobileNo;
                    obj.VAWAadhaarNo = encodedMVAN;
                }
                angular.forEach($scope.populateRGPs, function(i) {
                    var k = {};
                    k.VAWCode = $scope.ddlVAWCode.VAWCode;
                    k.GPCode = i.GPCode;
                    k.GPName = i.GPName;
                    myData.push(k);
                });
                $http.post('http://localhost:3000/aao/assignVAWs', { data: {vawDetails: obj, gpDetails: myData} }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('VAW(s) are assigned to their respective GP(s).');
                        clearData();
                    }
                    else if (result == 'This Mobile No. is already registered against another VAW Code.') {
                        alert(result);
                        clearData();
                    }
                    else {
                        console.log(response.status);
                        clearData();
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
            else {
                alert('Please select atleast one GP.');
                clearData();
            }
        }
        else {
            alert('Please fill all the fields.');
            clearData();
        }
    };

});

app.directive('nameOnly', function () {
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
                var clean = val.replace(/[^a-zA-Z\s]/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
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