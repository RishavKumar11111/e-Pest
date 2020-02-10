app.controller('myCDAOLTCRCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getLTCCrops = function () {
        $http.get('http://localhost:3000/cdao/getLTCCrops').then(function success(response) {
            var k = ($filter('filter')(response.data, { CategoryCode: 3 }, true));
            var l = { CC: k[0].CategoryCode, CN: k[0].CategoryName };
            var m = response.data.filter(function (i) { return !k.includes(i); });
            $scope.crops = m.map(function (i) { return { CC: i.CropCode, CN: i.CropName }; });
            $scope.crops.push(l);
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getLTCPestDiseases = function () {
        if ($scope.ddlC != undefined) {
            $http.get('http://localhost:3000/cdao/getLTCPestDiseases?cropCode=' + $scope.ddlC).then(function success(response) {
                $scope.pestDiseases = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getBlocksByCDAO = function () {
        $http.get('http://localhost:3000/cdao/getBlocksByCDAO').then(function success(response) {
            $scope.blocks = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.ltcDetails = [];
    $scope.getLTCDetails = function () {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlC != null && $scope.ddlC != undefined) {
            var blkcd = 0; var pdcd = 0;
            $scope.ddlBlock == undefined || $scope.ddlBlock == null ? blkcd = 0 : blkcd = $scope.ddlBlock;
            $scope.ddlPD == undefined || $scope.ddlPD == null ? pdcd = 0 : pdcd = $scope.ddlPD;
            $http.get('http://localhost:3000/cdao/getLTCDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY + '&blockCode=' + blkcd + '&cropCode=' + $scope.ddlC + '&pestDiseaseCode=' + pdcd).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.ltcDetails = response.data;
                    if (!(response.data[0].hasOwnProperty('BlockCode')) && response.data[0].hasOwnProperty('GPCode') && !(response.data[0].hasOwnProperty('PestDiseaseCode')) && response.data[0].hasOwnProperty('PestTrappedNo')) {
                        $scope.sgd = true;
                        $scope.sgpd = false;
                        $scope.scd = false;
                        $scope.sdd = false;
                    }
                    else if (!(response.data[0].hasOwnProperty('BlockCode')) && response.data[0].hasOwnProperty('GPCode') && response.data[0].hasOwnProperty('PestDiseaseCode') && response.data[0].hasOwnProperty('PestTrappedNo')) {
                        $scope.sgd = false;
                        $scope.sgpd = true;
                        $scope.scd = false;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('BlockCode') && !(response.data[0].hasOwnProperty('GPCode')) && !(response.data[0].hasOwnProperty('PestDiseaseCode')) && response.data[0].hasOwnProperty('PestTrappedNo')) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.scd = true;
                        $scope.sdd = false;
                    }
                    else if (response.data[0].hasOwnProperty('BlockCode') && !(response.data[0].hasOwnProperty('GPCode')) && response.data[0].hasOwnProperty('PestDiseaseCode') && response.data[0].hasOwnProperty('PestTrappedNo')) {
                        $scope.sgd = false;
                        $scope.sgpd = false;
                        $scope.scd = false;
                        $scope.sdd = true;
                    }
                    $scope.ptn = 0.0;
                    angular.forEach($scope.ltcDetails, function (i) {
                        $scope.ptn += i.PestTrappedNo;
                    });
                }
                else {
                    alert('Light Trap Catch data were not entered.');
                    $scope.ltcDetails = [];
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
        var crops = ($filter('filter')($scope.crops, { CC: $scope.ddlC }, true));
        var contents = document.getElementById(tableID.target.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"><script src="../../gentelella/vendors/jquery/dist/jquery.min.js"></script><script src="../../public/javascripts/angular.min.js"></script></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr><tr><td><h4>Date:</h4></td><td><h4>' + document.getElementById('pdeDate').value + '</h4></td></tr><tr><td><h4>Crop:</h4></td><td><h4>' + crops[0].CN + '</h4></td></tr></table></center>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };

    $scope.printNext = function (tableID, title) {
        var crops = ($filter('filter')($scope.crops, { CC: $scope.ddlC }, true));
        var contents = document.getElementById(tableID.target.nextElementSibling.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr><tr><td><h4>Date:</h4></td><td><h4>' + document.getElementById('pdeDate').value + '</h4></td></tr><tr><td><h4>Crop:</h4></td><td><h4>' + crops[0].CN + '</h4></td></tr></table></center>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };

});