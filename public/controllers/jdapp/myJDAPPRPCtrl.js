app.controller('myJDAPPRPCtrl', function($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.userIDArray = [];
    $scope.addUserID = function() {
        if ($scope.txtUserID != '' && $scope.txtUserID != null && $scope.txtUserID != undefined) {
            var r = true;
            if ($scope.userIDArray.length > 0) {
                angular.forEach($scope.userIDArray, function(i) {
                    if (i.UserID == $scope.txtUserID) {
                        alert('The User ID "' + $scope.txtUserID + '" is already entered.'); 
                        r = false;
                    }
                });
            }
            if (r == true) {
                var k = { UserID: $scope.txtUserID };
                $scope.userIDArray.push(k);
            }
            $scope.txtUserID = null;
        }
        else {
            alert('Please enter a User ID.');
        }
    };

    $scope.removeUserID = function (index) {
        $scope.userIDArray.splice(index, 1);
    };

    $scope.resetPasswords = function(isValid) {
        if (isValid && $scope.userIDArray.length > 0) {
            $http.post('http://localhost:3000/jdapp/resetPasswords', { data: $scope.userIDArray }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                if (response.data == 'OK') {
                    alert('The corresponding passwords have been reset successfully.');
                    $scope.txtUserID = null;
                    $scope.userIDArray = [];
                }
                else if (response.status == 204) {
                    alert('Invalid User ID.');
                    $scope.txtUserID = null;
                    $scope.userIDArray = [];
                }
                else {
                    alert('Oops! An error occurred. Please try again.');
                    console.log(response.status);
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
        else {
            alert('Please fill all the fields.');
        }
    };

});