var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var balModule = require('../models/jdappBALModule');
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
router.get('/', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/layout', { title: 'JDA(PP) Layout', csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/home', { title: 'JDA(PP) Home', csrfToken: req.csrfToken() });
});

router.get('/dashboardJDAPP', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/dashboardjdapp', { title: 'JDA(PP) Dashboard', csrfToken: req.csrfToken() });
});

router.get('/dashboard', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/dashboard', { title: 'JDA(PP) Verification', csrfToken: req.csrfToken() });
});

router.get('/emergencyCase', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/emergencycase', { title: 'JDA(PP) Emergency Case', csrfToken: req.csrfToken() });
});

router.get('/advisoryDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/advisorydetails', { title: 'JDA(PP) Advisory Details', csrfToken: req.csrfToken() });
});

router.get('/etlDetailsEntry', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/etldetailsentry', { title: 'JDA(PP) ETL Details Entry', csrfToken: req.csrfToken() });
});

router.get('/blockwiseAdvisorySMS', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/blockwiseadvisorysms', { title: 'JDA(PP) Block-wise Advisory Details', csrfToken: req.csrfToken() });
});

router.get('/aaoDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/aaodetails', { title: 'JDA(PP) AAO Details', csrfToken: req.csrfToken() });
});

router.get('/vawDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/vawdetails', { title: 'JDA(PP) VAW Details', csrfToken: req.csrfToken() });
});

router.get('/vawGPTargetDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/vawgptargetdetails', { title: 'JDA(PP) VAW GP Target Details', csrfToken: req.csrfToken() });
});

router.get('/vawGPAUDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/vawgpaudetails', { title: 'JDA(PP) VAW GP Allocated & Unallocated', csrfToken: req.csrfToken() });
});

router.get('/cdaoDetailsEntry', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/cdaodetailsentry', { title: 'JDA(PP) CDAO Details Entry', csrfToken: req.csrfToken() });
});

router.get('/viewPestDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/viewpestdetails', { title: 'JDA(PP) View Pest Details', csrfToken: req.csrfToken() });
});

router.get('/complianceReport', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/compliancereport', { title: 'Compliance Report', csrfToken: req.csrfToken() });
});

router.get('/emergencyCaseReport', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/emergencycasereport', { title: 'JDA(PP) Emergency Case Report', csrfToken: req.csrfToken()});
});

router.get('/gisMap', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/gismap', { title: 'JDA(PP) GIS Map', csrfToken: req.csrfToken() });
});

