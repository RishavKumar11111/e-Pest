var app = angular.module('myGeneralAdvisoryApp', ['angular.filter']);

app.controller('myGeneralAdvisoryCtrl', function ($scope, $http, $filter) {

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/jdapp/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        $http.get('http://localhost:3000/jdapp/getCropsByCategory?cropCategoryCode=' + $scope.ddlCropCategory).then(function success(response) {
            $scope.crops = response.data;
            $scope.ddlCrop = null;
            $scope.ddlPest = null;
            $scope.pests = [];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPests = function () {
        $http.get('http://localhost:3000/jdapp/getPestDiseases?cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.pests = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.months = [];
    $scope.getMonth = function () {
        if ($scope.cbSeason == 'K') {
            $scope.months = [{ MonthCode: '07', MonthName: 'July' }, { MonthCode: '08', MonthName: 'August' }, { MonthCode: '09', MonthName: 'September' }, { MonthCode: '10', MonthName: 'October' }, { MonthCode: '11', MonthName: 'November' }];
        }
        else if ($scope.cbSeason == 'R') {
            $scope.months = [{ MonthCode: '01', MonthName: 'January' }, { MonthCode: '02', MonthName: 'February' }, { MonthCode: '03', MonthName: 'March' }, { MonthCode: '04', MonthName: 'April' }, { MonthCode: '05', MonthName: 'May' }, { MonthCode: '06', MonthName: 'June' }, { MonthCode: '12', MonthName: 'December' }];
        }
        else {
            $scope.months = [];
        }
    };

    $scope.pestDetails = [];
    $scope.ete = false;
    $scope.getAdvisoryDetails = function () {
        if ($scope.cbSeason != null && $scope.cbSeason != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined && $scope.ddlCropCategory != null && $scope.ddlCropCategory != undefined && $scope.ddlCrop != null && $scope.ddlCrop != undefined) {
            var doe = '1900-1-1'; var mo = 0; var pdcd = 0;
            $scope.dateOfPDE == undefined || $scope.dateOfPDE == null ? doe = '1900-1-1' : doe = document.getElementById('pdeDate').value;
            $scope.ddlMonth == undefined || $scope.ddlMonth == null ? mo = 0 : mo = $scope.ddlMonth;
            $scope.ddlPest == undefined || $scope.ddlPest == null ? pdcd = 0 : pdcd = $scope.ddlPest;
            $http.get('http://localhost:3000/getAdvisoryDetails?season=' + $scope.cbSeason + '&financialYear=' + $scope.ddlFY + '&dateOfEntry=' + doe + '&month=' + mo + '&cropCategoryCode=' + $scope.ddlCropCategory + '&cropCode=' + $scope.ddlCrop + '&pestDiseaseCode=' + pdcd).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.pestDetails = response.data;
                    if (response.data[0].hasOwnProperty('PestDiseaseName')) {
                        $scope.poe = true;
                        $scope.oea = false;
                    }
                    else if (!(response.data[0].hasOwnProperty('PestDiseaseName'))) {
                        $scope.poe = false;
                        $scope.oea = true;
                    }
                }
                else {
                    alert('Advisory is not entered.');
                    $scope.dateOfPDE = null;
                    $scope.ddlPest = null;
                    $scope.cbSeason = null;
                    $scope.ddlMonth = null;
                    $scope.ddlFY = null;
                    $scope.ddlCropCategory = null;
                    $scope.ddlCrop = null;
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

});