var express = require('express');
var router = express.Router();
var balModule = require('../models/cdaoBALModule');
var atob = require('atob');
var crypto = require('crypto');
var sha256 = require('js-sha256');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var csrfProtection = csrf();
var parseForm = bodyParser.urlencoded({ extended: false });
var os = require('os');
var cache = require('cache-headers');
var permit = require('../models/permission');
var request = require('request');

var overrideConfig = {
  'maxAge': 2000,
  'setPrivate': true
};

function randomNumber() {
  const buf = crypto.randomBytes(16);
  return buf.toString('hex');
};

var getCurrentDateTime = function() {
  var today = new Date();
  var dd = today.getDate();
  var MM = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var HH = today.getHours();
  var mm = today.getMinutes();
  var ss = today.getSeconds();
  if (dd < 10) {
      dd = '0' + dd;
  }
  if (MM < 10) {
      MM = '0' + MM;
  }
  if (HH < 10) {
    HH = '0' + HH;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  if (ss < 10) {
    ss = '0' + ss;
  }
  var todayDate = yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
  var currentDate = new Date(todayDate);
  return currentDate;
};

var getDateTime = function() {
  var dateTime = require('node-datetime');
  var dt = dateTime.create().format('Y-m-d H:M:S.N');
  var date = new Date(dt);
  var userTimezone = date.getTimezoneOffset() * 60000;
  var currentDate = new Date(date.getTime() - userTimezone);
  return currentDate;
};

var getFinancialYear = function() {
  var fiscalYear = "";
  var today = new Date();
  if ((today.getMonth() + 1) <= 3) {
    fiscalYear = (today.getFullYear() - 1) + "-" + today.getFullYear().toString().substr(2, 3);
  }
  else {
    fiscalYear = today.getFullYear() + "-" + (today.getFullYear() + 1).toString().substr(2, 3);
  }
  return fiscalYear;
};

var getURL = function(req) {
  var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  return fullURL;
};

/* GET home page. */
router.get('/', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/layout', { title: 'CDAO Layout', csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/home', { title: 'CDAO Home', csrfToken: req.csrfToken() });
});

router.get('/dashboard', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/dashboard', { title: 'CDAO Dashboard', csrfToken: req.csrfToken() });
});

router.get('/aaoDetailEntry', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/aaodetailentry', { title: 'CDAO Detail Entry', csrfToken: req.csrfToken() });
});

router.get('/aaoDetails', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/aaodetails', { title: 'CDAO AAO Details', csrfToken: req.csrfToken() });
});

router.get('/vawDetails', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/vawdetails', { title: 'CDAO VAW Details', csrfToken: req.csrfToken() });
});

router.get('/vawGPTargetDetails', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/vawgptargetdetails', { title: 'CDAO VAW GP Target Details', csrfToken: req.csrfToken() });
});

router.get('/viewModifyPestDetails', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/viewmodifypestdetails', { title: 'CDAO View Modify Pest Details', csrfToken: req.csrfToken() });
});

router.get('/viewPestDetails', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/viewpestdetails', { title: 'CDAO View Pest Details', csrfToken: req.csrfToken() });
});

router.get('/lighTtrapCatchReport', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/lighttrapcatchreport', { title: 'CDAO Light Trap Catch Report', csrfToken: req.csrfToken() });
});

router.get('/vawInspectionReport', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/vawinspectionreport', { title: 'CDAO VAW Inspection Report', csrfToken: req.csrfToken() });
});

router.get('/emergencyCaseReport', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/emergencycasereport', { title: 'CDAO Emergency Case Report', csrfToken: req.csrfToken() });
});

router.get('/complianceReport', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('cdao/compliancereport', { title: 'CDAO Compliance Report', csrfToken: req.csrfToken() });
});

