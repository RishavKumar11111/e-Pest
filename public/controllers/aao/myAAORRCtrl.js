app.controller('myAAORRCtrl', function ($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getReferenceNos = function () {
        $http.get('http://localhost:3000/aao/getReferenceNos').then(function success(response) {
            $scope.referenceNos = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCD = function (referenceNo) {
        $http.get('http://localhost:3000/aao/getCD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.cd = response.data[0];
            // response.data.splice(0, 1);
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
        $http.get('http://localhost:3000/aao/getPD?referenceNo=' + referenceNo).then(function success(response) {
            $scope.pd = response.data[0];
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.removeRefNo = function (referenceNo) {
        var message = confirm('Do you really want to delete the Reference No. ' + referenceNo + ' ?');
        if (message) {
            $http.post('http://localhost:3000/aao/removeRefNo', { data: referenceNo }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                if (response.data.includes('21/')) {
                    alert('The Reference No. ' + response.data + ' was successfully removed.');
                    $scope.getReferenceNos();
                }
                else {
                    console.log(response.status);
                    alert('Oops! An error occurred.');
                }
            }).catch(function error(err) {
                console.log('An error occurred...', err);
            });
        }
    };

});