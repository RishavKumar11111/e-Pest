app.controller('myJDAPPCDAODetailsEntryCtrl', function ($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getData = function (i) {
        $scope.dn = i.DistrictName;
        $scope.cuid = i.CDAOUserID;
        $scope.cdaoName = i.CDAOName;
        $scope.cdaoMobileNo = i.CDAOMobileNo;
        $scope.cdaoANo = i.CDAOAadhaarNo;
        $scope.status = i.Status;
    };

    $scope.getAllCDAODetails = function () {
        $http.get('http://localhost:3000/jdapp/getAllCDAODetails').then(function success(response) {
            $scope.cdaoDetails = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitCDAODetails = function (userID, cdaoName, cdaoMobileNo, cdaoAadhaarNo, status) {
        if (userID != null && userID != undefined && cdaoName != null && cdaoName != undefined && cdaoMobileNo != null && cdaoMobileNo != undefined) {
            var ca = (cdaoAadhaarNo == null || cdaoAadhaarNo == undefined || cdaoAadhaarNo == '') ? 'NA' : cdaoAadhaarNo;
            var st = (status == true) ? 1 : status;
            var myData = { CDAOUserID: userID, CDAOName: cdaoName, CDAOMobileNo: cdaoMobileNo, CDAOAadhaarNo: ca, Status: st };
            $http.post('http://localhost:3000/jdapp/submitCDAODetails', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                var result = response.data;
                if (result == 'OK') {
                    alert('Data submitted sucessfully.');
                    $scope.getAllCDAODetails();
                    document.getElementById('modifyModal').style.display = "none";
                    document.getElementById('closeModifyModal').click();
                }
                else {
                    console.log(response.status);
                }
            }).catch(function error(err) {
                console.log('An error occurred...', err);
            });
        }
        else {
            alert('Please fill all fields.');
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