router.get('/map', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.get('X-Frame-Options');
  var financialYear = req.query.financialYear;
  var season = req.query.season;
  var districtCode = req.query.districtCode;
  var dateOfEntry = req.query.dateOfEntry;
  balModule.getGISMapDetails(financialYear, season, districtCode, dateOfEntry).then(function success(response) {
    res.render('jdapp/map', { title: 'JDA(PP) Map', csrfToken: req.csrfToken(), locationData: response });
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/pestPhoto', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  var refNo = req.query.referenceNo;
  balModule.getPestPhoto(refNo).then(function success(response) {
    var flp = Buffer.from(response[0].FixedLandPhoto, 'binary').toString('base64');
    var img = "data:image/jpeg;base64," + flp;
    res.send(img);
    // res.render('jdapp/pestphoto', { title: 'JDA(PP) Pest Photo', csrfToken: req.csrfToken(), photoData: img });
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/changePassword', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('jdapp/changepassword', { title: 'JDA(PP) Change Password', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.post('/changePassword', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
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

router.get('/resetPasswords', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('jdapp/resetpasswords', { title: 'JDA(PP) Reset Passwords', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.get('/unlockAccounts', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('jdapp/unlockaccounts', { title: 'JDA(PP) Unlock Accounts', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
});

router.get('/adoDetailsEntry', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/adodetailsentry', { title: 'JDA(PP) ADO Entry', csrfToken: req.csrfToken() });
});

router.get('/vawRecordDetails', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/vawrecorddetails', { title: 'JDA(PP) VAW Record Details', csrfToken: req.csrfToken() });
});

router.get('/vawInspectionReport', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/vawinspectionreport', { title: 'JDA(PP) VAW Inspection Report', csrfToken: req.csrfToken() });
});

router.get('/lightTrapCatchReport', csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('jdapp/lighttrapcatchreport', { title: 'JDA(PP) Light Trap Catch Report', csrfToken: req.csrfToken() });
});

router.get('/logout', function (req, res, next) {
  if (req.session.username != undefined) {
    balModule.updateIsLoggedIn(0, req.session.username, function success(response) { }, function error(response) { console.log(response.status); });
  }
  req.session.destroy();
  res.get('X-Frame-Options');
  res.redirect('../login');
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

router.post('/submitAD', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitAD', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data.cropPest;
  var arr = req.body.data.pesticide;
  balModule.getPestCount(obj, arr, function(response) {
    if (response.hasOwnProperty('Result')) {
      res.send('The Pesticide details already exists.');
      return false;
    }
    else if (response.hasOwnProperty('PestDiseaseCount')) {
      obj.PestDiseaseCode = obj.CropCode * 1000 + response.PestDiseaseCount + 1;
      for (var i = 0; i< arr.length; i++) {
        arr[i].PesticideCode = obj.PestDiseaseCode * 100 + i + 1;
        arr[i].PestDiseaseCode = obj.PestDiseaseCode;
      }
    }
    else {
      for (var i = 0; i< arr.length; i++) {
        arr[i].PesticideCode = response.PestDiseaseCode * 100 + response.PesticideCount + i + 1;
        arr[i].PestDiseaseCode = response.PestDiseaseCode;
      }
      obj.PestDiseaseCode = null; obj.PestDiseaseName = null; obj.CropType = null; obj.CropCode = null;
    }
    balModule.submitAD(obj, arr, function(response1) {
      res.sendStatus(response1 == 1 ? 200 : 500);
    }, function error(response1) {
      console.log(response1.status);
    });
  }, function error(response) {
    console.log(response.status);
  });
});

router.post('/submitEF', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitEF', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data;
  balModule.submitEF(arr, function(response) {
    res.sendStatus(response > 0 ? 200 : 500);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getLockedAccounts', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getLockedAccounts().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/unlock', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/unlock', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var userID = req.body.data;
  balModule.unlock(userID, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.post('/unlockAll', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/unlockAll', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var userIDs = req.body.data;
  balModule.unlockAll(userIDs, function success(response) {
    res.sendStatus(response > 0 ? 200 : 500);
  }, function error(response) {
    console.log(response.status);
  });
});

router.post('/resetPasswords', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/resetPasswords', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var userIDs = req.body.data;
  balModule.resetPasswords(userIDs, function success(response) {
    res.sendStatus(response > 0 ? 200 : response == -1 ? 204 : 500);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getCropCategories', function(req, res, next) {
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

router.get('/getRefNoDetails', function(req, res, next) {
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

router.get('/getPestDiseases', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCode = req.query.cropCode;
  balModule.getPestDiseases(cropCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
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

router.post('/updatePestDetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updatePestDetails', 'INSERT / UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.JDAPPUserID = req.session.username;
  obj.JDAPPStatus = 0;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.updatePestDetails(obj, function(response1) {
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

router.post('/updateMADetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updateMADetails', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data.refNos;
  var obj = req.body.data.pestData;
  obj.JDAPPUserID = req.session.username;
  obj.JDAPPStatus = 0;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.updateMADetails(arr, obj, function(response1) {
    res.send(response1.toString());
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.post('/submitDetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitDetails', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data;
  for (var i = 0; i < arr.length; i++) {
    arr[i].JDAPPUserID = req.session.username;
    arr[i].JDAPPStatus = 1;
    arr[i].Status = 1;
    arr[i].IPAddress = req.connection.remoteAddress;
    arr[i].FinancialYear = getFinancialYear();
  }
  balModule.submitDetails(arr, function(response1) {
    res.send(response1.toString());
  }, function error(response1) {
    console.log(response1.status);
  });
});

function SendSMS(obj, callback) {
  var mobileNo = obj.MobileNo;
  var moderateAdvisory = (obj.AdvisoryModerate != null) ? obj.AdvisoryModerate : 'NA';
  var highAdvisory = (obj.AdvisoryHigh != null) ? obj.AdvisoryHigh : 'NA';
  var sms = 'e-Pest - JDA(PP) Emergency Advisory : (Moderate - ' + moderateAdvisory + ', High - ' + highAdvisory + ')';
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

router.get('/getDistricts', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getDistricts().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getBlocksByDistrict', function(req, res, next) {
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

router.post('/submitBAS', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitBAS', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  var blockCode = obj.BlockCode
  balModule.getAAOVAWMobileNo(blockCode).then(function success(response) {
    obj.Status = 1;
    obj.IPAddress = req.connection.remoteAddress;
    obj.FinancialYear = getFinancialYear();
    balModule.submitBAS(obj, function(response1) {
      if (response.length > 0) {
        var sms = 'e-Pest - JDA(PP) Block-wise Advisory : ' + obj.AdvisorySMS;
        var encodeSMS = encodeURI(sms);
        var counter = 0;
        for (var i = 0; i < response.length; i++) {
          request('http://www.apicol.nic.in/Registration/EPestSMS?mobileNo=' + response[i].MobileNo + '&sms=' + encodeSMS, { json: true }, (err, res1, body) => {
            if (err) { 
              console.log(err);
            }
            else {
              counter++;
              if (counter == response.length) {
                res.sendStatus(response1 == true ? 200 : 500);
              }
            }
          });
        }        
      }
      else {
        res.sendStatus(response1 == true ? 200 : 500);
      }
    }, function error(response1) {
      console.log(response1.status);
    });
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getAdvisorySMS', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getAdvisorySMS().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/submitETL', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitETL', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data.cropCode;
  var arr = req.body.data.pestIntensity;
  var pestCode = arr[0].PestDiseaseDetails.PestDiseaseCode;
  balModule.getPestIntensity(pestCode).then(function success(response1) {
    if (response1.length > 0) {
      res.send('The ETL details already exists.');
      return false;
    }
    else {
      balModule.submitETL(obj, arr, function(response1) {
        res.send('OK');
      }, function error(response1) {
        console.log(response1.status);
      });
    }
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getAAODetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var districtCode = req.query.districtCode;
  balModule.getAAODetails(districtCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getDashboardDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.getDashboardDetails(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
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
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  balModule.getVAWGPDetails(blockCode, season, financialYear).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVAWGPAllocatedDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var districtCode = req.query.districtCode;
  var status = req.query.statusCode;
  balModule.getVAWGPAllocatedDetails(districtCode, status, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getAllCDAODetails', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getAllCDAODetails().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/submitCDAODetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitCDAODetails', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.FinancialYear = getFinancialYear();
  obj.IPAddress = req.connection.remoteAddress;
  balModule.submitCDAODetails(obj, function success(response1) {
    res.sendStatus(response1 > 0 ? 200 : 500);
  }, function error(response1) {
    console.log(response1.status);
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

router.get('/getAllADODetails', function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getAllADODetails().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/submitADODetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitADODetails', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.FinancialYear = getFinancialYear();
  obj.IPAddress = req.connection.remoteAddress;
  balModule.submitADODetails(obj, function success(response1) {
    res.sendStatus(response1 > 0 ? 200 : 500);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.post('/removeRefNo', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeRefNo', 'UPDATE', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
  var referenceNo = req.body.data;
  balModule.removeRefNo(referenceNo, function success(response1) {
    res.send(referenceNo);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getVAWRecordDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var vawCode = req.query.vawCode;
  balModule.getVAWRecordDetails(vawCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
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

router.get('/getPesticideDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var pestdiseaseCode = req.query.pestdiseaseCode;
  balModule.getPesticideDetails(pestdiseaseCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/updateAdvisoryDetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updateAdvisoryDetails', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  var pestCode = req.body.data.pcode;
  obj.JDAPPUserID = req.session.username;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  var arr = req.body.data.uad;
  balModule.updateAdvisoryDetails(arr, obj, pestCode, function(response1) {
    res.sendStatus(response1 > 0 ? 200 : 500);
  }, function error(response1) {
    console.log(response1.status);
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

router.get('/getETLDetails', function (req, res, next) {
  res.get('X-Frame-Options');
  var pestdiseaseCode = req.query.pestdiseaseCode;
  balModule.getETLDetails(pestdiseaseCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/updateETLDetails', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updateETLDetails', 'UPDATE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  var pestCode = req.body.data.pcode;
  obj.JDAPPUserID = req.session.username;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  var arr = req.body.data.uad;
  balModule.updateETLDetails(arr, obj, pestCode, function(response1) {
    res.sendStatus(response1 > 0 ? 200 : 500);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.post('/removeAD', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeAD', 'DELETE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var pesticideCode = req.body.data;
  var jdappUserID = req.session.username;
  var ipAddress = req.connection.remoteAddress;
  var financialYear = getFinancialYear();
  balModule.removeAD(pesticideCode, jdappUserID, ipAddress, financialYear, function success(response1) {
    res.send('OK');
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.post('/removeETL', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/removeETL', 'DELETE', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var pestDiseaseCode = req.body.data.pestDiseaseCode;
  var jdappUserID = req.session.username;
  var ipAddress = req.connection.remoteAddress;
  var financialYear = getFinancialYear();
  balModule.removeETL(pestDiseaseCode, jdappUserID, ipAddress, financialYear, function success(response1) {
    res.send('OK');
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getComplianceReport', function (req, res, next) {
  res.get('X-Frame-Options');
  var dateOfEntry = req.query.dateOfEntry;
  var season = req.query.season;
  var financialYear = req.query.financialYear;
  balModule.getComplianceReport(dateOfEntry, season, financialYear, function success(response) {
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
  balModule.getSurveyGP(dateOfEntry, blockCode, function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  });
});

router.get('/getEMRRefNos', function(req, res, next) {
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

router.get('/getEMRRefNoDetails', function(req, res, next) {
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

router.post('/submitEMRDetails', function(req, res, next) {
  res.get('X-Frame-Options');
  var jdappUserID = req.session.username;
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitEMRDetails', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var obj = req.body.data;
  obj.JDAPPUserID = jdappUserID;
  obj.JDAPPStatus = 1;
  obj.Status = 1;
  obj.IPAddress = req.connection.remoteAddress;
  obj.FinancialYear = getFinancialYear();
  balModule.submitEMRDetails(obj, function(response1) {
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

router.get('/getEMRReferenceNoDetails', function(req, res, next) {
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

router.get('/getCropCategoryPestDiseases', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCategoryCode = req.query.cropCategoryCode;
  balModule.getCropCategoryPestDiseases(cropCategoryCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/getPestGraphData', parseForm, csrfProtection, permit.permission('JDA_PP'), cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/getPestGraphData', 'INSERT', 'POST', function success(response) {
  }, function error(response) {
    console.log(response.status);
  });
  var arr = req.body.data;
  balModule.getPestGraphData(arr, function success(response1) {
    console.log(response1);
    res.send(response1);
  }, function error(response1) {
    console.log(response1.status);
  });
});

router.get('/getGraphforCrop', function (req, res, next) {
  res.get('X-Frame-Options');
  balModule.getGraphforCrop().then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getCropDetailsCategory', function (req, res, next) {
  res.get('X-Frame-Options');
  var cropCategoryCode = req.query.cropCode;
  balModule.getCropDetailsCategory(cropCategoryCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

module.exports = router;
