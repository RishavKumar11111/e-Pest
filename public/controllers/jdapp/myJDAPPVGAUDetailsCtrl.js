app.controller('myJDAPPVGAUDetailsCtrl', function ($scope, $http, $filter, $timeout) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getDistricts = function () {
        $http.get('http://localhost:3000/jdapp/getDistricts').then(function success(response) {
            $scope.districts = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getVAWGPAllocatedDetails = function () {
        if ($scope.ddlDistrict != undefined && $scope.ddlAllocatedGp != null) {
            $http.get('http://localhost:3000/jdapp/getVAWGPAllocatedDetails?districtCode=' + $scope.ddlDistrict + '&statusCode=' + $scope.ddlAllocatedGp).then(function success(response) {
                $scope.vawGPAllocatedDetails = response.data[0];
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.print = function () {
        var contents = document.getElementById('tblVGAU');
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>District-Wise GP Allocated & Unallocated Details</h3></td></tr></table></center>' + contents.innerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };

});