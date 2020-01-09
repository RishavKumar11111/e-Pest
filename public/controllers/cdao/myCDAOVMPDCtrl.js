app.controller('myCDAOVMPDCtrl', function($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        if (day != 4 && day != 5) {
            alert('Pest details entry are only done on Thursday and Friday.');
            $scope.dateOfPDE = null;
        }
    };

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/cdao/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        if ($scope.ddlCC != undefined) {
            $http.get('http://localhost:3000/cdao/getCropsByCategory?cropCategoryCode=' + $scope.ddlCC).then(function success(response) {
                $scope.crops = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getAllPestDiseases = function () {
        if ($scope.ddlC != undefined) {
            $http.get('http://localhost:3000/cdao/getAllPestDiseases?cropCode=' + $scope.ddlC).then(function success(response) {
                $scope.pestDiseases = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getBlocks = function () {
        $http.get('http://localhost:3000/cdao/getBlocksByDistrict').then(function success(response) {
            $scope.blocks = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.pestDetails = [];
    $scope.getPestDetails = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCC != null && $scope.ddlCC != undefined && $scope.ddlC != null && $scope.ddlC != undefined) {
            var blkcd = 0;
            var pdcd = 0;
            $scope.ddlBlock == undefined || $scope.ddlBlock == null ? blkcd = 0 : blkcd = $scope.ddlBlock;
            $scope.ddlPD == undefined || $scope.ddlPD == null ? pdcd = 0 : pdcd = $scope.ddlPD;
            $http.get('http://localhost:3000/cdao/getPestDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY + '&blockCode=' + blkcd + '&cropCategoryCode=' + $scope.ddlCC + '&cropCode=' + $scope.ddlC + '&pestDiseaseCode=' + pdcd).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.pestDetails = response.data;
                    if (response.data[0].hasOwnProperty('GPCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = true;
                        $scope.sgpd = false;
                        $scope.sbd = false;
                        $scope.sbpd = false;
                        var dt = new Date();
                        var d = dt.getDay();
                        var HH = dt.getHours();
                        if (d == 5 && HH >= 12 && HH <= 16) {
                            $scope.slht = true;
                            $scope.sthl = false;
                        }
                        else {
                            alert('You are only allowed to modify details on Friday between 12 pm to 4 pm.');
                            $scope.slht = true;
                            $scope.sthl = false;
                            document.getElementById('modifyButton').style.display = 'none';
                        }
                    }
                    else if (response.data[0].hasOwnProperty('GPCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = true;
                        $scope.sbd = false;
                        $scope.sbpd = false;
                        $scope.slht = false;
                        $scope.sthl = false;
                    }
                    else if (response.data[0].hasOwnProperty('BlockCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.sbd = true;
                        $scope.sbpd = false;
                        $scope.slht = false;
                        $scope.sthl = false;
                    }
                    else if (response.data[0].hasOwnProperty('BlockCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.sbd = false;
                        $scope.sbpd = true;
                        $scope.slht = false;
                        $scope.sthl = false;
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

    $scope.showTextHideLabel = function() {
        $scope.sthl = true;
        $scope.slht = false;
    };

    $scope.showLabelHideText = function() {
        $scope.slht = true;
        $scope.sthl = false;
        $scope.getPestDetails();
    };

    $scope.updatePDE = function(isValid) {
        if (isValid) {
            if ($scope.ddlBlock != null && $scope.ddlBlock != undefined) {
                var message = confirm('Do you really want to update the pest details?');
                if (message) {
                    var myObj = {
                        DateTime: document.getElementById('pdeDate').value,
                        Season: $scope.rbs,
                        FinancialYear: $scope.ddlFY,
                        BlockCode: $scope.ddlBlock,
                        CropCategoryCode: $scope.ddlCC,
                        CropCode: $scope.ddlC,
                        PestDiseaseCode: $scope.ddlPD,
                    };
                    var myArray = [];
                    angular.forEach($scope.pestDetails, function(i) {
                        var k = {
                            GPCode: i.GPCode,
                            LowAffectedArea: i.LowAffectedArea == null ? '0' : i.LowAffectedArea == undefined ? '0' : i.LowAffectedArea == '' ? '0' : i.LowAffectedArea,
                            MediumAffectedArea: i.MediumAffectedArea == null ? '0' : i.MediumAffectedArea == undefined ? '0' : i.MediumAffectedArea == '' ? '0' : i.MediumAffectedArea,
                            HighAffectedArea: i.HighAffectedArea == null ? '0' : i.HighAffectedArea == undefined ? '0' : i.HighAffectedArea == '' ? '0' : i.HighAffectedArea,
                            LowTreatedArea: i.LowTreatedArea == null ? '0' : i.LowTreatedArea == undefined ? '0' : i.LowTreatedArea == '' ? '0' : i.LowTreatedArea,
                            MediumTreatedArea: i.MediumTreatedArea == null ? '0' : i.MediumTreatedArea == undefined ? '0' : i.MediumTreatedArea == '' ? '0' : i.MediumTreatedArea,
                            HighTreatedArea: i.HighTreatedArea == null ? '0' : i.HighTreatedArea == undefined ? '0' : i.HighTreatedArea == '' ? '0' : i.HighTreatedArea
                        }
                        myArray.push(k);
                    });
                    $http.post('http://localhost:3000/cdao/updatePDE', { data: {obj: myObj, arr: myArray } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                        var result = response.statusText;
                        if (result == 'OK') {
                            alert('The Pest details are successfully updated.');
                            $scope.getPestDetails();
                            $scope.slht = true;
                            $scope.sthl = false;
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
                alert('Please select the block.');
            }
        }
        else {
            alert('Please fill all the fields.');
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