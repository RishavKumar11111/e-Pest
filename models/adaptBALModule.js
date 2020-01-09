var dbConfig = require('./dbConfig');
var sequelize = dbConfig.sequelize;
var sql = dbConfig.sql;
var locConfig = dbConfig.locConfig;

exports.addActivityLog = function(ipAddress, userID, url, deviceType, os, browser, action, attack, mode) {
    sequelize.query('insert into ActivityLog (IPAddress, UserID, URL, DeviceType, OS, Browser, DateTime, Action, Attack, Mode) values (:ip_address, :user_id, :url, :device_type, :os, :browser, getdate(), :action, :attack, :mode)', {
    replacements: { ip_address: ipAddress, user_id: userID, url: url, device_type: deviceType, os: os, browser: browser, action: action, attack: attack, mode: mode}, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getUserDetails = function(userName) {
    return sequelize.query('select ul.UserID, ul.PasswordHash, ul.RoleID, ul.ContactNo, ul.AccessFailedCount, ul.Status, ur.RoleName from UserLogin ul inner join UserRole ur on ul.RoleID = ur.RoleID where UserID = :user_name', {
        replacements: { user_name: userName }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPasswordHistory = function (userName) {
    return sequelize.query('select OldPassword from PasswordLog where UserID = :user_name', {
        replacements: { user_name: userName }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.changePasssword = function(obj, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('UserID', obj.UserID);
        request.input('NewPassword', obj.NewPassword);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.execute('spChangePassword', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else{
                callback(result.returnValue);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.updateIsLoggedIn = function(isLoggedIn, userID) {
    sequelize.query('update UserLogin set IsLoggedIn = :is_logged_in where UserID = :user_id', {
    replacements: { is_logged_in: isLoggedIn, user_id: userID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getStatePestDetails = function (dateOfEntry, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.execute('spStateWiseDetails', function (err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordsets);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getDistricts = function() {
    return sequelize.query('select DistrictCode, DistrictName from LGDDistrict', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getBlocksByDistrict = function(districtCode) {
    return sequelize.query('select BlockCode, BlockName from LGDBlock where DistrictCode = :district_code', {
        replacements: { district_code : districtCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getGP = function(blockCode) {
    return sequelize.query('select * from LGDGP where BlockCode = :block_code', {
        replacements: { block_code : blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropCategories = function() {
    return sequelize.query('select * from CropCategory', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropsByCategory = function(cropCategoryCode) {
    return sequelize.query('select CropCode, CropName from Crop where CropCategoryCode = :crop_category_code', {
        replacements: { crop_category_code: cropCategoryCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestDiseases = function(cropCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('CropCode', cropCode);
        request.execute('spGetPestDisease', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else{
                callback(result.recordset);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestDetails = function(dateOfEntry, season, financialYear, districtCode, blockCode , cropCategoryCode, cropCode, pestDiseaseCode, username, role, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('DistrictCode', districtCode);
        request.input('BlockCode', blockCode);
        request.input('CropCategoryCode', cropCategoryCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('Username', username);
        request.input('Role', role);
        request.execute('spGetCropPestDetails', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else{
                callback(result.recordset);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropPestDetails = function(dateOfEntry, season, financialYear, districtCode, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, username, role, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('DistrictCode', districtCode);
        request.input('BlockCode', blockCode);
        request.input('CropCategoryCode', cropCategoryCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('Username', username);
        request.input('Role', role);
        request.execute('spGetAdaptPestDetails', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else{
                callback(result.recordset);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getComplianceReport = function (dateOfEntry, season, financialYear, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.execute('spComplianceReport', function (err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordsets);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getTargetedGP = function (blockCode) {
    return sequelize.query('select a.GPCode,GPName from VAWGPTargets a left join LGDGP b on a.GPCode = b.GPCode left join LGDBlock c on c.BlockCode = b.BlockCode where c.BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getSurveyGP = function (dateOfEntry,blockCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('BlockCode', blockCode);
        request.execute('spComplianceReportSurvey', function (err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordsets);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getADODetails = function(adoCode) {
    return sequelize.query('select ADOName, ADOMobileNo from ADODistBlockMapping where ADOCode = :ado_code group by ADOName, ADOMobileNo', {
        replacements: { ado_code : adoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};