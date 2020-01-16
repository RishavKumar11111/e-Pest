var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var svgCaptcha = require('svg-captcha');
var crypto = require('crypto');
var csrf = require('csurf');
var sha256 = require('js-sha256');
var balModule = require('../models/homeBALModule');
var csrfProtection = csrf();
var parseForm = bodyParser.urlencoded({ extended: false });
var os = require('os');
var cache = require('cache-headers');
var moment = require('moment'); moment().format();
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
  var todayDate = dd + '-' + MM + '-' + yyyy + ' ' + HH + ':' + mm + ':' + ss;
  return todayDate;
  //var currentDate = new Date(todayDate);
  //return currentDate;
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

router.get('/captcha', function (req, res) {
  res.get('X-Frame-Options');
  var captcha = svgCaptcha.createMathExpr({ color: true, noise: 5 });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
});

/* GET home page. */
router.get('/', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('odiahome', { title: 'Home', csrfToken: req.csrfToken() });
});

router.get('/odiahome', csrfProtection, function (req, res) {
  res.render('odiahome', { csrfToken: req.csrfToken() });
});

router.get('/home', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('home', { title: 'Home', csrfToken: req.csrfToken() });
});

router.get('/history', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('history', { title: 'History', csrfToken: req.csrfToken() });
});

router.get('/secretaryDesk', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('secretarydesk', { title: 'Secretary Desk', csrfToken: req.csrfToken() });
});

router.get('/directorDesk', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('directordesk', { title: 'Director Desk', csrfToken: req.csrfToken() });
});

router.get('/RTI', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('rti', { title: 'RTI', csrfToken: req.csrfToken() });
});

router.get('/terms&Conditions', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('termsandconditions', { title: 'Terms & Conditions', csrfToken: req.csrfToken() });
});

router.get('/disclaimer', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('disclaimer', { title: 'Disclaimer', csrfToken: req.csrfToken() });
});

router.get('/privacyPolicy', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('privacypolicy', { title: 'Privacy Policy', csrfToken: req.csrfToken() });
});

router.get('/websitePolicies', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('websitepolicies', { title: 'Website Policies', csrfToken: req.csrfToken() });
});

router.get('/screenReader', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('screenreader', { title: 'Screen Reader', csrfToken: req.csrfToken() });
});

router.get('/copyrightPolicy', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('copyrightpolicy', { title: 'Copyright Policy', csrfToken: req.csrfToken() });
});

router.get('/hyperlinkPolicy', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('hyperlinkpolicy', { title: 'Hyperlink Policy', csrfToken: req.csrfToken() });
});

router.get('/aboutUs', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('aboutus', { title: 'About Us', csrfToken: req.csrfToken() });
});

router.get('/odiaAboutUs', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('odiaaboutus', { title: 'About Us', csrfToken: req.csrfToken() });
});

router.get('/processFlow', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('processflow', { title: 'Process Flow', csrfToken: req.csrfToken() });
});

router.get('/organogram', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('organogram', { title: 'Organogram', csrfToken: req.csrfToken() });
});

router.get('/faq', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('faq', { title: 'FAQ', csrfToken: req.csrfToken() });
});

router.get('/newsEvents', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('newsevents', { title: 'News & Events', csrfToken: req.csrfToken() });
});

router.get('/odiaNewsEvents', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('odianewsevents', { title: 'News & Events', csrfToken: req.csrfToken() });
});

router.get('/photoGallery', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('photogallery', { title: 'Photo Gallery', csrfToken: req.csrfToken() });
 });

 router.get('/videoGallery', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  res.render('videogallery', { title: 'Video Gallery', csrfToken: req.csrfToken() });
 });

router.get('/login', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: '' });
});

