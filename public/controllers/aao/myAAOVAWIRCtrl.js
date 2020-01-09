app.controller('myAAOVAWIRCtrl', function($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        if (day == 0 && day == 7) {
            alert('VAW Details entry done from monday to saturday.');
            $scope.dateOfPDE = null;
        }
    };

    $scope.pestDetails = [];
    $scope.getVAWInspectionDetails = function() {
        if ($scope.dateOfPDE != null && $scope.dateOfPDE != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.ddlFY != null && $scope.ddlFY != undefined) {
            $http.get('http://localhost:3000/aao/getVAWInspectionDetails?dateOfEntry=' + document.getElementById('pdeDate').value + '&season=' + $scope.rbs + '&financialYear=' + $scope.ddlFY).then(function success(response) {
                if (response.data.length > 0) {
                    $scope.pestDetails = response.data;
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

    $scope.getCD = function (referenceNo) {
        $http.get('http://localhost:3000/aao/getCD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.cd = response.data[0];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPLD = function (referenceNo) {
        $http.get('http://localhost:3000/aao/getPLD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.pld = response.data[0];
            getImage($scope.pld.FLP, $scope.pld.RLP1, $scope.pld.RLP2);
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    var getImage = function (a, b, c) {
        var flp = "data:image/jpeg;base64," + a;
        document.getElementById('flp').setAttribute("src", flp);
        if (b != null) {
            var rlp1 = "data:image/jpeg;base64," + b;
            document.getElementById('rlp1').setAttribute("src", rlp1);
        }
        if (c != null) {
            var rlp2 = "data:image/jpeg;base64," + c;
            document.getElementById('rlp2').setAttribute("src", rlp2);
        }
    };

    $scope.getPD = function (referenceNo) {
        $scope.lblPestDetails = true;
        $scope.txtPestDetails = false;
        $http.get('http://localhost:3000/aao/getPD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.pd = response.data[0];
            $scope.rbPestIdentified = $scope.pd.InfectionIdentified;
            $scope.ddlPestDisease = $scope.pd.PestDiseaseCode;
            $scope.txtAreaOfLand = $scope.pd.AreaOfLand;
            $scope.txtLowAreaAffected = $scope.pd.LowIntensityAttackArea;
            $scope.txtMediumAreaAffected = $scope.pd.MediumIntensityAttackArea;
            $scope.txtHighAreaAffected = $scope.pd.HighIntensityAttackArea;
            $scope.txtLowAreaTreated = $scope.pd.LowIntensityTreatedArea;
            $scope.txtMediumAreaTreated = $scope.pd.MediumIntensityTreatedArea;
            $scope.txtHighAreaTreated = $scope.pd.HighIntensityTreatedArea;
            $scope.ddlMPP = $scope.pd.ModerateIntensityPestPopulation;
            $scope.ddlHPP = $scope.pd.HighIntensityPestPopulation;
            $scope.ddlMAdvisory = $scope.pd.AdvisoryModerate;
            $scope.ddlHAdvisory = $scope.pd.AdvisoryHigh;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});