var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var balModule = require('../models/adoAppBALModule');
var crypto = require('crypto');
var sha256 = require('js-sha256');
var csrf = require('csurf');
var csrfProtection = csrf();
var parseForm = bodyParser.urlencoded({ extended: false });
var os = require('os');
var cache = require('cache-headers');
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

var getSeason = function() {
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
router.get('/', cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/layout', { title: 'ADO App Layout' });
});

router.get('/authentication', cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/authentication', { title: 'ADO App Authentication' });
});

router.get('/home',cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/home', { title: 'ADO App Home' });
});

router.get('/dashboard', cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/dashboard', { title: 'ADO App Dashboard' });
});

router.get('/emergencyCase', cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/emergencycase', { title: 'ADO App Emergency Case' });
 });

router.get('/synchronize', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  req.session.RandomNo = randomNumber();
  res.render('adoApp/synchronize', { title: 'ADO App Synchronize', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/synchronize', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  if (req.device.type.toUpperCase() == 'PHONE' || req.device.type.toUpperCase() == 'TABLET') {
    balModule.getUserDetails(req.body.data.unm).then(function success(response) {
      if (response.length === 0) {
        res.send('Invalid Username or Password.');
      }
      else if (response[0].Status !== true) {
        balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/synchronize', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
        res.send('Invalid Username.');
      }
      else {
        var pwdHash = response[0].PasswordHash;
        var pwdRNo = sha256(pwdHash + req.session.RandomNo);
        if (pwdRNo === req.body.data.pwd) {
          if (response[0].AccessFailedCount < 5) {
            balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/synchronize', 'INSERT & / OR SELECT', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
            // var dt = new Date();
            // var d = dt.getDay();
            // if (d == 0 || d == 6) {
            //   res.send('You are only allowed to synchronize on Monday, Tuesday, Wednesday, Thursday & Friday.');
            // }
            // else {
              let tempsession = req.session;
              req.session.regenerate(function(err) {
                Object.assign(req.session, tempsession);
              });
              balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/synchronize', 'INSERT & / OR SELECT', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
              balModule.updateFailedCount(0, response[0].UserID, function success(response) { }, function error(response) { console.log(response.status); });
              balModule.checkCPStatus(response[0].UserID).then(function success(response1) {
                if (response1.length > 0) {
                  req.session.save(function(err) {
                    var pestData = req.body.data.pestData;
                    var refNoBlock = req.body.data.distBlock;
                    var distCode = null;
                    if (refNoBlock.length > 0) {
                      distCode = refNoBlock[0].DistrictCode;
                    }
                    if (pestData.length > 0) {
                      for (var i = 0; i < pestData.length; i++) {
                        pestData[i].Status = 1;
                        pestData[i].IPAddress = req.connection.remoteAddress;
                        pestData[i].FinancialYear = getFinancialYear();
                      }
                    }
                    var adoCode = response[0].UserID;
                    var adoStatus = 1;
                    var existingUserDetails = req.body.data.userDetails;
                    var userLoginDetails = {Username: response[0].UserID, Role: response[0].RoleName };
                    balModule.synchronize(pestData, adoCode, distCode, refNoBlock, adoStatus, existingUserDetails, function success(response) {
                      response.push(userLoginDetails);
                      if (response[3].length > 0) {
                        for (var i = 0; i < response[3].length; i++) {
                          var flp = Buffer.from(response[3][i].FixedLandPhoto, 'binary').toString('base64');
                          if (response[3][i].RandomLandPhoto1 != null) {
                            var rlp1 = Buffer.from(response[3][i].RandomLandPhoto1, 'binary').toString('base64');
                          }
                          else {
                            var rlp1 = null;
                          }
                          if (response[3][i].RandomLandPhoto2 != null) {
                            var rlp2 = Buffer.from(response[3][i].RandomLandPhoto2, 'binary').toString('base64');
                          }
                          else {
                            var rlp2 = null;
                          }
                          delete response[3][i].FixedLandPhoto; delete response[3][i].RandomLandPhoto1; delete response[3][i].RandomLandPhoto2;
                          response[3][i].FLP = flp; response[3][i].RLP1 = rlp1; response[3][i].RLP2 = rlp2;
                        }
                      }
                      if (refNoBlock.length > 0 && pestData.length > 0) {
                        SendSMS(refNoBlock, pestData, function() {
                          res.send(response);
                        });
                      }
                      else {
                        res.send(response);
                      }
                    }, function error(response) {
                      console.log(response.status);
                    });
                  });
                }
                else {
                  req.session.save(function(err) {
                    req.session.destroy();
                    res.send('Please change your password.');
                  });
                }
              }, function error(response) {
                console.log(response.status);
              }).catch(function err(error) {
                console.log('An error occurred...', error);
              });
            // }
          }
          else {
            res.send('Account is locked. Contact Admin.');
          }
        }
        else {
          balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/synchronize', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
          if (response[0].AccessFailedCount < 5) {
            var failedCount = response[0].AccessFailedCount + 1;
            balModule.updateFailedCount(failedCount, response[0].UserID, function success(response) { }, function error(response) { console.log(response.status); });
            res.send('Invalid Username or Password.');
          }
          else {
            res.send('Account is locked. Contact Admin.');
          }
        }
      }
    }, function error(response) {
      console.log(response.status);
    }).catch(function err(error) {
      console.log('An error occurred...', error);
    });
  }
  else {
    res.send('Please use a Phone or a Tablet.');
  }
});