router.post('/plogin', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  if (req.body.captcha !== req.session.captcha) {
    res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Invalid Captcha' });
  }
  else {
    balModule.getUserDetails(req.body.userName).then(function success(response) {
      if (response.length === 0) {
        res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Invalid Username or Password' });
      }
      else if (response[0].Status !== true) {
        balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/login', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
        res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Invalid Username' });
      }
      else {
        var pwdHash = response[0].PasswordHash;
        var pwdRNo = sha256(pwdHash + req.session.RandomNo);
        if (pwdRNo === req.body.password) {
          if (response[0].AccessFailedCount < 5) {
            balModule.getLastLoginStatus(req.body.userName).then(function success(response1) {
              var s = '00:00:00';
              if (response1.length > 0) {
                var ms = moment(getCurrentDateTime(),"DD-MM-YYYY HH:mm:ss").diff(moment(response1[0].LastLoginDateTime,"DD-MM-YYYY HH:mm:ss"));
                var d = moment.duration(ms);
                s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
              }
              if ((response[0].IsLoggedIn === true && (s.substring(0, 1) == 0 && s.substring(2, 4) >= 10) || (s.substring(0, 1) > 0)) || (response[0].IsLoggedIn !== true)) {
                req.session.username = req.body.userName;
                req.session.role = response[0].RoleName;
                req.session.cookie.expires = 1800000;
                let tempSession = req.session;
                req.session.regenerate(function(err) {
                  Object.assign(req.session, tempSession);
                });
                balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/login', 'LOGIN', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
                if (req.session.role != 'JDA_PP' && req.session.role != 'ADMIN') {
                  balModule.updateFailedCount(0, response[0].UserID, function success(response) { }, function error(response) { console.log(response.status); });
                }
                balModule.updateIsLoggedIn(0, response[0].UserID, function success(response) { }, function error(response) { console.log(response.status); });
                balModule.checkCPStatus(req.session.username).then(function success(response) {
                  if (response.length > 0) {
                    req.session.save(function(err) {
                      switch (req.session.role) {
                        case 'VAW':
                          res.redirect('vaw');
                          break;
                        case 'AAO':
                          res.redirect('aao');
                          break;
                        case 'ADO':
                          res.redirect('ado');
                          break;
                        case 'CDAO':
                          res.redirect('cdao');
                          break;
                        case 'OUAT':
                          res.redirect('ouat');
                          break;
                        case 'JDA_PP':
                          res.redirect('jdapp');
                          break;
                        case 'ADMIN':
                          res.redirect('admin');
                          break;
                        case 'ADAPT':
                          res.redirect('adapt');
                          break;
                        case 'NRRI':
                          res.redirect('nrri');
                          break;
                      }
                    });
                  }
                  else {
                    req.session.save(function(err) {
                      res.redirect('changePassword');
                    });
                  }
                }, function error(response) {
                  console.log(response.status);
                }).catch(function err(error) {
                  console.log('An error occurred...', error);
                });
              }
              else {
                res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Already Logged In' });
              }
            }, function error(response) {
              console.log(response.status);
            }).catch(function err(error) {
              console.log('An error occurred...', error);
            });
          }
          else {
            balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/login', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
            res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Account is locked. Contact Admin.' });
          }
        }
        else {
          balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/login', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
          if (response[0].AccessFailedCount < 5) {
            if (response[0].RoleName != 'JDA_PP' && response[0].RoleName != 'ADMIN') {
              var failedCount = response[0].AccessFailedCount + 1;
              balModule.updateFailedCount(failedCount, response[0].UserID, function success(response) { }, function error(response) { console.log(response.status); });
            }
            res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Invalid Username or Password' });
          }
          else {
            res.render('login', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Login', error: 'Account is locked. Contact Admin.' });
          }
        }
      }
    }, function error(response) {
      console.log(response.status);
    }).catch(function err(error) {
      console.log('An error occurred...', error);
    });
  }
});

router.get('/forgotPassword', csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  req.session.RandomNo = randomNumber();
  res.get('X-Frame-Options');
  res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: '' });
});

