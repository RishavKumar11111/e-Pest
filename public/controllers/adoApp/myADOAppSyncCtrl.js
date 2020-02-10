app.controller('myADOAppSyncCtrl', function ($scope, $http, $filter, $window) {

    var token = document.querySelector('#_csrf').value;

    $scope.randomNoInit = function (rno) {
        $scope.rNo = rno;
    };

    $scope.reload = function () {
        setTimeout(function () {
            if (!($window.location.hash == '#!/synchronize#loaded')) {
                $window.location.href = $window.location.href + '#loaded';
                $window.location.reload();
            }
        }, 1);
    };

    // $scope.checkDay = function() {
    //     var dt = new Date();
    //     var d = dt.getDay();
    //     if (d == 0 || d == 6) {
    //         alert('You are only allowed to enter details on Monday, Tuesday, Wednesday, Thursday & Friday.');
    //         location.href = 'http://localhost:3000/adoApp#!/home';
    //     }
    // };

    $scope.checkDay = function () {
        var dt = new Date();
        var d = dt.getDay();
        if (d == 0) {
            alert('You are not allowed to enter details on Sunday.');
            location.href = 'http://localhost:3000/adoApp#!/home';
        }
    };

    var clearData = function (callback) {
        if ('indexedDB' in window) {
            clearAllData('referenceNo').then(function () {
                clearAllData('crop-details').then(function () {
                    clearAllData('photo-location').then(function () {
                        clearAllData('pest-details').then(function () {
                            clearAllData('referenceNo-status').then(function () {
                                clearAllData('emrRefNo-fID').then(function () {
                                    clearAllData('user-login').then(function () {
                                        callback();
                                    }, function error(response) {
                                        console.log(response.status);
                                    }).catch(function err(error) {
                                        console.log('An error occurred...', error);
                                    });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            }, function error(response) {
                                console.log(response.status);
                            }).catch(function err(error) {
                                console.log('An error occurred...', error);
                            });
                        }, function error(response) {
                            console.log(response.status);
                        }).catch(function err(error) {
                            console.log('An error occurred...', error);
                        });
                    }, function error(response) {
                        console.log(response.status);
                    }).catch(function err(error) {
                        console.log('An error occurred...', error);
                    });
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.syncData = function (isValid) {
        if (isValid) {
            readAllData('user-login').then(function success(res) {
                var ud = {};
                if (res.length > 0) {
                    ud = res[0];
                }
                readAllData('referenceNo-status').then(function success(response) {
                    var pd = []; var db = [];
                    if (response.length > 0) {
                        var statusOne = ($filter('filter')(response, { Status: 1 }, true));
                        if (statusOne.length > 0) {
                            var counter = 0;
                            angular.forEach(statusOne, function (i) {
                                readItemFromData('pest-details', i.ReferenceNo).then(function success(response2) {
                                    delete response2.PestDiseaseName;
                                    pd.push(response2);
                                    readItemFromData('crop-details', i.ReferenceNo).then(function success(response2) {
                                        var k = {};
                                        k.ReferenceNo = response2.ReferenceNo;
                                        k.MobileNo = response2.MobileNo;
                                        k.DistrictCode = response2.DistrictCode;
                                        k.BlockCode = response2.BlockCode;
                                        db.push(k);
                                        counter++;
                                        if (counter == statusOne.length) {
                                            syncPost(pd, db, ud);
                                        }
                                    }, function error(response) {
                                        console.log(response.status);
                                    }).catch(function err(error) {
                                        console.log('An error occurred...', error);
                                    });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                        }
                        else {
                            syncPost(pd, db, ud);
                        }
                    }
                    else {
                        syncPost(pd, db, ud);
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
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

    var redirect = function (result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, callback) {
        if (c0 == result[0].length && c1 == result[1].length && c2 == result[2].length && c3 == result[3].length && c4 == result[4].length && c5 == result[5].length && c6 == result[6].length && c7 == result[7].length && c8 == result[8].length && c9 == result[9].length && c10 == 1) {
            alert('Data synchronized successfully.');
            document.getElementById("loader").style.display = 'none';
            location.href = 'http://localhost:3000/adoApp';
        }
        else {
            callback();
        }
    };
    var syncPost = function (pd, db, ud) {
        var password = sha256(sha256($scope.txtPassword) + $scope.rNo);
        readAllData('user-authentication').then(function success(resun) {
            $http.post('http://localhost:3000/adoApp/synchronize', { data: { unm: resun[0].Username, pwd: password, pestData: pd, distBlock: db, userDetails: ud } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response4) {
                var result = response4.data;
                if (result.length == 11) {
                    if ('indexedDB' in window) {
                        document.getElementById("loader").style.display = 'block';
                        clearData(function () {
                            var c0 = 0; var c1 = 0; var c2 = 0; var c3 = 0; var c4 = 0; var c5 = 0; var c6 = 0; var c7 = 0; var c8 = 0; var c9 = 0; var c10 = 0;
                            angular.forEach(result[0], function (i) {
                                writeData('referenceNo', i).then(function () {
                                    c0++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[1], function (i) {
                                writeData('crop-details', i).then(function () {
                                    c1++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[2], function (i) {
                                writeData('pest-details', i).then(function () {
                                    c2++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[3], function (i) {
                                writeData('photo-location', i).then(function () {
                                    c3++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[4], function (i) {
                                writeData('pest-disease', i).then(function () {
                                    c4++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[5], function (i) {
                                writeData('pesticide', i).then(function () {
                                    c5++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[6], function (i) {
                                writeData('pest-disease-intensity', i).then(function () {
                                    c6++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[7], function (i) {
                                writeData('referenceNo-status', i).then(function () {
                                    c7++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[8], function (i) {
                                writeData('emrRefNo-fID', i).then(function () {
                                    c8++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[9], function (i) {
                                writeData('block', i).then(function () {
                                    c9++;
                                    redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            writeData('user-login', result[10]).then(function () {
                                c10++;
                                redirect(result, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, function () { });
                            }, function error(response) {
                                console.log(response.status);
                            }).catch(function err(error) {
                                console.log('An error occurred...', error);
                            });
                        });
                    }
                }
                else if (result == 'You are only allowed to synchronize on Friday.') {
                    alert(result);
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/adoApp#!/home';
                }
                else if (result == 'Invalid Username or Password.' || result == 'Invalid Username.' || result == 'Account is locked. Contact Admin.') {
                    alert(result);
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/adoApp#!/synchronize';
                    $scope.reload();
                }
                else if (result == 'Please change your password.') {
                    alert(result);
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/adoApp#!/changePassword';
                }
                else if (result.includes('a Phone or a Tablet')) {
                    alert(result);
                    location.href = 'http://localhost:3000/adoApp/authentication';
                }
                else {
                    alert('Oops! An error occurred. Try after sometime.');
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/adoApp#!/synchronize';
                    $scope.reload();
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});