app.controller('myADOComplianceCtrl', function($scope, $http) {
    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        // if (day == 0 || day == 5 || day == 6) {
        //     alert('Pest Surveillance is done from Monday to Thursday.');
        //     $scope.dateOfPDE = null;
        // }
        var month = new Date(document.getElementById('pdeDate').value).getMonth();
        if ((month >= 6 && month <= 10 && $scope.rbs == 'K') || ((month < 6 || month > 10) && $scope.rbs == 'R')) {
            if (day == 0) {
                alert('Pest Surveillance is not done on Sunday.');
                $scope.dateOfPDE = null;
            }
            else {
                if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined) {
                    $http.get('http://localhost:3000/ado/getComplianceReport?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY).then(function success(response) {
                        if (response.data.length > 0) {
                            $scope.complianceDetails = response.data[0];
                        }
                        else {
                            alert('No record found.')
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
        }
        else {
            alert('Please select the Date and Season correctly.');
            $scope.dateOfPDE = null;
            $scope.rbs = null;
        }
    };

    $scope.getTargetedGP = function (blockCode) {
            $http.get('http://localhost:3000/ado/getTargetedGP?blockCode=' + blockCode + '&season=' + $scope.rbs).then(function success(response) {
            $scope.targetedGPData = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };
    
    $scope.getSurveyGP = function (blockCode) {
        $http.get('http://localhost:3000/ado/getSurveyGP?dateOfEntry=' + document.getElementById('pdeDate').value + '&blockCode=' + blockCode + '&season=' + $scope.rbs).then(function success(response) {
            $scope.surveyGP = response.data[0];
            $scope.notSurveyGP = response.data[1];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.printNext = function (tableID, title) {
        var contents = document.getElementById(tableID.target.nextElementSibling.nextElementSibling.id);
        var popupWinindow = window.open('', '_blank', 'width=800, height=600, toolbar=1, titlebar=1, resizable=1, location=0, status=1, menubar=0, scrollbars=1');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="../../gentelella/vendors/bootstrap/dist/css/bootstrap.min.css"><link href="../../gentelella/build/css/custom.min.css" rel="stylesheet"></head><body onload="window.print()"><center><table><tr><td style="width: 120px; padding: 10px"><img style="height: 75px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/e-PestLogo.png" /></td><td style="text-align: center"><h3>Department of Agriculture & Farmers\' Empowerment</h3></td><td style="width: 120px; padding: 10px"><img style="height: 87px; width: 75px" src="../gigw/nielit.gov.in/sites/all/themes/berry/images/ogp-logo.png" /></td></tr><tr><td style="text-align: center" colspan="3"><h3>' + title + '</h3></td></tr><tr><td><h4>Date:</h4></td><td><h4>' + document.getElementById('pdeDate').value + '</h4></td></tr>' + contents.outerHTML + '</html>');
        popupWinindow.document.close();
        popupWinindow.print();
        // popupWinindow.close();
    };
});