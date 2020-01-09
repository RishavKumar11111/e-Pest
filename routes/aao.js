var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var balModule = require('../models/aaoBALModule');
var atob = require('atob');
var crypto = require('crypto');
var sha256 = require('js-sha256');
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

var getCurrentDateTime = function () {
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

var getCurrentDate = function () {
  var today = new Date();
  var dd = today.getDate();
  var MM = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (MM < 10) {
    MM = '0' + MM;
  }
  
  var currentDate = yyyy + '-' + MM + '-' + dd;
  return currentDate;
};

var getYesterdayDate = function () {
  var yd = new Date();
 	yd.setDate(yd.getDate() - 1);
  var dd = yd.getDate();
  var MM = yd.getMonth() + 1;
  var yyyy = yd.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (MM < 10) {
    MM = '0' + MM;
  }
  var yesterdayDate = yyyy + '-' + MM + '-' + dd;
  return yesterdayDate;
};

var getDateTime = function () {
  var dateTime = require('node-datetime');
  var dt = dateTime.create().format('Y-m-d H:M:S.N');
  var date = new Date(dt);
  var userTimezone = date.getTimezoneOffset() * 60000;
  var currentDate = new Date(date.getTime() - userTimezone);
  return currentDate;
};

var getFinancialYear = function () {
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

var getURL = function (req) {
  var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  return fullURL;
};

var getSeason = function () {
  var seasonName;
  var month = new Date().getMonth();
  if (month >= 6 && month <= 10) {
    seasonName = 'Kharif';
  }
  else {
    seasonName = 'Rabi';
  }
  return seasonName;
};

/* GET home page. */
router.get('/', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/layout', { title: 'AAO Layout', csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/home', { title: 'AAO Home', csrfToken: req.csrfToken() });
});

router.get('/dashboard', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/dashboard', { title: 'AAO Dashboard', csrfToken: req.csrfToken() });
});

router.get('/pestDetailsEntry', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/pestdetailsentry', { title: 'Pest Details Entry', csrfToken: req.csrfToken() });
});

router.get('/lightTrapCatch', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/lighttrapcatch', { title: 'Light Trap Catch', csrfToken: req.csrfToken() });
});

router.get('/vawDetailEntry', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/vawdetailentry', { title: 'VAW Detail Entry', csrfToken: req.csrfToken() });
});

router.get('/vawEPestGPTargets', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/vawepestgptargets', { title: 'VAW GP Targets (e-Pest)', csrfToken: req.csrfToken() });
});

router.get('/removeRecords', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/removerecords', { title: 'AAO Remove Records', csrfToken: req.csrfToken() });
});

router.get('/vawDetails', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/vawdetails', { title: 'AAO VAW Details', csrfToken: req.csrfToken() });
});

router.get('/vawGPTargetDetails', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/vawgptargetdetails', { title: 'AAO VAW GP Target Details', csrfToken: req.csrfToken() });
});

router.get('/viewPestDetails', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/viewpestdetails', { title: 'View Pest Details', csrfToken: req.csrfToken() });
});

router.get('/vawInspectionReport', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/vawinspectionreport', { title: 'VAW Inspection Report', csrfToken: req.csrfToken() });
});

router.get('/lightTrapCatchReport', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/lighttrapcatchreport', { title: 'Light Trap Catch Report', csrfToken: req.csrfToken() });
});

router.get('/emergencyCaseReport', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('aao/emergencycasereport', { title: 'AAO Emergency Case Report', csrfToken: req.csrfToken() });
});

