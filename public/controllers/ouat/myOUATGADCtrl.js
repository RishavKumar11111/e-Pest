app.controller('myOUATGADCtrl', function ($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.genADID = false;
    $scope.cropReport = false;
    $scope.checkCDay = function () {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        if (day != 1 && day != 2 && day != 3 && day != 4 && day != 5) {
            alert('Pest details entry are not done on Saturday.');
            $scope.dateOfPDE = null;
        }
        else {
            $scope.genADID = true;
            $scope.cropReport = true;
            if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined) {
                $http.get('http://localhost:3000/ouat/getGeneralPestDetails?dateOfEntry=' + document.getElementById('pdeDate').value).then(function success(response) {
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

    $scope.getCropCategories = function () {
        $http.get('http://localhost:3000/ouat/getCropCategories').then(function success(response) {
            $scope.cropCategories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropsByCategory = function () {
        if ($scope.ddlCC != undefined) {
            $http.get('http://localhost:3000/ouat/getCropsByCategory?cropCategoryCode=' + $scope.ddlCC).then(function success(response) {
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
            $http.get('http://localhost:3000/ouat/getPestDiseases?cropCode=' + $scope.ddlC).then(function success(response) {
                $scope.pestDiseases = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.submitGeneralAdvisory = function(isValid) {
        if (isValid) {
            var english = /^[A-Za-z0-9\s]+$/;
            if (!(english.test($scope.txtOdiaAdvisory))) {
                var month = new Date(document.getElementById('pdeDate').value).getMonth();
                if ((month >= 6 && month <= 10 && $scope.rbs == 'K') || ((month < 6 || month > 10) && $scope.rbs == 'R')) {
                    var message = confirm('Do you really want to Submit the Advisory?');
                    if (message) {
                        var myData = {
                            CategoryCode: $scope.ddlCC,
                            CropCode: $scope.ddlC,
                            PestDiseaseCode: $scope.ddlPD,
                            Season: $scope.rbs,
                            FinancialYear: $scope.ddlFY,
                            EnglishAdvisory: $scope.txtEnglishAdvisory,
                            OdiaAdvisory: $scope.txtOdiaAdvisory
                        };
                        $http.post('http://localhost:3000/ouat/submitGeneralAdvisory', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                            if (response.data == 'OK') {
                                alert('The General Advisory is sucessfully submitted.');
                                $scope.ddlCC = null; $scope.ddlC = null; $scope.ddlPD = null; $scope.dateOfPDE = null; $scope.rbs = null; $scope.ddlFY = null; $scope.txtEnglishAdvisory = null; $scope.txtOdiaAdvisory = null;
                            }
                            else {
                                console.log(response.status);
                                alert('Oops! An error occurred.');
                            }
                        }).catch(function error(err) {
                            console.log('An error occurred...', err);
                        });
                    }
                }
                else {
                    alert('Please select the Date and Season correctly.');
                    $scope.dateOfPDE = null;
                    $scope.rbs = null;
                }
            }
            else {
                alert('Please use the SPACE BAR key to convert the text from english to odia.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.convertE2O = function (engText, $event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 32) {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', 'https://inputtools.google.com/request?text=' + engText + '&itc=or-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8', false);
            xhttp.send();
            var response = JSON.parse(xhttp.responseText);
            if (response[0] == 'SUCCESS') {
                var resultOdia = response[1][0][1];
                document.getElementById($event.target.id).value = resultOdia[0];
                resultOdia.forEach(function (i) {
                    var optionNode = document.createElement('option');
                    optionNode.value = i;
                    document.getElementById($event.target.nextElementSibling.id).appendChild(optionNode);
                });
            }
            else {
                console.log(response.status);
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