router.get('/changePassword', csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('cdao/changepassword', { title: 'CDAO Change Password', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/changePassword', parseForm, csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getUserDetails(req.session.username).then(function success(response) {
    if (response.length === 0) {
      balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
      res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Invalid Username or Password' });
    }
    else if (response[0].Status !== true) {
      balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
      res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Invalid Username' });
    }
    else {
      balModule.getPasswordHistory(req.session.username).then(function success(response1) {
        var objP = req.body.data;
        if (response1.length > 0) {
          var found = response1.some(function(i) {
            return i.OldPassword === objP.NewPassword;
          });
        }
        if (!found || response1.length == 0) {
          var pwdHash = response[0].PasswordHash;
          var pwdRNo = sha256(pwdHash + req.session.RandomNo);
          if (objP.NewPassword === objP.ConfirmPassword) {
            if (pwdRNo === objP.OldPassword) {
              balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'UPDATE / INSERT', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
              delete objP.OldPassword; delete objP.ConfirmPassword;
              objP.UserID = req.session.username;
              objP.Status = 1;
              objP.IPAddress = req.connection.remoteAddress;
              objP.FinancialYear = getFinancialYear();
              balModule.changePasssword(objP, function (response1) {
                res.sendStatus(response1 > 0 ? 200 : 500);
              }, function error(response1) {
                console.log(response1.status);
              });
            }
            else {
              balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
              res.send('The entered Old Password is incorrect.');
            }
          }
          else {
            balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
            alert('The New Password and Confirm Password do not match.');
          }
        }
        else {
          balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
          res.send('This password is already used. Please try a new one.');
        }
      }, function error(response) {
        console.log(response.status);
      }).catch(function err(error) {
        console.log('An error occurred...', error);
      });
    }
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/logout', function (req, res, next) {
  if (req.session.username != undefined) {
    balModule.updateIsLoggedIn(0, req.session.username, function success(response) { }, function error(response) { console.log(response.status); });
  }
  req.session.destroy();
  res.get('X-Frame-Options');
  res.redirect('../login');
});

router.get('/getDistrict', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  balModule.getDistrict(username).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getBlocks', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  balModule.getBlocks(username).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/registerAAOs', parseForm, csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/registerAAOs', 'INSERT / UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arrData = req.body.data.arrData;
  var encrypted = null;
  for (var i = 0; i < arrData.length; i++) {
    if (arrData[i].AAOAadhaarNo != null) {
      var decodedAAN = atob(arrData[i].AAOAadhaarNo);
      var cipher = crypto.createCipher('aes-256-cbc', 'aadhaar number passphrase key ed');
      encrypted = cipher.update(decodedAAN, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      // var cipher = crypto.createDecipher('aes-256-cbc', 'aadhaar number passphrase key ed');
      // var decrypted = cipher.update(encrypted, 'base64', 'utf8');
      // decrypted += cipher.final('utf8');
    }
    arrData[i].AAOAadhaarNo = encrypted;
    arrData[i].CDAOUserID = req.session.username;
    arrData[i].Status = 1;
    arrData[i].IPAddress = req.connection.remoteAddress;
    arrData[i].FinancialYear = getFinancialYear();
    arrData[i].AAOEmailID = null;
    arrData[i].AAOSignature = null;
  }
  var userData = req.body.data.userData;
  for (var j = 0; j < userData.length; j++) {
    userData[j].PasswordHash = sha256('Test@1234'),
    userData[j].EmailID = null,
    userData[j].LockOutEnabled = 1,
    userData[j].AccessFailedCount = 0,
    userData[j].Status = 1,
    userData[j].IPAddress = req.connection.remoteAddress,
    userData[j].FinancialYear = getFinancialYear()
  }
  balModule.checkMobileNo(arrData[0].AAOMobileNo).then(function success(response) {
    if (response.length == 0) {
      balModule.registerAAO(arrData, userData, function(response1) {
        var bn = []; var un = [];
        for (var i = 0; i < userData.length; i++) {
          un.push(userData[i].UserID);
          bn.push(userData[i].BlockName);
        }
        var blockName = bn.join(', ');
        var username = un.join(', ');
        var mobileNo = userData[0].ContactNo;
        var sms = 'e-Pest - You have been registered under the block(s) ' + blockName + ' with User ID(s) ' + username + ' respectively.';
        SendSMS(mobileNo, sms, function() {
          res.sendStatus(response1 > 1 ? 200 : 500);
        });
      }, function error(response1) {
        console.log(response1.status);
      });
    }
    else {
      res.send('This Mobile No. is already registered against another AAO Code.');
    }
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getRegisteredAAOs', function(req, res, next) {
  res.get('X-Frame-Options');
  var cdaoUserID = req.session.username;
  balModule.getRegisteredAAOs(cdaoUserID).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/removeAAO', parseForm, csrfProtection, permit.permission('CDAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeAAO', 'DELETE / INSERT / UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var aaoCode = req.body.data.AAOCode;
  var blockCode = req.body.data.BlockCode;
  balModule.removeAAO(aaoCode, blockCode, function success(response1) {
    var sms = 'e-Pest - You have been unregistered from the block ' + response1[0].BlockName + '.';
    SendSMS(response1[0].AAOMobileNo, sms, function() {
      res.send(response1);
    });
  }, function error(response1) {
    console.log(response1.status);
  });
});

function SendSMS(mobileNo, sms, callback) {
  var encodeSMS = encodeURI(sms);
  request('http://www.apicol.nic.in/Registration/EPestSMS?mobileNo=' + mobileNo + '&sms=' + encodeSMS, { json: true }, (err, res, body) => {
    if (err) { 
      console.log(err);
    }
    else {
      callback();
    }
  });
};

router.get('/getAAODetailsReport', function(req, res, next) {
  res.get('X-Frame-Options');
  var cdaoUserID = req.session.username;
  balModule.getAAODetailsReport(cdaoUserID).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getBlocksByDistrict', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  balModule.getBlocksByDistrict(username).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVAWDetailsReport', function(req, res, next) {
  res.get('X-Frame-Options');
  var cdaoUserID = req.session.username;
  var blockCode = req.query.blockCode;
  balModule.getVAWDetailsReport(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVAWDPTargets', function(req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.query.blockCode;
  balModule.getVAWDPTargets(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getDashboardDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var cdaoUserID = req.session.username;
  balModule.getDashboardDetails(cdaoUserID, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getCropCategories', function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.getCropCategories().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getCropsByCategory', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCategoryCode = req.query.cropCategoryCode;
  balModule.getCropsByCategory(cropCategoryCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getAllPestDiseases', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  balModule.getAllPestDiseases(cropCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getPestDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  var role = req.session.role;
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var blockCode = req.query.blockCode;
  var cropCategoryCode = req.query.cropCategoryCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  balModule.getPestDetails(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, username, role, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.post('/updatePDE', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updatePDE', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var dt = new Date();
  var d = dt.getDay();
  var HH = dt.getHours();
  if (!(d == 5 && HH >= 12 && HH <= 16)) {
    res.send('You are only allowed to modify details on Friday between 12 pm to 4 pm.');
  }
  else {
    var cdaoUserID = req.session.username;
    var objData = req.body.data.obj;
    var arrData = req.body.data.arr;
    objData.CDAOUserID = cdaoUserID;
    for (var i = 0; i < arrData.length; i++) {
      arrData[i].AAOStatus = 1;
      arrData[i].Status = 1;
      arrData[i].IPAddress = req.connection.remoteAddress;
      arrData[i].FinancialYear = getFinancialYear();
    }
    balModule.updatePDE(objData, arrData, function(response1) {
      res.sendStatus(response1 > 0 ? 200 : 500);
    }, function error(response1) {
      console.log(response1.status);
    });
  }
});

router.get('/getBlocksByCDAO', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  balModule.getBlocksByCDAO(username).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getCDAOPestDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  var role = req.session.role;
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var blockCode = req.query.blockCode;
  var cropCategoryCode = req.query.cropCategoryCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  var userType = req.query.userType;
  balModule.getCDAOPestDetails(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getLTCCrops', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getLTCCrops().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getLTCPestDiseases', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  balModule.getLTCPestDiseases(cropCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getLTCDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var username = req.session.username;
  var blockCode = req.query.blockCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  balModule.getLTCDetails(dateOfEntry, season, financialYear, blockCode, cropCode, pestDiseaseCode, username, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getVAWInspectionDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var username = req.session.username;
  var blockCode = req.query.blockCode;
  balModule.getVAWInspectionDetails(dateOfEntry, season, financialYear, username, blockCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getCD', function (req, res, next) {
  res.get('X-Frame-Options');
  var referenceNo = req.query.referenceNo;
  balModule.getCD(referenceNo).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getPLD', function (req, res, next) {
  res.get('X-Frame-Options');
  var referenceNo = req.query.referenceNo;
  balModule.getPLD(referenceNo).then(function success(response) {
    var flp = Buffer.from(response[0].FixedLandPhoto, 'binary').toString('base64');
    if (response[0].RandomLandPhoto1 != null) {
      var rlp1 = Buffer.from(response[0].RandomLandPhoto1, 'binary').toString('base64');
    }
    else {
      var rlp1 = null;
    }
    if (response[0].RandomLandPhoto2 != null) {
      var rlp2 = Buffer.from(response[0].RandomLandPhoto2, 'binary').toString('base64');
    }
    else {
      var rlp2 = null;
    }
    delete response[0].FixedLandPhoto; delete response[0].RandomLandPhoto1; delete response[0].RandomLandPhoto2;
    response[0].FLP = flp; response[0].RLP1 = rlp1; response[0].RLP2 = rlp2;
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getPD', function (req, res, next) {
  res.get('X-Frame-Options');
  var referenceNo = req.query.referenceNo;
  balModule.getPD(referenceNo).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getEMRNosForCDAO', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var cropCategory = req.query.cropCategory;
  var crop = req.query.crop;
  var financialYear = req.query.financialYear;
  var username = req.session.username;
  var blockCode = req.query.blockCode;
  balModule.getEMRNosForCDAO(dateOfEntry, cropCategory, crop, financialYear, username, blockCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getEMRReferenceNoDetailsCDAO', function(req, res, next) {
  res.get('X-Frame-Options');
  var emrRefNo = req.query.emrRefNo;
  balModule.getEMRReferenceNoDetailsCDAO(emrRefNo).then(function success(response) {
    var flp = Buffer.from(response[0].FixedLandPhoto, 'binary').toString('base64');
    if (response[0].RandomLandPhoto1 != null) {
      var rlp1 = Buffer.from(response[0].RandomLandPhoto1, 'binary').toString('base64');
    }
    else {
      var rlp1 = null;
    }
    if (response[0].RandomLandPhoto2 != null) {
      var rlp2 = Buffer.from(response[0].RandomLandPhoto2, 'binary').toString('base64');
    }
    else {
      var rlp2 = null;
    }
    delete response[0].FixedLandPhoto; delete response[0].RandomLandPhoto1; delete response[0].RandomLandPhoto2;
    response[0].FLP = flp; response[0].RLP1 = rlp1; response[0].RLP2 = rlp2;
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getComplianceReport', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var userType = req.session.role;
  var userName = req.session.username;
  var financialYear = req.query.financialYear;
  balModule.getComplianceReport(dateOfEntry, season,userType, userName, financialYear, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getTargetedGP', function (req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.query.blockCode;
  var season = req.query.season;
  balModule.getTargetedGP(blockCode, season).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getSurveyGP', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var blockCode = req.query.blockCode;
  var season = req.query.season;
  balModule.getSurveyGP(dateOfEntry, blockCode, season, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

module.exports = router;
