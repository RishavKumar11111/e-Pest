app.controller('myADAPTSWRCtrl', function($scope, $http) {
    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        if (day != 1 && day != 2 && day != 3 && day != 4 && day != 5) {
            alert('Pest details entry are not done on Saturday.');
            $scope.dateOfPDE = null;
        }
        else{
            if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined) {
                $http.get('http://localhost:3000/adapt/getStatePestDetails?dateOfEntry=' + document.getElementById('pdeDate').value).then(function success(response) {
                    if (response.data.length > 0) {
                        $scope.stateDetails = response.data[0];
                    }
                    else {
                        alert('Pest details were not entered.')
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