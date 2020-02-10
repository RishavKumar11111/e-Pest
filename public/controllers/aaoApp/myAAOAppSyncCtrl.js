app.controller('myAAOAppSyncCtrl', function ($scope, $http, $filter, $window) {

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
    //         location.href = 'http://localhost:3000/aaoApp#!/home';
    //     }
    // };

    $scope.checkDay = function () {
        var dt = new Date();
        var d = dt.getDay();
        if (d == 0) {
            alert('You are not allowed to enter details on Sunday.');
            location.href = 'http://localhost:3000/aaoApp#!/home';
        }
    };

    var referenceFarmer = [];
    var checkFarmerID = function (refNofIDaID, callback) {
        var counter = 0;
        referenceFarmer = [];
        if (refNofIDaID.length > 0) {
            angular.forEach(refNofIDaID, function (i) {
                if (i.FarmerID != null) {
                    $http.get('http://apicol.nic.in/api/FarmerData?farmerID=' + i.FarmerID).then(function success(res) {
                        if (res.data.ErrorMessage == null) {
                            var k = {};
                            k.ReferenceNo = i.ReferenceNo;
                            k.FarmerID = i.FarmerID;
                            k.Status = 'Valid';
                            k.AadhaarNo = i.AadhaarNo;
                            referenceFarmer.push(k);
                            counter++;
                            if (counter == refNofIDaID.length) {
                                callback(referenceFarmer);
                            }
                        }
                        else {
                            var k = {};
                            k.ReferenceNo = i.ReferenceNo;
                            k.FarmerID = i.FarmerID;
                            k.Status = 'Invalid';
                            k.AadhaarNo = i.AadhaarNo;
                            referenceFarmer.push(k);
                            counter++;
                            if (counter == refNofIDaID.length) {
                                callback(referenceFarmer);
                            }
                        }
                    }, function error(response) {
                        console.log(response.status);
                    }).catch(function err(error) {
                        console.log('An error occurred...', error);
                    });
                }
                else {
                    var k = {};
                    k.ReferenceNo = i.ReferenceNo;
                    k.FarmerID = null;
                    k.Status = null;
                    k.AadhaarNo = i.AadhaarNo;
                    referenceFarmer.push(k);
                    counter++;
                    if (counter == refNofIDaID.length) {
                        callback(referenceFarmer);
                    }
                }
            });
        }
        else {
            callback(referenceFarmer);
        }
    };

    $scope.syncData = function (isValid) {
        if (isValid) {
            if ('indexedDB' in window) {
                readAllData('user-login').then(function success(res) {
                    var cd = []; var pd = []; var rf = []; var ud = {};
                    if (res.length > 0) {
                        delete res[0].Role;
                        ud = res[0];
                    }
                    readAllData('referenceNo-status').then(function success(response) {
                        if (response.length > 0) {
                            var statusOne = ($filter('filter')(response, { Status: 1 }, true));
                            if (statusOne.length > 0) {
                                readAllData('refNo-fID-aID').then(function success(response1) {
                                    rf = response1.filter(item => !statusOne.every(item2 => item2.ReferenceNo != item.ReferenceNo));
                                    checkFarmerID(rf, function success(resp) {
                                        var counter = 0;
                                        angular.forEach(statusOne, function (i) {
                                            readItemFromData('crop-details', i.ReferenceNo).then(function success(response1) {
                                                var k = {};
                                                k.ReferenceNo = response1.ReferenceNo;
                                                k.GPCode = response1.GPCode;
                                                k.VillageCode = response1.VillageCode;
                                                k.Season = response1.Season;
                                                k.MobileNo = response1.MobileNo;
                                                k.CropCategoryCode = response1.CategoryCode;
                                                k.CropCode = response1.CropCode;
                                                k.CropStageCode = response1.CropStageCode;
                                                k.VAWCode = response1.VAWCode;
                                                cd.push(k);
                                                readItemFromData('pest-details', i.ReferenceNo).then(function success(response2) {
                                                    delete response2.PestDiseaseName;
                                                    pd.push(response2);
                                                    counter++;
                                                    if (counter == statusOne.length) {
                                                        syncPost(cd, resp, pd, ud);
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
                                    }, function error(response) {
                                        console.log(response.status);
                                    });
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            }
                            else {
                                syncPost(cd, rf, pd, ud);
                            }
                        }
                        else {
                            syncPost(cd, rf, pd, ud);
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
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    var syncPost = function (cd, rf, pd, ud) {
        var password = sha256(sha256($scope.txtPassword) + $scope.rNo);
        readAllData('user-authentication').then(function success(resun) {
            $http.post('http://localhost:3000/aaoApp/synchronize', { data: { unm: resun[0].Username, pwd: password, cropData: cd, refNofIDaID: rf, pestData: pd, userDetails: ud } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                var result = response.data;
                if (result.length == 13) {
                    if ('indexedDB' in window) {
                        clearData(function () {
                            angular.forEach(result[0], function (i) {
                                writeData('referenceNo', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[1], function (i) {
                                writeData('crop-details', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[2], function (i) {
                                writeData('refNo-fID-aID', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[3], function (i) {
                                writeData('crop-category', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[4], function (i) {
                                writeData('crop', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[5], function (i) {
                                writeData('crop-stage', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[6], function (i) {
                                writeData('photo-location-details', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[7], function (i) {
                                writeData('pest-details', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[8], function (i) {
                                writeData('pest-disease', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[9], function (i) {
                                writeData('pesticide', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[10], function (i) {
                                writeData('pest-disease-intensity', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            angular.forEach(result[11], function (i) {
                                writeData('referenceNo-status', i).then(function () {
                                }, function error(response) {
                                    console.log(response.status);
                                }).catch(function err(error) {
                                    console.log('An error occurred...', error);
                                });
                            });
                            writeData('user-login', result[12]).then(function () {
                            }, function error(response) {
                                console.log(response.status);
                            }).catch(function err(error) {
                                console.log('An error occurred...', error);
                            });
                            alert('Data synchronized successfully.');
                            location.href = 'http://localhost:3000/aaoApp#!/dashboard/referenceNoDetails';
                        });
                    }
                }
                else if (result == 'You are only allowed to synchronize on Monday, Tuesday, Wednesday, Thursday & Friday.') {
                    alert(result);
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/aaoApp#!/home';
                }
                else if (result == 'Invalid Username or Password.' || result == 'Invalid Username.' || result == 'Account is locked. Contact Admin.') {
                    alert(result);
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/aaoApp#!/synchronize';
                    $scope.reload();
                }
                else if (result == 'Please change your password.') {
                    alert(result);
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/aaoApp#!/changePassword';
                }
                else if (result.includes('a Phone or a Tablet')) {
                    alert(result);
                    location.href = 'http://localhost:3000/aaoApp/authentication';
                }
                else {
                    alert('Oops! An error occurred. Try after sometime.');
                    $scope.txtPassword = null;
                    location.href = 'http://localhost:3000/aaoApp#!/synchronize';
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

    var clearData = function (callback) {
        if ('indexedDB' in window) {
            clearAllData('referenceNo').then(function () {
                clearAllData('crop-details').then(function () {
                    clearAllData('refNo-fID-aID').then(function () {
                        clearAllData('photo-location-details').then(function () {
                            clearAllData('pest-details').then(function () {
                                clearAllData('referenceNo-status').then(function () {
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

});