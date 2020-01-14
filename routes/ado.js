var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var balModule = require('../models/adoBALModule');
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
router.get('/', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/layout', { title: 'ADO Layout', csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/home', { title: 'ADO Home', csrfToken: req.csrfToken() });
});

router.get('/dashboard', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/dashboard', { title: 'ADO Dashboard', csrfToken: req.csrfToken() });
});

router.get('/viewPestDetails', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/viewpestdetails', { title: 'ADO View Pest Details', csrfToken: req.csrfToken() });
});

router.get('/emergencyCase', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/emergencycase', { title: 'ADO Emergency Case', csrfToken: req.csrfToken() });
});

router.get('/messageForJDAPP', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/messageforjdapp', { title: 'ADO Message for JDA(PP)', csrfToken: req.csrfToken() });
});

router.get('/aaoDetails', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/aaodetails', { title: 'ADO AAO Details', csrfToken: req.csrfToken() });
});

router.get('/vawDetails', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/vawdetails', { title: 'ADO VAW Details', csrfToken: req.csrfToken() });
});

router.get('/vawGPTargetDetails', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/vawgptargetdetails', { title: 'ADO VAW GP Target Details', csrfToken: req.csrfToken() });
});

router.get('/lighttTrapcatchReport', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/lighttrapcatchreport', { title: 'ADO Light Trap Report', csrfToken: req.csrfToken() });
});

router.get('/vawInspectionReport', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/vawinspectionreport', { title: 'ADO VAW Inspection Report', csrfToken: req.csrfToken() });
});

router.get('/emergencyCaseReport', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/emergencycasereport', { title: 'ADO Emergency Case Report', csrfToken: req.csrfToken() });
});

router.get('/complianceReport', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('ado/compliancereport', { title: 'ADO Compliance Report', csrfToken: req.csrfToken() });
});

router.get('/changePassword', csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('ado/changepassword', { title: 'ADO Change Password', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/changePassword', parseForm, csrfProtection, permit.permission('ADO'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
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

router.get('/getPesticide', function(req, res, next) {
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

router.post('/submitADOEMR', function(req, res, next) {
  res.get('X-Frame-Options');
  var adoCode = req.session.username;
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitADOEMR', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.ADOCode = adoCode;
  obj.ADOStatus = 1;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.submitADOEMR(obj, function(response1) {
    if (response1 == true) {
      if (obj.InfectionIdentified == 'Yes') {
        SendSMS(obj, function() {
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
  var sms = 'e-Pest - ADO Emergency Advisory : (Moderate - ' + moderateAdvisory + ', High - ' + highAdvisory + ')';
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

router.get('/getMessages', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  balModule.getMessages(username).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/submitADOMFJ', function(req, res, next) {
  res.get('X-Frame-Options');
  var adoCode = req.session.username;
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitADOMFJ', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  balModule.getADODistBlock(adoCode).then(function success(response) {
    var obj = req.body.data;
    obj.ADOCode = adoCode;
    obj.DistrictCode = response[0].DistrictCode;
    obj.BlockCode = response[0].BlockCode;
    obj.Status = 1;
    obj.IPAddress = req.connection.remoteAddress;
    obj.FinancialYear = getFinancialYear();
    balModule.submitADOMFJ(obj, function(response1) {
      var sms = 'e-Pest - ADO Emergency Message : ' + obj.Message;
      var encodeSMS = encodeURI(sms);
      request('http://www.apicol.nic.in/Registration/EPestSMS?mobileNo=' + 9438082076 + '&sms=' + encodeSMS, { json: true }, (err, res1, body) => {
        if (err) { 
          console.log(err);
        }
        else {
          res.sendStatus(response1 == true ? 200 : 500);
        }
      });
    }, function error(response1) {
      console.log(response1.status);
    });
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

router.get('/getAAODetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var adoCode = req.session.username;
  balModule.getAAODetails(adoCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVAWDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.query.blockCode;
  balModule.getVAWDetails(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVAWGPDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.query.blockCode;
  balModule.getVAWGPDetails(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getDashboardDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var adoCode = req.session.username;
  balModule.getDashboardDetails(adoCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
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
  balModule.getLTCDetails(dateOfEntry, season, financialYear, blockCode, cropCode, pestDiseaseCode,username, function success(response) {
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

router.get('/getBlocksByADO', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  balModule.getBlocksByADO(username).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getADOPestDetails', function (req, res, next) {
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
  balModule.getADOPestDetails(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getRefNos', function(req, res, next) {
  res.get('X-Frame-Options');
  var username = req.session.username;
  var cropCategoryCode = req.query.cropCategoryCode;
  var cropCode = req.query.cropCode;
  balModule.getRefNos(username,cropCategoryCode,cropCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getRefNoDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var refNo = req.query.refNo;
  balModule.getRefNoDetails(refNo).then(function success(response) {
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

router.get('/getPestPopulation', function(req, res, next) {
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

router.get('/getEMRNosForADO', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var cropCategory = req.query.cropCategory;
  var crop = req.query.crop;
  var financialYear = req.query.financialYear;
  var username = req.session.username;
  var blockCode = req.query.blockCode;
  balModule.getEMRNosForADO(dateOfEntry, cropCategory, crop, financialYear, username, blockCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getEMRReferenceNoDetailsADO', function(req, res, next) {
  res.get('X-Frame-Options');
  var emrRefNo = req.query.emrRefNo;
  balModule.getEMRReferenceNoDetailsADO(emrRefNo).then(function success(response) {
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
  balModule.getTargetedGP(blockCode).then(function success(response) {
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
