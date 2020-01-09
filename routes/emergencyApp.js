var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var balModule = require('../models/emergencyBALModule');
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
router.get('/', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('emergencyApp/layout', { title: 'EmergencyApp Layout', csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('emergencyApp/home', { title: 'EmergencyApp Home', csrfToken: req.csrfToken() });
});

router.get('/farmerDetails', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  res.render('emergencyApp/farmerdetails', { title: 'EmergencyApp Home Farmer Details', csrfToken: req.csrfToken() });
});

function randomNumber() {
  var k = Math.floor((Math.random() * 1000000) + 1);
  return k;
};

function SendOTP(mobileNo, OTP, callback) {
  var sms = 'e-Pest - OTP for Emergency Pest details is ' + OTP;
  var encodeSMS = encodeURI(sms);
  request('http://www.apicol.nic.in/Registration/EPestSMS?mobileNo=' + mobileNo + '&sms=' + encodeSMS, { json: true }, (err, res, body) => {
    if (err) { 
      console.log(err);
    }
    else {
      callback(body);
    }
  });
};

router.get('/sendOTP', function (req, res, next) {
  res.get('X-Frame-Options');
  var randomNo = randomNumber();
  req.session.cookie.expires = 900000;
  req.session.RandomNo = sha256(randomNo.toString());
  var mobileNo = req.query.mobileNo;
  SendOTP(mobileNo, randomNo, function(response) {
    res.send(response);
  });
});

router.get('/verifyOTP', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  req.session.otp = req.query.otp;
  if (req.session.RandomNo == req.session.otp) {
    res.redirect('../emergencyApp/cropphotodetails');
  }
  else {
    res.send('Invalid OTP.');
  }
});

router.get('/cropPhotoDetails', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  if (req.session.RandomNo != undefined && req.session.RandomNo != null && req.session.RandomNo != '' && req.session.otp != undefined && req.session.otp != null && req.session.otp != '' && req.session.RandomNo == req.session.otp) {
    res.render('emergencyApp/cropphotodetails', { title: 'EmergencyApp Home Crop & Photo Details', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
  }
  else {
    res.render('emergencyApp/farmerdetails', { title: 'EmergencyApp Home Farmer Details', csrfToken: req.csrfToken(), randomNo: req.session.RandomNo });
  }
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

router.get('/getCrops', function(req, res, next) {
  res.get('X-Frame-Options');
  var cropCategoryCode = req.query.cropCategoryCode;
  balModule.getCrops(cropCategoryCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

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

router.get('/getGPsByBlock', function(req, res, next) {
  res.get('X-Frame-Options');
  var blockCode = req.query.blockCode;
  balModule.getGPsByBlock(blockCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getVillagesByGP', function(req, res, next) {
  res.get('X-Frame-Options');
  var gpCode = req.query.gpCode;
  balModule.getVillagesByGP(gpCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.get('/getGPCode', function (req, res, next) {
  res.get('X-Frame-Options');
  var vCode = req.query.villageCode;
  balModule.getGPCode(vCode).then(function success(response) {
    res.send(response);
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

router.post('/submitCropPhotoDetails', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  if (req.device.type.toUpperCase() == 'PHONE' || req.device.type.toUpperCase() == 'TABLET') {
    var obj = req.body.data;
    balModule.addActivityLog(req.connection.remoteAddress, obj.FarmerID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/submitCropPhotoDetails', 'INSERT', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
    var financialYear = getFinancialYear().toString().substr(2, 6);
    var season = getSeason().charAt(0);
    balModule.getEMRDetails(financialYear, season, obj.DistrictCode, obj.BlockCode, obj.GPCode, function success(response) {
      var partRefNo = 'EMR/' + financialYear + '/' + season + '/' + obj.GPCode + '/';
      var refNoCount = response[1][0].RefNoCount;
      obj.ReferenceNo = partRefNo + (refNoCount + 1).toString();
      obj.FixedLandPhoto = Buffer.from(obj.FLP, 'base64');
      if (obj.RLP1 != null) {
        obj.RandomLandPhoto1 = Buffer.from(obj.RLP1, 'base64');
      }
      else {
        obj.RandomLandPhoto1 = null;
      }
      if (obj.RLP2 != null) {
        obj.RandomLandPhoto2 = Buffer.from(obj.RLP2, 'base64');
      }
      else {
        obj.RandomLandPhoto2 = null;
      }
      obj.ADOCode = response[0][0].ADOCode;
      obj.DistrictCode = obj.DistrictCode;
      obj.BlockCode = obj.BlockCode;
      obj.Status = 1;
      obj.IPAddress = req.connection.remoteAddress;
      obj.FinancialYear = getFinancialYear();
      delete obj.FLP; delete obj.RLP1; delete obj.RLP2;
      balModule.submitCropPhotoDetails(obj, function (response1) {
        if (response1 == true) {
          res.status(200).send((obj.ReferenceNo).toString());
        }
        else {
          res.status(500).send(('An error occurred...').toString());
        }
      }, function error(response1) {
        console.log(response1.status);
      });
    }, function error(response) {
      console.log(response.status);
    });
  }
  else {
    res.send('Please use a Phone or a Tablet.');
  }
});

module.exports = router;
