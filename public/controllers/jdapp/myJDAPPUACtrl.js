app.controller('myJDAPPUACtrl', function($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getLockedAccounts = function() {
        $http.get('http://localhost:3000/jdapp/getLockedAccounts').then(function success(response) {
            $scope.lockedAccounts = response.data;
            $scope.laVAW = ($filter('filter')($scope.lockedAccounts, { RoleName: 'VAW' }, true));
            $scope.laAAO = ($filter('filter')($scope.lockedAccounts, { RoleName: 'AAO' }, true));
            $scope.laADO = ($filter('filter')($scope.lockedAccounts, { RoleName: 'ADO' }, true));
            $scope.laCDAO = ($filter('filter')($scope.lockedAccounts, { RoleName: 'CDAO' }, true));
            $scope.laOUAT = ($filter('filter')($scope.lockedAccounts, { RoleName: 'OUAT' }, true));
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.unlock = function(userID) {
        var message = confirm('Do you really want to unlock the account?');
        if (message) {
            $http.post('http://localhost:3000/jdapp/unlock', { data: userID }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                alert('The User Account ' + userID + ' has been unlocked successfully.');
                $scope.getLockedAccounts();
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.unlockAll = function(userIDs) {
        var message = confirm('Do you really want to unlock all the accounts?');
        if (message) {
            var uIDs = [];
            angular.forEach(userIDs, function(i) {
                var k = {};
                k.UserID = i.UserID;
                uIDs.push(k);
            });
            $http.post('http://localhost:3000/jdapp/unlockAll', { data: uIDs }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                if (response.data == 'OK') {
                    alert('The User Accounts have been unlocked successfully.');
                    $scope.getLockedAccounts();
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
    };

});