router.post('/pforgotPassword', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  if (req.body.captcha !== req.session.captcha) {
    res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: 'Invalid Captcha' });
  }
  else {
    balModule.getUserDetails(req.body.userName).then(function success(response) {
      if (response.length === 0) {
        res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: 'Invalid Username' });
      }
      else if (response[0].Status !== true) {
        balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/getUserDetails', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
        res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: 'Invalid Username' });
      }
      else if (response[0].ContactNo == null || response[0].ContactNo == 0) {
        balModule.addActivityLog(req.connection.remoteAddress, response[0].UserID, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/getUserDetails', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
        res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: 'Your mobile number is not registered. Please contact the concerned authority.' });
      }
      else {
        var otp = generateOTP();
        req.session.cookie.expires = 900000;
        req.session.OTP = sha256(otp.toString());
        req.session.MobileNo = response[0].ContactNo;
        req.session.username = req.body.userName;
        req.session.role = response[0].RoleName;
        var mobileNo = response[0].ContactNo;
        SendOTP(mobileNo, otp, function(response1) {
          res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: response1, error: '' });
        });
      }
    }, function error(response) {
      console.log(response.status);
    }).catch(function err(error) {
      console.log('An error occurred...', error);
    });
  }
});

function generateOTP() {
  var k = Math.floor((Math.random() * 1000000) + 1);
  return k;
};

function SendOTP(mobileNo, OTP, callback) {
  var sms = 'e-Pest - OTP for Password Reset is ' + OTP;
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
  var otp = generateOTP();
  req.session.cookie.expires = 900000;
  req.session.OTP = sha256(otp.toString());
  var mobileNo = req.session.MobileNo;
  SendOTP(mobileNo, otp, function(response) {
    res.send(response);
  });
});

router.post('/verifyOTP', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function (req, res, next) {
  res.get('X-Frame-Options');
  if (req.session.OTP == sha256(req.body.otp.toString())) {
    res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: 'Correct OTP', error: '' });
  }
  else {
    res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: 'Wrong OTP', error: 'Invalid OTP' });
  }
});

router.post('/updatePassword', parseForm, csrfProtection, cache.overrideCacheHeaders(overrideConfig), function(req, res, next) {
  res.get('X-Frame-Options');
  balModule.getPasswordHistory(req.session.username).then(function success(response) {
    if (response.length > 0) {
      var found = response.some(function(i) {
        return i.OldPassword === req.body.npassword;
      });
    }
    if (!found || response.length == 0) {
      balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updatePassword', 'UPDATE / INSERT', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
      var objP = {};
      objP.NewPassword = req.body.npassword;
      objP.UserID = req.session.username;
      objP.Status = 1;
      objP.IPAddress = req.connection.remoteAddress;
      objP.FinancialYear = getFinancialYear();
      if (req.session.role != 'JDA_PP' && req.session.role != 'ADMIN') {
        balModule.updateFailedCount(0, req.session.username, function success(response) { }, function error(response) { console.log(response.status); });
      }
      balModule.changePasssword(objP, function (response1) {
        if (response1 > 0) {
          res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: 'Password updated successfully.', error: '' });
        }
        else {
          res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: 'Oops! An error has occurred. Please try after sometime.' });
        }
      }, function error(response1) {
        console.log(response1.status);
      });
    }
    else {
      balModule.addActivityLog(req.connection.remoteAddress, req.session.username, getURL(req), req.device.type.toUpperCase(), os.platform(), req.headers['user-agent'], '/updatePassword', 'FAILED', 'POST', function success(response) { }, function error(response) { console.log(response.status); });
      res.render('forgotpassword', { randomNo: req.session.RandomNo, csrfToken: req.csrfToken(), title: 'Forgot Password', message: '', error: 'This password is already used. Please try a new one.' });
    }
  }, function error(response) {
    console.log(response.status);
  }).catch(function err(error) {
    console.log('An error occurred...', error);
  });
});

module.exports = router;