app.controller('myAAODECtrl', function ($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getBlocks = function () {
        $http.get('http://localhost:3000/cdao/getBlocks').then(function success(response) {
            $scope.blocks = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.populateBlocks = [];
    $scope.getValue = function () {
        $scope.populateBlocks = [];
        angular.forEach($scope.blocks, function (i) {
            if (i.selected) {
                $scope.populateBlocks.push(i);
            }
        });
    };

    $scope.removeData = function (index, blockCode) {
        $scope.populateBlocks.splice(index, 1);
        angular.forEach($scope.blocks, function (i) {
            if (i.selected && i.BlockCode == blockCode) {
                i.selected = false;
            }
        });
    };

    $scope.registerAAO = function (isValid) {
        if (isValid) {
            if ($scope.populateBlocks.length > 0) {
                var encodedAAN = null;
                if ($scope.txtAAOAadhaarNo != undefined && $scope.txtAAOAadhaarNo != null && $scope.txtAAOAadhaarNo != '') {
                    encodedAAN = btoa($scope.txtAAOAadhaarNo);
                }
                var myData = [];
                var myData1 = [];
                angular.forEach($scope.populateBlocks, function (i) {
                    var k = {};
                    k.AAOCode = 'AAO_' + i.BlockCode.toString();
                    k.BlockCode = i.BlockCode;
                    k.AAOName = $scope.txtAAOName;
                    k.AAOMobileNo = $scope.txtAAOMobileNo;
                    k.AAOAadhaarNo = encodedAAN;
                    myData.push(k);
                    var l = {};
                    l.UserID = 'AAO_' + i.BlockCode.toString();
                    l.RoleID = 'Role-2';
                    l.ContactNo = $scope.txtAAOMobileNo;
                    l.BlockName = i.BlockName;
                    myData1.push(l);
                });
                $http.post('http://localhost:3000/cdao/registerAAOs', { data: { arrData: myData, userData: myData1 } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('AAO(s) are assigned to their respective Block(s).');
                        clearData();
                    }
                    else if (result == 'This Mobile No. is already registered against another AAO Code.') {
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
                alert('Please select atleast one Block.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    var clearData = function () {
        $scope.getBlocks();
        $scope.getRegisteredAAOs();
        $scope.populateBlocks = [];
        myData = [];
        $scope.txtAAOName = null;
        $scope.txtAAOMobileNo = null;
        $scope.txtAAOAadhaarNo = null;
    };

    $scope.getRegisteredAAOs = function () {
        $http.get('http://localhost:3000/cdao/getRegisteredAAOs').then(function success(response) {
            $scope.registeredAAOs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.removeAAO = function (aaoCode, blockCode, blockName) {
        if (confirm('Do you want to remove ' + aaoCode + ' from the assigned Block - ' + blockName + '?')) {
            var myData = { AAOCode: aaoCode, BlockCode: blockCode };
            $http.post('http://localhost:3000/cdao/removeAAO', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                var result = response.statusText;
                if (result == 'OK') {
                    alert('The AAO was successfully removed from the assigned Block.');
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