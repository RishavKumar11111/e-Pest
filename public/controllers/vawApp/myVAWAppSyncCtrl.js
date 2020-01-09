app.controller('myVAWAppSyncCtrl', function($scope, $http, $location, $window) {
    
    var token = document.querySelector('#_csrf').value;

    $scope.randomNoInit = function(rno) {
        $scope.rNo = rno;
    };

    $scope.reload = function() {
        setTimeout(function() {
            if(!($window.location.hash == '#!/synchronize#loaded')) {
                $window.location.href = $window.location.href + '#loaded';
                $window.location.reload();
            }
        }, 1);
    };
    
    // $scope.checkDay = function() {
    //     var dt = new Date();
    //     var d = dt.getDay();
    //     if (d == 0 || d == 5 || d == 6) {
    //         alert('You are only allowed to enter details on Monday, Tuesday, Wednesday & Thursday.');
    //         location.href = 'http://localhost:3000/vawApp#!/home';
    //     }
    // };

    $scope.checkDay = function() {
        var dt = new Date();
        var d = dt.getDay();
        if (d == 0) {
            alert('You are not allowed to enter details on Sunday.');
            location.href = 'http://localhost:3000/vawApp#!/home';
        }
    };

    $scope.clearData = function() {
        if ('indexedDB' in window) {
            readAllData('referenceNo-status').then(function success(response) {
                if (response.length > 0) {
                    angular.forEach(response, function(i) {
                        if (i.Status == 0) {
                            clearItemFromData('crop-details-entry', i.ReferenceNo).then(function() {
                                readAllData('refNo-fID-aID').then(function success(response1) {
                                    if (response1.length > 0) {
                                        angular.forEach(response1, function(j) {
                                            if (j.ReferenceNo == i.ReferenceNo) {
                                                clearItemFromData('refNo-fID-aID', j.ID).then(function() {
                                                }, function error(response) {
                                                    console.log(response.status);
                                                }).catch(function err(error) {
                                                    console.log('An error occurred...', error);
                                                });
                                            }
                                        });
                                    }
                                    clearItemFromData('pest-details-entry', i.ReferenceNo).then(function() {
                                        clearItemFromData('photo-location-entry', i.ReferenceNo).then(function() {
                                            clearItemFromData('referenceNo-status', i.ReferenceNo).then(function() {
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
                    });
                }
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    var referenceFarmer = [];
    var checkFarmerID = function(refNofIDaID, callback) {
        var counter = 0;
        referenceFarmer = [];
        if (refNofIDaID.length > 0) {
            angular.forEach(refNofIDaID, function(i) {
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

    $scope.syncData = function(isValid) {
        if (isValid) {
            var password = sha256(sha256($scope.txtPassword) + $scope.rNo);
            readAllData('crop-details-entry').then(function success(response) {
                readAllData('pest-details-entry').then(function success(response2) {
                    readAllData('photo-location-entry').then(function success(response3) {
                        readAllData('refNo-fID-aID').then(function success(response1) {
                            checkFarmerID(response1, function success(resp) {
                                clearAllData('referenceNo-count').then(function() {
                                    clearAllData('referenceNo-status').then(function() {
                                        clearAllData('gp').then(function() {
                                            clearAllData('village').then(function() {
                                                clearAllData('user-login').then(function() {
                                                    readAllData('user-authentication').then(function success(resun) {
                                                        $http.post('http://localhost:3000/vawApp/synchronize', { data: { unm: resun[0].Username, pwd: password, cropData: response, refNofIDaID: resp, pestData: response2, plData: response3 } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response4) {
                                                            var result = response4.data;
                                                            if (result.length == 11) {
                                                                angular.forEach(result[0], function(i) {
                                                                    writeData('referenceNo-count', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[1], function(i) {
                                                                    writeData('referenceNo-status', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[2], function(i) {
                                                                    writeData('gp', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[3], function(i) {
                                                                    writeData('village', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[4], function(i) {
                                                                    writeData('crop-category', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[5], function(i) {
                                                                    writeData('crop', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[6], function(i) {
                                                                    writeData('crop-stage', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[7], function(i) {
                                                                    writeData('pest-disease', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[8], function(i) {
                                                                    writeData('pesticide', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                angular.forEach(result[9], function(i) {
                                                                    writeData('pest-disease-intensity', i).then(function() {
                                                                    }, function error(response) {
                                                                        console.log(response.status);
                                                                    }).catch(function err(error) {
                                                                        console.log('An error occurred...', error);
                                                                    });
                                                                });
                                                                writeData('user-login', result[10]).then(function() {
                                                                }, function error(response) {
                                                                    console.log(response.status);
                                                                }).catch(function err(error) {
                                                                    console.log('An error occurred...', error);
                                                                });
                                                                clearAllData('crop-details-entry').then(function() {}, function error(response) { console.log(response.status); }).catch(function err(error) { console.log('An error occurred...', error); });
                                                                clearAllData('refNo-fID-aID').then(function() {}, function error(response) { console.log(response.status); }).catch(function err(error) { console.log('An error occurred...', error); });
                                                                clearAllData('pest-details-entry').then(function() {}, function error(response) { console.log(response.status); }).catch(function err(error) { console.log('An error occurred...', error); });
                                                                clearAllData('photo-location-entry').then(function() {}, function error(response) { console.log(response.status); }).catch(function err(error) { console.log('An error occurred...', error); });
                                                                alert('Data synchronized successfully.');
                                                                $location.path('/dashboard/cropDetails');
                                                            }
                                                            else if (result == 'You are only allowed to synchronize on Monday, Tuesday, Wednesday & Thursday.') {
                                                                alert(result);
                                                                $scope.txtPassword = null;
                                                                location.href = 'http://localhost:3000/vawApp#!/home';
                                                            }
                                                            else if (result == 'Invalid Username or Password.' || result == 'Invalid Username.' || result == 'Account is locked. Contact Admin.') {
                                                                alert(result);
                                                                $scope.txtPassword = null;
                                                                location.href = 'http://localhost:3000/vawApp#!/synchronize';
                                                                $scope.reload();
                                                            }
                                                            else if (result == 'Please change your password.') {
                                                                alert(result);
                                                                $scope.txtPassword = null;
                                                                location.href = 'http://localhost:3000/vawApp#!/changePassword';
                                                            }
                                                            else if (result.includes('a Phone or a Tablet')) {
                                                                alert(result);
                                                                location.href = 'http://localhost:3000/vawApp/authentication';
                                                            }
                                                            else {
                                                                alert('Oops! An error occurred. Try after sometime.');
                                                                $scope.txtPassword = null;
                                                                location.href = 'http://localhost:3000/vawApp#!/synchronize';
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
        else {
            alert('Please fill all the fields.');
        }
    };

});