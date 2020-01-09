app.controller('myAAOPDECtrl', function($scope, $http, $window) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    $scope.checkDay = function() {
        var dt = new Date();
        var d = dt.getDay();
        var HH = dt.getHours();
        if (!((d == 4 && HH >= 12) || (d == 5 && HH <= 12))) {
            alert('You are only allowed to enter details on Thursday or Friday.');
            $scope.shpd = 'No';
        }
        else {
            $scope.shpd = 'Yes';
        }
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

    $scope.getFinancialYear = function () {
        $scope.fiscalYear = "";
        var today = new Date();
        if ((today.getMonth() + 1) <= 3) {
            $scope.fiscalYear = (today.getFullYear() - 1) + "-" + today.getFullYear().toString().substr(2, 3);
        }
        else {
            $scope.fiscalYear = today.getFullYear() + "-" + (today.getFullYear() + 1).toString().substr(2, 3);
        }
        return $scope.fiscalYear;
    };

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/aao/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function (ccc) {
        if (ccc != undefined) {
            $http.get('http://localhost:3000/ado/getCropsByCategory?cropCategoryCode=' + ccc).then(function success(response) {
                $scope.crops = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getAllPestDiseases = function (cc) {
        if (cc != undefined) {
            $http.get('http://localhost:3000/aao/getAllPestDiseases?cropCode=' + cc).then(function success(response) {
                $scope.pestDiseases = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getLTCGPs = function () {
        $http.get('http://localhost:3000/aao/getLTCGPs').then(function success(response) {
            $scope.ltcGPs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitAAOPDE = function(isValid) {
        if (isValid) {
            var message = confirm('Do you really want to submit the form?');
            if (message) {
                var myData = [];
                angular.forEach($scope.ltcGPs, function(i) {
                    var k = {
                        CropCategoryCode: $scope.ddlCropCategory,
                        CropCode: $scope.ddlCrop,
                        PestDiseaseCode: $scope.ddlPestDisease,
                        GPCode: i.GPCode,
                        LowAffectedArea: i.txtLAA == null ? '0' : i.txtLAA == undefined ? '0' : i.txtLAA == '' ? '0' : i.txtLAA,
                        MediumAffectedArea: i.txtMAA == null ? '0' : i.txtMAA == undefined ? '0' : i.txtMAA == '' ? '0' : i.txtMAA,
                        HighAffectedArea: i.txtHAA == null ? '0' : i.txtHAA == undefined ? '0' : i.txtHAA == '' ? '0' : i.txtHAA,
                        LowTreatedArea: i.txtLTA == null ? '0' : i.txtLTA == undefined ? '0' : i.txtLTA == '' ? '0' : i.txtLTA,
                        MediumTreatedArea: i.txtMTA == null ? '0' : i.txtMTA == undefined ? '0' : i.txtMTA == '' ? '0' : i.txtMTA,
                        HighTreatedArea: i.txtHTA == null ? '0' : i.txtHTA == undefined ? '0' : i.txtHTA == '' ? '0' : i.txtHTA
                    }
                    myData.push(k);
                });
                $http.post('http://localhost:3000/aao/submitAAOPDE', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('The Pest details are successfully submitted.');
                        $window.location.reload();
                    }
                    else {
                        alert(result);
                        console.log(response.status);
                    }
                }).catch(function error(err) {
                    console.log('An error occurred...', err);
                });
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        if (day != 4 && day != 5) {
            alert('Pest details entry are only done on Thursday and Friday.');
            $scope.dateOfPDE = null;
        }
    };

    $scope.pestDetails = [];
    $scope.getPestDetails = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCC != null && $scope.ddlCC != undefined && $scope.ddlC != null && $scope.ddlC != undefined) {
            var pdcd = 0;
            $scope.ddlPD == undefined || $scope.ddlPD == null ? pdcd = 0 : pdcd = $scope.ddlPD;
            $http.get('http://localhost:3000/aao/getPestDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY + '&cropCategoryCode=' + $scope.ddlCC + '&cropCode=' + $scope.ddlC + '&pestDiseaseCode=' + pdcd).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.pestDetails = response.data;
                    if (response.data[0].hasOwnProperty('GPCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = true;
                        $scope.sgpd = false;
                    }
                    else if (response.data[0].hasOwnProperty('GPCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = true;
                    }
                    $scope.laa = 0.0; $scope.maa = 0.0; $scope.haa = 0.0; $scope.lta = 0.0; $scope.mta = 0.0; $scope.hta = 0.0; $scope.taa = 0.0; $scope.tta = 0.0;
                    angular.forEach($scope.pestDetails, function(i) {
                        $scope.laa += i.LowAffectedArea;
                        $scope.maa += i.MediumAffectedArea;
                        $scope.haa += i.HighAffectedArea;
                        $scope.taa += i.LowAffectedArea + i.MediumAffectedArea + i.HighAffectedArea;
                        $scope.lta += i.LowTreatedArea;
                        $scope.mta += i.MediumTreatedArea;
                        $scope.hta += i.HighTreatedArea;
                        $scope.tta += i.LowTreatedArea + i.MediumTreatedArea + i.HighTreatedArea;
                    });
                }
                else {
                    alert('Pest details were not entered.')
                    $scope.pestDetails = [];
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please select all the fields.');
        }
    };
    $scope.print = function (tableID, title) {
        var contents = document.getElementById(tableID.target.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr></table></center>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };

    $scope.printNext = function (tableID, title) {
        var contents = document.getElementById(tableID.target.nextElementSibling.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr></table></center>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
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