router.get('/changePassword', csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('aao/changepassword', { title: 'AAO Change Password', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/changePassword', parseForm, csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
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

router.get('/getBlock', function (req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.session.username.substr(4, 8);
  balModule.getBlock(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getGPs', function (req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.session.username.substr(4, 8);
  balModule.getGPs(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/registerVAWs', parseForm, csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/registerVAWs', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  balModule.getVAWsCount().then(function success(response) {
    var vawCode = 'VAW_' + (response[0].VAWCount + 1).toString();
    var blockCode = req.session.username.substr(4, 8);
    var aaoCode = req.session.username;
    var arrData = req.body.data;
    var encrypted = null;
    for (var i = 0; i < arrData.length; i++) {
      if (arrData[i].VAWAadhaarNo != null) {
        var decodedVAN = atob(arrData[i].VAWAadhaarNo);
        var cipher = crypto.createCipher('aes-256-cbc', 'aadhaar number passphrase key ed');
        encrypted = cipher.update(decodedVAN, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        // var cipher = crypto.createDecipher('aes-256-cbc', 'aadhaar number passphrase key ed');
        // var decrypted = cipher.update(encrypted, 'base64', 'utf8')
        // decrypted += cipher.final('utf8');
      }
      arrData[i].VAWAadhaarNo = encrypted;
      arrData[i].VAWCode = vawCode;
      arrData[i].AAOCode = aaoCode;
      arrData[i].BlockCode = blockCode;
      arrData[i].Status = 1;
      arrData[i].IPAddress = req.connection.remoteAddress;
      arrData[i].FinancialYear = getFinancialYear();
      arrData[i].VAWEmailID = null;
      arrData[i].VAWSignature = null;
    }
    var obj = {
      UserID: vawCode,
      PasswordHash: sha256('Test@1234'),
      RoleID: 'Role-1',
      ContactNo: arrData[0].VAWMobileNo,
      EmailID: null,
      LockOutEnabled: 1,
      AccessFailedCount: 0,
      Status: 1,
      IPAddress: req.connection.remoteAddress,
      FinancialYear: getFinancialYear()
    };
    balModule.checkMobileNo(arrData[0].VAWMobileNo).then(function success(response) {
      if (response.length == 0) {
        balModule.registerVAW(obj, arrData, function (response1) {
          var gn = [];
          for (var i = 0; i < arrData.length; i++) {
            gn.push(arrData[i].GPName);
          }
          var gpName = gn.join(', ');
          var mobileNo = obj.ContactNo;
          var sms = 'e-Pest - You have been registered under the GP(s) ' + gpName + ' with User ID ' + vawCode + '.';
          SendSMS(mobileNo, sms, function() {
            res.sendStatus(response1 == 1 ? 200 : 500);
          });
        }, function error(response1) {
          console.log(response1.status);
        });
      }
      else {
        res.send('This Mobile No. is already registered against another VAW Code.');
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

router.get('/getRegisteredVAWs', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  balModule.getRegisteredVAWs(aaoCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getRegisteredVAWDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var vawCode = req.query.vawCode;
  balModule.getVAWDetails(vawCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/removeVAW', parseForm, csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeVAW', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var vawCode = req.body.data.VAWCode;
  var gpCode = req.body.data.GPCode;
  var season = getSeason().charAt(0);
  var ipAddress = req.connection.remoteAddress;
  var financialYear = getFinancialYear();
  balModule.removeVAW(vawCode, gpCode, season, ipAddress, financialYear, function success(response1) {
    var sms = 'e-Pest - You have been unregistered from the GP ' + response1[0].GPName + '.';
    SendSMS(response1[0].VAWMobileNo, sms, function() {
      res.send(response1);
    });
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getUnallocatedGPs', function (req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.session.username.substr(4, 8);
  balModule.getUnallocatedGPs(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getAllRegisteredVAWs', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  balModule.getAllRegisteredVAWs(aaoCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/assignVAWs', parseForm, csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/assignVAWs', 'INSERT / UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var objData = req.body.data.vawDetails;
  var arrData = req.body.data.gpDetails;
  var vawCode = arrData[0].VAWCode;
  balModule.getVAWDetails(vawCode).then(function success(response) {
    for (var i = 0; i < arrData.length; i++) {
      if (Object.entries(objData).length === 0 && objData.constructor === Object) {
        arrData[i].VAWName = response[0].VAWName;
        arrData[i].VAWMobileNo = response[0].VAWMobileNo;
        arrData[i].VAWAadhaarNo = response[0].VAWAadhaarNo;
      }
      else {
        arrData[i].VAWName = objData.VAWName;
        arrData[i].VAWMobileNo = objData.VAWMobileNo;
        var encrypted = null;
        if (objData.VAWAadhaarNo != null) {
          var decodedMVAN = atob(objData.VAWAadhaarNo);
          var cipher = crypto.createCipher('aes-256-cbc', 'aadhaar number passphrase key ed');
          encrypted = cipher.update(decodedMVAN, 'utf8', 'base64');
          encrypted += cipher.final('base64');
          // var cipher = crypto.createDecipher('aes-256-cbc', 'aadhaar number passphrase key ed');
          // var decrypted = cipher.update(encrypted, 'base64', 'utf8');
          // decrypted += cipher.final('utf8');
        }
      }
      arrData[i].VAWAadhaarNo = encrypted;
      arrData[i].AAOCode = response[0].AAOCode;
      arrData[i].BlockCode = response[0].BlockCode;
      arrData[i].Status = 1;
      arrData[i].IPAddress = req.connection.remoteAddress;
      arrData[i].FinancialYear = getFinancialYear();
      arrData[i].VAWEmailID = null;
      arrData[i].VAWSignature = null;
    }
    balModule.checkDupMobileNo(arrData[0].VAWMobileNo, arrData[0].VAWCode).then(function success(response) {
      if (response.length == 0) {
        balModule.assignVAWs(arrData, function (response1) {
          var gn = [];
          for (var i = 0; i < arrData.length; i++) {
            gn.push(arrData[i].GPName);
          }
          var gpName = gn.join(', ');
          var mobileNo = arrData[0].VAWMobileNo;
          var sms = 'e-Pest - You have been assigned for the GP(s) ' + gpName + ' with User ID ' + vawCode + '.';
          SendSMS(mobileNo, sms, function() {
            res.sendStatus(response1 > 0 ? 200 : 500);
          });
        }, function error(response1) {
          console.log(response1.status);
        });
      }
      else {
        res.send('This Mobile No. is already registered against another VAW Code.');
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

router.get('/getAllocatedGPsVAWs', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  var season = getSeason().charAt(0);
  var financialYear = getFinancialYear();
  balModule.getAllocatedGPsVAWs(aaoCode, season, financialYear).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/allocateGPsVAWs', parseForm, csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/allocateGPsVAWs', 'INSERT / DELETE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arrData = req.body.data;
  var season = getSeason().charAt(0);
  for (var i = 0; i < arrData.length; i++) {
    arrData[i].Season = season;
    arrData[i].Status = 1;
    arrData[i].IPAddress = req.connection.remoteAddress;
    arrData[i].FinancialYear = getFinancialYear();
  }
  balModule.allocateGPsVAWs(arrData, function (response1) {
    var gn = [];
    for (var i = 0; i < arrData.length; i++) {
      gn.push(arrData[i].GPName);
    }
    var gpName = gn.join(', ');
    var mobileNo = response1.VAWMobileNo;
    var sms = 'e-Pest - You have been allocated under the GP(s) ' + gpName + ' with User ID ' + arrData[0].VAWCode + ' in e-Pest.';
    SendSMS(mobileNo, sms, function() {
      res.sendStatus(response1 != null ? 200 : 500);
    });
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getReferenceNos', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  balModule.getReferenceNos(aaoCode, function success(response) {
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

router.post('/removeRefNo', parseForm, csrfProtection, permit.permission('AAO'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeRefNo', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var referenceNo = req.body.data;
  balModule.removeRefNo(referenceNo, function success(response1) {
    res.send(referenceNo);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getLTCGPs', function (req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.session.username.substr(4, 8);
  balModule.getLTCGPs(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getCrops', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getCrops().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getPestDiseases', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  balModule.getPestDiseases(cropCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/submitAAOLTC', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitAAOLTC', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.CropCode = (obj.CC != 3) ? obj.CC : null;
  obj.Season = getSeason().charAt(0);
  obj.AAOCode = req.session.username;
  obj.BlockCode = req.session.username.substr(4, 8);
  obj.AAOStatus = 1;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  delete obj.CC;
  balModule.checkLTC(getCurrentDate(), getSeason().charAt(0), getFinancialYear(), obj.GPCode, obj.PestDiseaseCode, req.session.username).then(function success(response) {
    if (response.length == 0) {
      balModule.submitAAOLTC(obj, function(response1) {
        res.send(response1 == true ? 'The Light Trap Catch details are successfully submitted.' : 'Error');
      }, function error(response1) {
        console.log(response1.status);
      });
    }
    else {
      res.send('Light Trap Catch data has been entered for this Pest in this GP today.');
    }
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getLTCDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  balModule.getLTCDetails(aaoCode, dateOfEntry, season, financialYear).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
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

router.post('/submitAAOPDE', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitAAOPDE', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var dt = new Date();
  var d = dt.getDay();
  var HH = dt.getHours();
  if (!((d == 4 && HH >= 12) || (d == 5 && HH <= 12))) {
    res.send('You are only allowed to enter details on Thursday or Friday.');
  }
  else {
    var arrData = req.body.data;
    for (var i = 0; i < arrData.length; i++) {
      arrData[i].Season = getSeason().charAt(0);
      arrData[i].AAOCode = req.session.username;
      arrData[i].BlockCode = req.session.username.substr(4, 8);
      arrData[i].AAOStatus = 1;
      arrData[i].Status = 1;
      arrData[i].IPAddress = req.connection.remoteAddress;
      arrData[i].FinancialYear = getFinancialYear();
    }
    balModule.getPDs(getCurrentDate(), getYesterdayDate(), getSeason().charAt(0), getFinancialYear(), arrData[0].CropCategoryCode, arrData[0].CropCode, arrData[0].PestDiseaseCode, req.session.username).then(function success(response) {
      if (response.length == 0) {
        balModule.submitAAOPDE(arrData, function(response1) {
          res.sendStatus(response1 > 0 ? 200 : 500);
        }, function error(response1) {
          console.log(response1.status);
        });
      }
      else {
        res.send('Pest details entry has already been done against the selected pest.');
      }
    }, function error(response) {
      console.log(response.status);
    }).catch(function err(error) {
      console.log('An error occurred...', error);
    });
  }
});

router.get('/getPestDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var blockCode = req.session.username.substr(4, 8);
  var cropCategoryCode = req.query.cropCategoryCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  var aaoCode = req.session.username;
  var role = req.session.role;
  balModule.getPestDetails(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, aaoCode, role, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getDashboardDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  balModule.getDashboardDetails(aaoCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
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

router.get('/getVAWDetails1', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  balModule.getVAWDetails1(aaoCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVAWGPTargets', function (req, res, next) {
  res.get('X-Frame-Options');
  var aaoCode = req.session.username;
  balModule.getVAWGPTargets(aaoCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getAAOPestDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  var role = req.session.role;
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var cropCategoryCode = req.query.cropCategoryCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  var userType = req.query.userType;
  balModule.getAAOPestDetails(dateOfEntry, season, financialYear, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getLTCReportDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var username = req.session.username;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  balModule.getLTCReportDetails(dateOfEntry, season, financialYear, cropCode, pestDiseaseCode,username, function success(response) {
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
  balModule.getVAWInspectionDetails(dateOfEntry, season, financialYear, username, function success(response) {
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

router.get('/getEMRNosForAAO', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var cropCategory = req.query.cropCategory;
  var crop = req.query.crop;
  var financialYear = req.query.financialYear;
  var username = req.session.username;
  balModule.getEMRNosForAAO(dateOfEntry, cropCategory, crop, financialYear, username, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getEMRReferenceNoDetailsAAO', function(req, res, next) {
  res.get('X-Frame-Options');
  var emrRefNo = req.query.emrRefNo;
  balModule.getEMRReferenceNoDetailsAAO(emrRefNo).then(function success(response) {
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

module.exports = router;
