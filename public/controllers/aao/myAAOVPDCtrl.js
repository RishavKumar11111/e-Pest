app.controller('myAAOVPDCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function () {
        if ($scope.ddlUT == 'AAO') {
            document.getElementById('pdeDate').disabled = false;
            var day = new Date(document.getElementById('pdeDate').value).getDay();
            if (day != 4 && day != 5) {
                alert('Pest details entry are only done on Thursday and Friday by AAO.');
                $scope.dateOfPDE = null;
            }
        }
        else if ($scope.ddlUT == 'VAW') {
            document.getElementById('pdeDate').disabled = false;
            var day = new Date(document.getElementById('pdeDate').value).getDay();
            // if (day != 1 && day != 2 && day != 3 && day != 4) {
            //     alert('Pest details entry are only done on Monday, Tuesday, Wednesday and Thursday by VAW.');
            //     $scope.dateOfPDE = null;
            // }
            if (day == 0) {
                alert('Pest details entry are not done on Sunday by VAW.');
                $scope.dateOfPDE = null;
            }
        }
        else {
            alert('Please select the User Type.');
            $scope.dateOfPDE = null;
        }
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

    $scope.getCropsByCategory = function () {
        if ($scope.ddlCC != undefined) {
            $http.get('http://localhost:3000/aao/getCropsByCategory?cropCategoryCode=' + $scope.ddlCC).then(function success(response) {
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
            $http.get('http://localhost:3000/aao/getAllPestDiseases?cropCode=' + $scope.ddlC).then(function success(response) {
                $scope.pestDiseases = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.pestDetails = [];
    $scope.ete = false;
    $scope.getAAOPestDetails = function () {
        if ($scope.ddlUT != null && $scope.ddlUT != undefined && $scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCC != null && $scope.ddlCC != undefined && $scope.ddlC != null && $scope.ddlC != undefined) {
            var pdcd = 0;
            $scope.ddlPD == undefined || $scope.ddlPD == null ? pdcd = 0 : pdcd = $scope.ddlPD;
            $http.get('http://localhost:3000/aao/getAAOPestDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY + '&cropCategoryCode=' + $scope.ddlCC + '&cropCode=' + $scope.ddlC + '&pestDiseaseCode=' + pdcd + '&userType=' + $scope.ddlUT).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.pestDetails = response.data;
                    if ($scope.cbHIntensity == true && ($scope.cbMIntensity == false || $scope.cbMIntensity == undefined) && ($scope.cbLIntensity == false || $scope.cbLIntensity == undefined)) {
                        $scope.L = false;
                        $scope.M = false;
                        $scope.H = true;
                        var l = document.getElementsByName('low');
                        for (var i = 0; i < l.length; i++) {
                            l[i].classList.add("totalArea");
                        }
                        var m = document.getElementsByName('medium');
                        for (var i = 0; i < m.length; i++) {
                            m[i].classList.add("totalArea");
                        }
                        $scope.ete = true;
                    }
                    else if ($scope.cbMIntensity == true && ($scope.cbHIntensity == false || $scope.cbHIntensity == undefined) && ($scope.cbLIntensity == false || $scope.cbLIntensity == undefined)) {
                        $scope.L = false;
                        $scope.M = true;
                        $scope.H = false;
                        var l = document.getElementsByName('low');
                        for (var i = 0; i < l.length; i++) {
                            l[i].classList.add("totalArea");
                        }
                        var h = document.getElementsByName('high');
                        for (var i = 0; i < h.length; i++) {
                            h[i].classList.add("totalArea");
                        }
                        $scope.ete = true;
                    }
                    else if ($scope.cbLIntensity == true && ($scope.cbHIntensity == false || $scope.cbHIntensity == undefined) && ($scope.cbMIntensity == false || $scope.cbMIntensity == undefined)) {
                        $scope.L = true;
                        $scope.M = false;
                        $scope.H = false;
                        var m = document.getElementsByName('medium');
                        for (var i = 0; i < m.length; i++) {
                            m[i].classList.add("totalArea");
                        }
                        var h = document.getElementsByName('high');
                        for (var i = 0; i < h.length; i++) {
                            h[i].classList.add("totalArea");
                        }
                        $scope.ete = true;
                    }
                    else if ($scope.cbHIntensity == true && $scope.cbMIntensity == true && ($scope.cbLIntensity == false || $scope.cbLIntensity == undefined)) {
                        $scope.L = false;
                        $scope.M = true;
                        $scope.H = true;
                        var l = document.getElementsByName('low');
                        for (var i = 0; i < l.length; i++) {
                            l[i].classList.add("totalArea");
                        }
                        $scope.ete = true;
                    }
                    else if ($scope.cbHIntensity == true && $scope.cbLIntensity == true && ($scope.cbMIntensity == false || $scope.cbMIntensity == undefined)) {
                        $scope.L = true;
                        $scope.M = false;
                        $scope.H = true;
                        var m = document.getElementsByName('medium');
                        for (var i = 0; i < m.length; i++) {
                            m[i].classList.add("totalArea");
                        }
                        $scope.ete = true;
                    }
                    else if ($scope.cbMIntensity == true && $scope.cbLIntensity == true && ($scope.cbHIntensity == false || $scope.cbHIntensity == undefined)) {
                        $scope.L = true;
                        $scope.M = true;
                        $scope.H = false;
                        var h = document.getElementsByName('high');
                        for (var i = 0; i < h.length; i++) {
                            h[i].classList.add("totalArea");
                        }
                        $scope.ete = true;
                    }
                    else {
                        $scope.L = true;
                        $scope.M = true;
                        $scope.H = true;
                        $scope.ete = false;
                    }
                    if (response.data[0].hasOwnProperty('GPCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = true;
                        $scope.sgpd = false;
                    }
                    else if (response.data[0].hasOwnProperty('GPCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = true;
                    }
                    $scope.laa = 0.0; $scope.maa = 0.0; $scope.haa = 0.0; $scope.lta = 0.0; $scope.mta = 0.0; $scope.hta = 0.0; $scope.taa = 0.0; $scope.tta = 0.0;
                    var count = 0;
                    angular.forEach($scope.pestDetails, function (i) {
                        $scope.laa += i.LowAffectedArea;
                        $scope.maa += i.MediumAffectedArea;
                        $scope.haa += i.HighAffectedArea;
                        $scope.taa += i.LowAffectedArea + i.MediumAffectedArea + i.HighAffectedArea;
                        $scope.lta += i.LowTreatedArea;
                        $scope.mta += i.MediumTreatedArea;
                        $scope.hta += i.HighTreatedArea;
                        $scope.tta += i.LowTreatedArea + i.MediumTreatedArea + i.HighTreatedArea;
                        count++;
                        if (count == $scope.pestDetails.length) {
                            if ($scope.taa == 0.0) {
                                $scope.sgd = false;
                                $scope.sgpd = false;
                                alert('Pest details were not entered.');
                            }
                        }
                    });
                }
                else {
                    alert('Pest details were not entered.');
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
        var crops = ($filter('filter')($scope.crops, { CropCode: $scope.ddlC }, true));
        var contents = document.getElementById(tableID.target.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"><script src="../../gentelella/vendors/jquery/dist/jquery.min.js"></script><script src="../../public/javascripts/angular.min.js"></script></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr><tr><td><h4>Date:</h4></td><td><h4>' + document.getElementById('pdeDate').value + '</h4></td></tr><tr><td><h4>Crop:</h4></td><td><h4>' + crops[0].CropName + '</h4></td></tr></table></center>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };

    $scope.printNext = function (tableID, title) {
        var crops = ($filter('filter')($scope.crops, { CropCode: $scope.ddlC }, true));
        var contents = document.getElementById(tableID.target.nextElementSibling.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr><tr><td><h4>Date:</h4></td><td><h4>' + document.getElementById('pdeDate').value + '</h4></td></tr><tr><td><h4>Crop:</h4></td><td><h4>' + crops[0].CropName + '</h4></td></tr></table></center>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };

});