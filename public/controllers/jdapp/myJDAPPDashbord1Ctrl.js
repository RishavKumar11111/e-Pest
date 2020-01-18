app.controller('myJDAPPDashbord1Ctrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getDashboardDetails = function () {
        $http.get('http://localhost:3000/jdapp/getDashboardDetails').then(function success(response) {
            $scope.getJDAPPDetails = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

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
            if (myChart7) myChart7.destroy();
            if (myChart8) myChart8.destroy();
            $scope.pestDiseases = [];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPestDiseases = function () {
        if ($scope.ddlCropCategory != undefined) {
            $http.get('http://localhost:3000/jdapp/getPestDiseases?cropCode=' + $scope.ddlCrop).then(function success(response) {
                $scope.pestDiseases = response.data;
                if (myChart7) myChart7.destroy();
                if (myChart8) myChart8.destroy();
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.pests = [];
    $scope.getValue = function () {
        $scope.pests = [];
        angular.forEach($scope.pestDiseases, function (i) {
            if (i.selected) {
                $scope.pests.push(i.PestDiseaseCode);
            }
        });
        $scope.$watch($scope.pests, function () {
            if (myChart7) myChart7.destroy();
            if (myChart8) myChart8.destroy();
        }, true)
    };

    var ctx = document.getElementById('myChart7').getContext('2d');
    var myChart7 = null;
    var ctx1 = document.getElementById('myChart8').getContext('2d');
    var myChart8 = null;
    $scope.getPestGraphData = function () {
        var graphData = [];
        if ($scope.pests.length > 0) {
            var obj = {
                Month: $scope.ddlMonth == undefined || $scope.ddlMonth == null ? Month = 0 : Month = $scope.ddlMonth,
                FinancialYear:$scope.ddlFY == undefined || $scope.ddlFY == null ? FinancialYear = 0 : FinancialYear = $scope.ddlFY
            };
            $http.post('http://localhost:3000/jdapp/getPestGraphData', { data: { pestData: $scope.pests, monthData: obj } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                graphData = response.data;
                if (graphData.length > 0) {
                    var pestName = [];
                    var affectedPestArea = [];
                    var bColor = [];
                    for (var i = 0; i < graphData.length; i++) {
                        var pest = graphData[i].PestDiseaseName;
                        var affectedArea = graphData[i].totalAffectedArea;
                        pestName.push(pest);
                        affectedPestArea.push(affectedArea);
                    }
                    for (var i = 0; i <= pestName.length; i++) {
                        bColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
                    }
                    myChart7 = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: pestName,
                            datasets: [
                                {
                                    label: "Total Area Affected (In HA)",
                                    backgroundColor: bColor,
                                    data: affectedPestArea
                                }
                            ]
                        },
                        options: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: 'Pest Affected Area (in HA)'
                            }
                        }
                    });
                    myChart8 = new Chart(ctx1, {
                        type: 'line',
                        data: {
                            labels: pestName,
                            datasets: [{
                                data: affectedPestArea,
                                label: "Total Area Affected (in HA)",
                                borderColor: ["#265e32"]
                            }]
                        },
                        options: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: 'Pest Affected Area (in HA)'
                            }
                        }
                    });
                }
                else {
                    alert("No record for graph.");
                    pestName = null;
                    affectedPestArea = null;
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please select atleast one Pest.');
        }
    };

    $scope.destroyGraph = function () {
        if (myChart7) myChart7.destroy();
        if (myChart8) myChart8.destroy();
    };

    var cropCategoryName = [];
    var affectedPestArea = [];
    var categoryCode = [];
    var bColor = [];
    var ctx2 = document.getElementById('myChart9').getContext('2d');
    var myChart9 = null;
    $scope.getGD = function () {
        $http.get('http://localhost:3000/jdapp/getGraphforCrop').then(function success(response) {
            var pieData = response.data;
            if (pieData.length > 0) {
                for (var i = 0; i < pieData.length; i++) {
                    var categoryName = pieData[i].CategoryName + ' (in HA)';
                    var affectArea = pieData[i].totalAffectedArea;
                    var catCode = pieData[i].CropCategoryCode;
                    cropCategoryName.push(categoryName);
                    affectedPestArea.push(affectArea);
                    categoryCode.push(catCode);
                }
                for (var i = 0; i < cropCategoryName.length; i++) {
                    bColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
                }
                myChart9 = new Chart(ctx2, {
                    type: 'pie',
                    data: {
                        labels: cropCategoryName,
                        datasets: [{
                            label: 'Total Affected Area (in HA)',
                            backgroundColor: bColor,
                            data: affectedPestArea,
                            code: categoryCode
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Area Affected Under Crop Category (in HA)'
                        }
                    }
                });
            }
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    var ctx3 = document.getElementById('myChart10').getContext('2d');
    var myChart10 = null;
    document.getElementById('myChart9').onclick = function (evt) {
        if (myChart10) myChart10.destroy();
        var activePoints = myChart9.getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];
            var cropCode = chartData.datasets[0].code[idx];
            var cropHectareName = [];
            var affectedCropArea = [];
            var bagColor = [];
            httpGetAsync('http://localhost:3000/jdapp/getCropDetailsCategory?cropCode=' + cropCode, function (res) {
                var barData = JSON.parse(res);
                if (barData.length > 0) {
                    document.getElementById('acHide').style.display = 'block';
                    for (var i = 0; i < barData.length; i++) {
                        var cropName = barData[i].CropName + ' (in HA)';
                        var affectArea = barData[i].totalAffectedArea;
                        cropHectareName.push(cropName);
                        affectedCropArea.push(affectArea);
                    }
                    for (var i = 0; i < cropName.length; i++) {
                        bagColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
                    }
                }
                myChart10 = new Chart(ctx3, {
                    type: 'bar',
                    data: {
                        labels: cropHectareName,
                        datasets: [{
                            backgroundColor: bColor,
                            data: affectedCropArea
                        }]
                    },
                    options: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Area affected under Crop (in HA)'
                        }
                    }
                });
            });
        }
    };

});