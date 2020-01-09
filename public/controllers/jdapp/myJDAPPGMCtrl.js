app.controller('myJDAPPGMCtrl', function($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.checkCDay = function() {
        var day = new Date(document.getElementById('pdeDate').value).getDay();
        // if (day != 1 && day != 2 && day != 3 && day != 4) {
        //     alert('Pest details entry are only done on Monday, Tuesday, Wednesday and Thursday by VAW.');
        //     $scope.dateOfPDE = null;
        // }

        if (day == 0) {
            alert('Pest details entry are not done on Sunday by VAW.');
            $scope.dateOfPDE = null;
        }
    };

    $scope.getDistricts = function () {
        $http.get('http://localhost:3000/jdapp/getDistricts').then(function success(response) {
            $scope.districts = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.gisMapDetails = [];
    $scope.getGISMapDetails = function() {
        if ($scope.ddlFY != null && $scope.ddlFY != undefined && $scope.rbs != null && $scope.rbs != undefined && $scope.dateOfPDE != null && $scope.dateOfPDE != undefined) {
            $scope.showMap = true;
            var distcd = 0;
            $scope.ddlDistrict == undefined || $scope.ddlDistrict == null ? distcd = 0 : distcd = $scope.ddlDistrict;
            // window.open('http://localhost:3000/jdapp/map?financialYear=' + $scope.ddlFY + '&season=' + $scope.rbs + '&districtCode=' + $scope.ddlDistrict);
            document.getElementById('mf').src = 'http://localhost:3000/jdapp/map?financialYear=' + $scope.ddlFY + '&season=' + $scope.rbs + '&districtCode=' + distcd + '&dateOfEntry=' + document.getElementById('pdeDate').value;
        }
        else {
            alert('Please select all the fields.');
        }
    };

});