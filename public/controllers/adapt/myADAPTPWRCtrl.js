app.controller('myADAPTPWRCtrl', function($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        if (day == 6) {
            alert('Pest details entry are not enter in saturday.');
            $scope.dateOfPDE = null;
        }
    };

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/adapt/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        if ($scope.ddlCC != undefined) {
            $http.get('http://localhost:3000/adapt/getCropsByCategory?cropCategoryCode=' + $scope.ddlCC).then(function success(response) {
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
            $http.get('http://localhost:3000/adapt/getPestDiseases?cropCode=' + $scope.ddlC).then(function success(response) {
                $scope.pestDiseases = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getDistricts = function () {
        $http.get('http://localhost:3000/adapt/getDistricts').then(function success(response) {
            $scope.districts = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getBlocksByDistrict = function () {
        if ($scope.ddlDistrict != null && $scope.ddlDistrict != undefined) {
            $http.get('http://localhost:3000/adapt/getBlocksByDistrict?districtCode=' + $scope.ddlDistrict).then(function success(response) {
                $scope.blocks = response.data;
                $scope.ddlBlock = null;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            $scope.blocks = [];
            $scope.ddlBlock = null;
        }
    };

    $scope.getGP = function () {
        if ($scope.ddlBlock != null && $scope.ddlBlock != undefined) {
            $http.get('http://localhost:3000/adapt/getGP?blockCode=' + $scope.ddlBlock).then(function success(response) {
                $scope.gps = response.data;
                $scope.ddlGP = null;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            $scope.gps = [];
            $scope.ddlGP = null;
        }
    };

    $scope.pestDetails = [];
    $scope.getCropPestDetails = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCC != null && $scope.ddlCC != undefined && $scope.ddlC != null && $scope.ddlC != undefined && $scope.ddlPest != null && $scope.ddlPest != undefined) {
            var distcd = 0; var blkcd = 0; var pdcd = 0;
            $scope.ddlDistrict == undefined || $scope.ddlDistrict == null ? distcd = 0 : distcd = $scope.ddlDistrict;
            $scope.ddlBlock == undefined || $scope.ddlBlock == null ? blkcd = 0 : blkcd = $scope.ddlBlock;
            $scope.ddlPest == undefined || $scope.ddlPest == null ? pdcd = 0 : pdcd = $scope.ddlPest;
            $http.get('http://localhost:3000/adapt/getCropPestDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY + '&districtCode=' + distcd + '&blockCode=' + blkcd + '&cropCategoryCode=' + $scope.ddlCC + '&cropCode=' + $scope.ddlC + '&pestDiseaseCode=' + pdcd ).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.pestDetails = response.data;
                    if (response.data[0].hasOwnProperty('GPCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = true;
                        $scope.sgpd = false;
                        $scope.sbd = false;
                        $scope.sad = false;
                        $scope.scd = false;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('GPCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = true;
                        $scope.sbd = false;
                        $scope.sad = false;
                        $scope.scd = false;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('DistrictCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.sbd = true;
                        $scope.sad = false;
                        $scope.scd = false;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('DistrictCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.sbd = false;
                        $scope.sad = true;
                        $scope.scd = false;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('BlockCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode'))) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.sbd = false;
                        $scope.sad = false;
                        $scope.scd = true;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('BlockCode') && response.data[0].hasOwnProperty('PestDiseaseCode')) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.sbd = false;
                        $scope.sad = false;
                        $scope.scd = false;
                        $scope.sdd = true;
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