function SendSMS(refNoBlock, pestData, callback) {
  var counter = 0;
  for (var i = 0; i < pestData.length; i++) {
    counter++;
    if (pestData[i].InfectionIdentified == 'Yes') {
      for (var j = 0; j < refNoBlock.length; j++) {
        if (pestData[i].ReferenceNo == refNoBlock[j].ReferenceNo) {
          var mobileNo = refNoBlock[j].MobileNo;
          var moderateAdvisory = (pestData[i].AdvisoryModerate != null) ? pestData[i].AdvisoryModerate : 'NA';
          var highAdvisory = (pestData[i].AdvisoryHigh != null) ? pestData[i].AdvisoryHigh : 'NA';
          var sms = 'e-Pest - ADO Advisory : (Moderate - ' + moderateAdvisory + ', High - ' + highAdvisory + ')';
          var encodeSMS = encodeURI(sms);
          request('http://www.apicol.nic.in/Registration/EPestSMS?mobileNo=' + mobileNo + '&sms=' + encodeSMS, { json: true }, (err, res, body) => {
            if (err) { 
              console.log(err);
            }
          });
        }
      }
    }
    if (pestData.length == counter) {
      callback();
    }
  }
};

router.get('/referenceNoDetails', cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/referencenodetails', { title: 'ADO App Dashboard Reference No. Details' });
});

router.get('/cropDetails', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/cropdetails', { title: 'ADO App Dashboard Crop Details' });
});

router.get('/pestDetails', cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/pestdetails', { title: 'ADO App Dashboard Pest Details' });
});

router.get('/photo', cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/photo', { title: 'ADO App Dashboard Capture Photo' });
});

router.get('/changePassword', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('adoApp/changepassword', { title: 'ADO App Change Password', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/changePassword', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getUserDetails(req.body.data.Username).then(function success(response) {
    if (response.length === 0) {
      res.send('Invalid Username or Password.');
    }
    else if (response[0].Status !== true) {
      balModule.addActivityLog(req.connection.remoteAddress, req.body.data.Username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
      res.render('Invalid Username.');
    }
    else {
      balModule.getPasswordHistory(req.body.data.Username).then(function success(response1) {
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
              balModule.addActivityLog(req.connection.remoteAddress, req.body.data.Username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'UPDATE / INSERT', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
              delete objP.OldPassword; delete objP.ConfirmPassword;
              objP.UserID = req.body.data.Username;
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
              balModule.addActivityLog(req.connection.remoteAddress, req.body.data.Username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
              res.send('The entered Old Password is incorrect.');
            }
          }
          else {
            balModule.addActivityLog(req.connection.remoteAddress, req.body.data.Username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
            alert('The New Password and Confirm Password do not match.');
          }
        }
        else {
          balModule.addActivityLog(req.connection.remoteAddress, req.body.data.Username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/changePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
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

router.get('/offline', cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('adoApp/offline', { title: 'ADO App Offline' });
});

module.exports = router;
