app.controller('myADOMFJCtrl', function($scope, $http) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    $scope.getMessages = function () {
        $http.get('http://localhost:3000/ado/getMessages').then(function success(response) {
            $scope.messages = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };
    
    $scope.submitADOMFJ = function (isValid) {
        if (isValid) {
            var message = confirm('Do you really want to submit the message?');
            if (message) {
                var myData = {
                    Message: $scope.taMFJ
                };
                $http.post('http://localhost:3000/ado/submitADOMFJ', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    if (response.data == 'OK') {
                        alert('The message is submitted to JDA(PP).');
                        $scope.taMFJ = null;
                        $scope.getMessages();
                    }
                    else {
                        console.log(response.status);
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
        }
        else {
            alert('Please enter the message.');
        }
    };

});