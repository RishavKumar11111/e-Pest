app.controller('myAAOLTCCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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

    $scope.getLTCGPs = function () {
        $http.get('http://localhost:3000/aao/getLTCGPs').then(function success(response) {
            $scope.ltcGPs = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCrops = function () {
        $http.get('http://localhost:3000/aao/getCrops').then(function success(response) {
            var k = ($filter('filter')(response.data, { CategoryCode: 3 }, true));
            var l = { CC: k[0].CategoryCode, CN: k[0].CategoryName };
            var m = response.data.filter(function (i) { return !k.includes(i); });
            $scope.crops = m.map(function(i) { return { CC: i.CropCode, CN: i.CropName }; });
            $scope.crops.push(l);
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPestDiseases = function () {
        $http.get('http://localhost:3000/aao/getPestDiseases?cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.pestDiseases = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.submitAAOLTC = function(isValid) {
        if (isValid) {
            var message = confirm('Do you really want to submit the form?');
            if (message) {
                var myData = { GPCode: $scope.ddlGP, CC: $scope.ddlCrop, PestDiseaseCode: $scope.ddlPestDisease, PestTrappedNo: $scope.txtPestTrappedNo };
                $http.post('http://localhost:3000/aao/submitAAOLTC', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'The Light Trap Catch details are successfully submitted.') {
                        alert(result);
                        $scope.getLTCDetails(); $scope.ddlGP = null; $scope.ddlCrop = null; $scope.ddlPestDisease = null; $scope.pestDiseases = []; $scope.txtPestTrappedNo = null;
                    }
                    else if (result == 'Light Trap Catch data has been entered for this Pest in this GP today.') {
                        alert(result)
                    }
                    else {
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

    $scope.ltcDetails = [];
    $scope.getLTCDetails = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined) {
            $http.get('http://localhost:3000/aao/getLTCDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY).then(function success(response) {
                $scope.ltcDetails = response.data;
                angular.forEach($scope.ltcDetails, function(i) {
                    if (i.CropCategoryCode == null) {
                        i.CC = i.CropCode;
                        i.CN = i.CropName;
                    }
                    else if (i.CropCode == null) {
                        i.CC = i.CropCategoryCode;
                        i.CN = i.CategoryName;
                    }
                    delete i.CropCode; delete i.CropName; delete i.CropCategoryCode; delete i.CategoryName;
                });
                
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

});