app.controller('myJDAPPADCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getCrops = function () {
        $http.get('http://localhost:3000/jdapp/getCrops').then(function success(response) {
            $scope.crops = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.pesticideArray = [];
    $scope.addPesticide = function () {
        if ($scope.txtPesticideName != '' && $scope.txtPesticideName != null && $scope.txtPesticideName != undefined && $scope.txtPesticideNameOdia != '' && $scope.txtPesticideNameOdia != null && $scope.txtPesticideNameOdia != undefined && $scope.txtRecommendedDose != '' && $scope.txtRecommendedDose != null && $scope.txtRecommendedDose != undefined && $scope.txtRecommendedDoseOdia != '' && $scope.txtRecommendedDoseOdia != null && $scope.txtRecommendedDoseOdia != undefined) {
            var r = true;
            if ($scope.pesticideArray.length > 0) {
                angular.forEach($scope.pesticideArray, function (i) {
                    if (i.PesticideName == $scope.txtPesticideName && i.PesticideNameOdia == $scope.txtPesticideNameOdia && i.RecommendedDose == $scope.txtRecommendedDose && i.RecommendedDoseOdia == $scope.txtRecommendedDoseOdia) {
                        alert("The Pesticide's Name '" + $scope.txtPesticideName + "', the Recommended Dose '" + $scope.txtRecommendedDose + "' are already entered.");
                        r = false;
                        clearData();
                    }
                });
            }
            if (r == true) {
                var english = /^[A-Za-z0-9\s]+$/;
                if (!(english.test($scope.txtPesticideNameOdia)) && !(english.test($scope.txtRecommendedDoseOdia))) {
                    var k = { PesticideName: $scope.txtPesticideName, PesticideNameOdia: $scope.txtPesticideNameOdia, RecommendedDose: $scope.txtRecommendedDose, RecommendedDoseOdia: $scope.txtRecommendedDoseOdia };
                    $scope.pesticideArray.push(k);
                    clearData();
                }
                else {
                    alert('Please use the SPACE BAR key to convert the text from english to odia.');
                }
            }
        }
        else {
            alert("Please enter Pesticide's details.");
        }
    };

    $scope.removePesticide = function (index) {
        $scope.pesticideArray.splice(index, 1);
    };

    $scope.submitAD = function (isValid) {
        if (isValid) {
            if ($scope.pesticideArray.length > 0) {
                var obj = {
                    CropCode: $scope.ddlCC,
                    CropType: ($scope.ddlCC == 202) ? 'MS' : ($scope.ddlCC == 201) ? 'GN' : ($scope.ddlCC == 206) ? 'SN' : 'NA',
                    PestDiseaseName: $scope.txtPestName
                };
                $http.post('http://localhost:3000/jdapp/submitAD', { data: { cropPest: obj, pesticide: $scope.pesticideArray } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('The Advisory details is submitted.');
                    }
                    else if (result == 'The Pesticide details already exists.') {
                        alert(result);
                    }
                    else {
                        console.log(response.status);
                    }
                    clearData();
                    $scope.ddlCC = null;
                    $scope.txtPestName = null;
                    $scope.pesticideArray = [];
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
            else {
                alert("Please enter Pesticide's details.");
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    var clearData = function () {
        $scope.txtPesticideName = null;
        $scope.txtPesticideNameOdia = null;
        $scope.txtRecommendedDose = null;
        $scope.txtRecommendedDoseOdia = null;
    };

    $scope.advisoryDetails = [];
    $scope.SelectFile = function (file) {
        if (file != null && file != undefined && file != '') {
            $scope.SelectedFile = file;
        }
        else {
            $scope.advisoryDetails = [];
            $scope.SelectedFile = null;
        }
    };

    $scope.Upload = function () {
        if ($scope.SelectedFile != null && $scope.SelectedFile != undefined && $scope.SelectedFile != '') {
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
            if (regex.test($scope.SelectedFile.name.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    //For Browsers other than IE.
                    if (reader.readAsBinaryString) {
                        reader.onload = function (e) {
                            $scope.ProcessExcel(e.target.result);
                        };
                        reader.readAsBinaryString($scope.SelectedFile);
                    } else {
                        //For IE Browser.
                        reader.onload = function (e) {
                            var data = "";
                            var bytes = new Uint8Array(e.target.result);
                            for (var i = 0; i < bytes.byteLength; i++) {
                                data += String.fromCharCode(bytes[i]);
                            }
                            $scope.ProcessExcel(data);
                        };
                        reader.readAsArrayBuffer($scope.SelectedFile);
                    }
                } else {
                    $window.alert("This browser does not support HTML5.");
                }
            } else {
                $window.alert("Please upload a valid Excel file.");
            }
        }
        else {
            alert('Please select a file to upload.');
            $scope.advisoryDetails = [];
            $scope.SelectedFile = null;
        }
    };

    $scope.ProcessExcel = function (data) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];
        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        //Display the data from Excel file in Table.
        $scope.$apply(function () {
            $scope.advisoryDetails = excelRows;
        });
    };

    $scope.submitEF = function (isValid) {
        if (isValid) {
            if ($scope.advisoryDetails.length > 0) {
                var myData = [];
                angular.forEach($scope.advisoryDetails, function (i) {
                    var k = {};
                    k.CropCode = ($filter('filter')($scope.crops, { CropName: i.Crops }, true))[0].CropCode;
                    k.CropType = (k.CropCode == 202) ? 'MS' : (k.CropCode == 201) ? 'GN' : (k.CropCode == 206) ? 'SN' : 'NA';
                    k.PestDiseaseName = i.Pests;
                    k.PesticideName = i.Pesticides;
                    k.RecommendedDose = i.RecommendedDoses200LitresperAcre;
                    myData.push(k);
                });
                $http.post('http://localhost:3000/jdapp/submitEF', { data: myData }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                    var result = response.data;
                    if (result == 'OK') {
                        alert('The Advisory details are submitted.');
                        $scope.advisoryDetails = [];
                        $scope.SelectedFile = null;
                    }
                    else {
                        console.log(response.status);
                        alert('Oops! An error occurred. Please try again.');
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
            else {
                alert('Please upload the excel file with data.');
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.getPestDiseases = function () {
        $http.get('http://localhost:3000/jdapp/getPestDiseases?cropCode=' + $scope.ddlCrop).then(function success(response) {
            $scope.pests = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getPesticideDetails = function () {
        if ($scope.ddlPest != null) {
            $http.get('http://localhost:3000/jdapp/getPesticideDetails?pestdiseaseCode=' + $scope.ddlPest).then(function success(response) {
                $scope.pesticideDetails = response.data;
                $scope.slht = true;
                $scope.sthl = false;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.showTextHideLabel = function () {
        $scope.sthl = true;
        $scope.slht = false;
    };

    $scope.showLabelHideText = function () {
        $scope.slht = true;
        $scope.sthl = false;
        $scope.getPesticideDetails();
    };

    $scope.updateAdvisoryDetails = function (isValid) {
        if (isValid) {
            var message = confirm('Do you really want to submit the form?');
            if (message) {
                if ($scope.ddlCrop != null && $scope.ddlCrop != undefined && $scope.ddlPest != null && $scope.ddlPest != undefined) {
                    var pestCode = $scope.ddlPest;
                    var myData = [];
                    var count = 0;
                    angular.forEach($scope.pesticideDetails, function (i) {
                        if (i.PesticideName != null && i.PesticideName != undefined && i.PesticideName != '' && i.PesticideNameOdia != null && i.PesticideNameOdia != undefined && i.PesticideNameOdia != '' && i.RecommendedDose != null && i.RecommendedDose != undefined && i.RecommendedDose != '' && i.RecommendedDoseOdia != null && i.RecommendedDoseOdia != undefined && i.RecommendedDoseOdia != '') {
                            var k = {
                                PesticideCode: i.PesticideCode,
                                PesticideName: i.PesticideName,
                                PesticideNameOdia: i.PesticideNameOdia,
                                RecommendedDose: i.RecommendedDose,
                                RecommendedDoseOdia: i.RecommendedDoseOdia,
                            }
                            count++;
                            myData.push(k);
                        }
                    });
                    if (count == $scope.pesticideDetails.length) {
                        $http.post('http://localhost:3000/jdapp/updateAdvisoryDetails', { data: { uad: myData, pcode: pestCode } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                            var result = response.data;
                            if (result == 'OK') {
                                alert('The records are updated.');
                                $scope.slht = false;
                                $scope.sthl = true;
                                $scope.getPesticideDetails();
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
                    else {
                        alert('Please fill all the Pesticide Name and Recommended Dose.');
                    }
                }
                else {
                    alert('Please enter all the fields correctly.');
                }
            }
        }
        else {
            alert('Please fill all the fields.');
        }
    };

    $scope.removeAD = function (pesticideCode) {
        var message = confirm('Do you really want to delete the advisory?');
        if (message) {
            $http.post('http://localhost:3000/jdapp/removeAD', { data: pesticideCode }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                if (response.data == 'OK') {
                    alert('The advisory was successfully removed.');
                    $scope.getPesticideDetails();
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

    $scope.convertE2O = function(engText, $event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 32) {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', 'https://inputtools.google.com/request?text=' + engText + '&itc=or-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8', false);
            xhttp.send();
            var response = JSON.parse(xhttp.responseText);
            if (response[0] == 'SUCCESS') {
                var resultOdia = response[1][0][1];
                document.getElementById($event.target.id).value = resultOdia[0];
                resultOdia.forEach(function(i) {
                    var optionNode = document.createElement('option');
                    optionNode.value = i;
                    document.getElementById($event.target.nextElementSibling.id).appendChild(optionNode);
                });
            }
            else {
                console.log(response.status);
            }
        }
    };

});