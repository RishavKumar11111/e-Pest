var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var balModule = require('../models/ouatBALModule');
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

/* GET home page. */
router.get('/', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/layout', { title: 'OUAT Layout', csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/home', { title: 'OUAT Home', csrfToken: req.csrfToken() });
});

router.get('/dashboard', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/dashboard', { title: 'OUAT Dashboard', csrfToken: req.csrfToken() });
});

router.get('/emergencyCase', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/emergencycase', { title: 'OUAT Emergency Case', csrfToken: req.csrfToken() });
});

router.get('/dashboardOUAT', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/dashboardouat', { title: 'OUAT Dashboard', csrfToken: req.csrfToken() });
});

router.get('/viewPestDetails', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/viewpestdetails', { title: 'OUAT View Pest Details', csrfToken: req.csrfToken() });
});

router.get('/vawInspectionReport', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/vawinspectionreport', { title: 'OUAT VAW Inspection Report', csrfToken: req.csrfToken() });
});

router.get('/lightTrapCatchReport', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/lighttrapcatchreport', { title: 'OUAT Light Trap Catch Report', csrfToken: req.csrfToken() });
});

router.get('/generalAdvisoryEntry', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/generaladvisoryentry', { title: 'OUAT General Advisory Entry', csrfToken: req.csrfToken() });
});

router.get('/emergencyCaseReport', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('ouat/emergencycasereport', { title: 'OUAT Emergency Case Report', csrfToken: req.csrfToken() });
});

