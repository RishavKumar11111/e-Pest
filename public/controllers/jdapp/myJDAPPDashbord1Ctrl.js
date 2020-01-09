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

    $scope.getCropCategoryPestDiseases = function () {
        if ($scope.ddlCropCategory != undefined) {
            $http.get('http://localhost:3000/jdapp/getCropCategoryPestDiseases?cropCategoryCode=' + $scope.ddlCropCategory).then(function success(response) {
                $scope.pestDiseases = response.data;
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
    };

    $scope.getPestGraphData = function () {
        var graphData = [];
        var pestName = [];
        var affectedPestArea = [];
        var bColor = [];
        if ($scope.pests.length > 0) {
            $http.post('http://localhost:3000/jdapp/getPestGraphData', { data: $scope.pests }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                graphData = response.data;
                if (graphData.length > 0) {
                    for (var i = 0; i < graphData.length; i++) {
                        var pest = graphData[i].PestDiseaseName;
                        var affectedArea = graphData[i].totalAffectedArea;
                        pestName.push(pest);
                        affectedPestArea.push(affectedArea);
                        for (var i = 0; i < pestName.length; i++) {
                            bColor.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
                        }
                    }
                    var ctx = document.getElementById('myChart7').getContext('2d');
                    var myChart7 = new Chart(ctx, {
                        type: 'bar',
                        data: {
                          labels: pestName,
                          datasets: [
                            {
                              label: "Total Area Affected (in HA)",
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
                    var ctx = document.getElementById('myChart8').getContext('2d');
                    var myChart8 = new Chart(ctx, {
                        type: 'line',
                        data: {
                          labels: pestName,
                          datasets: [{ 
                              data: affectedPestArea,
                              label: "Total Area Affected (in HA)",
                              borderColor: bColor[0]
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: true,
                            text: 'Pest Affected Area (in HA)'
                          }
                        }
                    });
                }
                else {
                    alert("No records found for the graph.");
                    graphData = [];
                    pestName = [];
                    affectedPestArea = [];
                    bColor = [];
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please select atleast one Pest.');
            graphData = [];
            pestName = [];
            affectedPestArea = [];
            bColor = [];
        }
    };

});