router.get('/changePassword', csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('ouat/changepassword', { title: 'OUAT Change Password', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/changePassword', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
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
          var found = response1.some(function (i) {
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

router.get('/getCropsByCategory', function (req, res, next) {
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

router.get('/getRefNoDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  var season = req.query.season;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  var intensityType = req.query.intensityType;
  balModule.getRefNoDetails(cropCode, season, pestDiseaseCode, intensityType, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.post('/removeRefNo', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeRefNo', 'UPDATE', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
  var referenceNo = req.body.data;
  balModule.removeRefNo(referenceNo, function success(response1) {
    res.send(referenceNo);
  }, function error(response1) {
    console.log(response1.status);
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

router.get('/getPestDiseases', function (req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  balModule.getPestDiseases(cropCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getPestPopulation', function (req, res, next) {
  res.get('X-Frame-Options');
  var pestCode = req.query.pestCode;
  balModule.getPestPopulation(pestCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getPesticide', function (req, res, next) {
  res.get('X-Frame-Options');
  var pestCode = req.query.pestCode;
  balModule.getPesticide(pestCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/updatePestDetails', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updatePestDetails', 'INSERT / UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.OUATUserID = req.session.username;
  obj.OUATStatus = 0;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.updatePestDetails(obj, function (response1) {
    if (response1 == 1) {
      res.status(200).send((obj.ReferenceNo).toString());
    }
    else {
      res.status(500).send(('An error occurred...').toString());
    }
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.post('/updateMADetails', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updateMADetails', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data.refNos;
  var obj = req.body.data.pestData;
  obj.OUATUserID = req.session.username;
  obj.OUATStatus = 0;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.updateMADetails(arr, obj, function (response1) {
    res.send(response1.toString());
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.post('/submitDetails', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitDetails', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data;
  for (var i = 0; i < arr.length; i++) {
    arr[i].OUATUserID = req.session.username;
    arr[i].OUATStatus = 1;
    arr[i].Status = 1;
    arr[i].IPAddress = req.connection.remoteAddress;
    arr[i].FinancialYear = getFinancialYear();
  }
  balModule.submitDetails(arr, function (response1) {
    res.send(response1.toString());
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getDashboardDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var sq = null; if (req.query.hasOwnProperty('season')) sq = req.query.season.charAt(0);
  var season = getSeasonShort() == sq ? getSeasonShort() : sq;
  var fnq = null; if (req.query.hasOwnProperty('financialYear')) fnq = req.query.financialYear;
  var financialYear = getFinancialYear() == fnq ? getFinancialYear() : fnq;
  balModule.getDashboardDetails(season, financialYear, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getDistricts', function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.getDistricts().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getBlocksByDistrict', function (req, res, next) {
  res.get('X-Frame-Options');
  var districtCode = req.query.districtCode;
  balModule.getBlocksByDistrict(districtCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getPestDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  var role = req.session.role;
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  var districtCode = req.query.districtCode;
  var blockCode = req.query.blockCode;
  var cropCategoryCode = req.query.cropCategoryCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  var userType = req.query.userType;
  balModule.getPestDetails(dateOfEntry, season, financialYear, districtCode, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getLTCCrops', function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.getLTCCrops().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getLTCPestDiseases', function (req, res, next) {
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
  var districtCode = req.query.districtCode;
  var blockCode = req.query.blockCode;
  var cropCode = req.query.cropCode;
  var pestDiseaseCode = req.query.pestDiseaseCode;
  balModule.getLTCDetails(dateOfEntry, season, financialYear, districtCode, blockCode, cropCode, pestDiseaseCode, function success(response) {
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
  var districtCode = req.query.districtCode;
  var blockCode = req.query.blockCode;
  balModule.getVAWInspectionDetails(dateOfEntry, season, financialYear, districtCode, blockCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getEMRRefNos', function (req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  balModule.getEMRRefNos(cropCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getEMRRefNoDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var refNo = req.query.refNo;
  balModule.getEMRRefNoDetails(refNo).then(function success(response) {
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

router.post('/submitEMRDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var ouatUserID = req.session.username;
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitEMRDetails', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.OUATUserID = ouatUserID;
  obj.OUATStatus = 1;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.submitEMRDetails(obj, function (response1) {
    if (response1 == true) {
      if (obj.InfectionIdentified == 'Yes') {
        SendSMS(obj, function () {
          res.status(200).send((obj.EMRReferenceNo).toString());
        });
      }
      else {
        res.status(200).send((obj.EMRReferenceNo).toString());
      }
    }
    else {
      res.status(500).send(('An error occurred...').toString());
    }
  }, function error(response1) {
    console.log(response1.status);
  });
});

function SendSMS(obj, callback) {
  var mobileNo = obj.MobileNo;
  var moderateAdvisory = (obj.AdvisoryModerate != null) ? obj.AdvisoryModerate : 'NA';
  var highAdvisory = (obj.AdvisoryHigh != null) ? obj.AdvisoryHigh : 'NA';
  var sms = 'e-Pest - OUAT Emergency Advisory : (Moderate - ' + moderateAdvisory + ', High - ' + highAdvisory + ')';
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

router.get('/getEMRNos', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var cropCategory = req.query.cropCategory;
  var crop = req.query.crop;
  var financialYear = req.query.financialYear;
  var districtCode = req.query.districtCode;
  var blockCode = req.query.blockCode;
  balModule.getEMRNos(dateOfEntry, cropCategory, crop, financialYear, districtCode, blockCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getEMRReferenceNoDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var emrRefNo = req.query.emrRefNo;
  balModule.getEMRReferenceNoDetails(emrRefNo).then(function success(response) {
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

router.get('/getGraphforCrop', function (req, res, next) {
  res.get('X-Frame-Options');
  var sq = null; if (req.query.hasOwnProperty('season')) sq = req.query.season.charAt(0);
  var season = getSeasonShort() == sq ? getSeasonShort() : sq;
  var fnq = null; if (req.query.hasOwnProperty('financialYear')) fnq = req.query.financialYear;
  var financialYear = getFinancialYear() == fnq ? getFinancialYear() : fnq;
  balModule.getGraphforCrop(season, financialYear).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getCropDetailsCategory', function (req, res, next) {
  res.get('X-Frame-Options');
  var sq = null; if (req.query.hasOwnProperty('season')) sq = req.query.season.charAt(0);
  var season = getSeasonShort() == sq ? getSeasonShort() : sq;
  var fnq = null; if (req.query.hasOwnProperty('financialYear')) fnq = req.query.financialYear;
  var financialYear = getFinancialYear() == fnq ? getFinancialYear() : fnq;
  var cropCategoryCode = req.query.cropCode;
  balModule.getCropDetailsCategory(season, financialYear, cropCategoryCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

var getSeasonShort = function () {
  var seasonName;
  var month = new Date().getMonth();
  if (month >= 6 && month <= 10) {
    seasonName = 'K';
  }
  else {
    seasonName = 'R';
  }
  return seasonName;
};

router.post('/getPestGraphData', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/getPestGraphData', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data.pestData;
  var month = req.body.data.month;
  var sq = null; if (req.body.data.hasOwnProperty('season')) sq = req.body.data.season.charAt(0);
  var season = getSeasonShort() == sq ? getSeasonShort() : sq;
  var fnq = null; if (req.body.data.hasOwnProperty('financialYear')) fnq = req.body.data.financialYear;
  var financialYear = getFinancialYear() == fnq ? getFinancialYear() : fnq;
  balModule.getPestGraphData(arr, month, season, financialYear, function success(response1) {
    res.send(response1);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getGeneralPestDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  balModule.getGeneralPestDetails(dateOfEntry, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.post('/submitGeneralAdvisory', parseForm, csrfProtection, permit.permission('OUAT'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitGeneralAdvisory', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.IPAddress = req.connection.remoteAddress;
  balModule.submitGeneralAdvisory(obj, function success(response1) {
    res.send('OK');
  }, function error(response1) {
    console.log(response1.status);
  });
});

module.exports = router;
