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

exports.synchronize = function (pestData, adoCode, distCode, refNoBlock, adoStatus, existingUserDetails, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableVAWPestDetailsEntry = new sql.Table();
        tableVAWPestDetailsEntry.create = true;
        tableVAWPestDetailsEntry.columns.add('ReferenceNo', sql.VarChar(30), { nullable: false, primary: true });
        tableVAWPestDetailsEntry.columns.add('InfectionIdentified', sql.VarChar(10), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('PestDiseaseCode', sql.Int, { nullable: true });
        tableVAWPestDetailsEntry.columns.add('AreaOfLand', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('LowIntensityAttackArea', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('MediumIntensityAttackArea', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('HighIntensityAttackArea', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('LowIntensityTreatedArea', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('MediumIntensityTreatedArea', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('HighIntensityTreatedArea', sql.Decimal(18, 3), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('ModerateIntensityPestPopulation', sql.VarChar(100), { nullable: true });
        tableVAWPestDetailsEntry.columns.add('HighIntensityPestPopulation', sql.VarChar(100), { nullable: true });
        tableVAWPestDetailsEntry.columns.add('AdvisoryModerate', sql.NVarChar(1000), { nullable: true });
        tableVAWPestDetailsEntry.columns.add('AdvisoryHigh', sql.NVarChar(1000), { nullable: true });
        tableVAWPestDetailsEntry.columns.add('Status', sql.Bit, { nullable: false });
        tableVAWPestDetailsEntry.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableVAWPestDetailsEntry.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        if (pestData.length > 0) {
            for (var i = 0; i < pestData.length; i++) {
                tableVAWPestDetailsEntry.rows.add(pestData[i].ReferenceNo, pestData[i].InfectionIdentified, pestData[i].PestDiseaseCode, pestData[i].AreaOfLand, pestData[i].LowIntensityAttackArea, pestData[i].MediumIntensityAttackArea, pestData[i].HighIntensityAttackArea, pestData[i].LowIntensityTreatedArea, pestData[i].MediumIntensityTreatedArea, pestData[i].HighIntensityTreatedArea, pestData[i].ModerateIntensityPestPopulation, pestData[i].HighIntensityPestPopulation, pestData[i].AdvisoryModerate, pestData[i].AdvisoryHigh, pestData[i].Status, pestData[i].IPAddress, pestData[i].FinancialYear);
            }
        }
        const tableRefNoBlock = new sql.Table();
        tableRefNoBlock.create = true;
        tableRefNoBlock.columns.add('ReferenceNo', sql.VarChar(30), { nullable: false, primary: true });
        tableRefNoBlock.columns.add('BlockCode', sql.Int, { nullable: false, primary: true });
        if (refNoBlock.length > 0) {
            for (var i = 0; i < refNoBlock.length; i++) {
                tableRefNoBlock.rows.add(refNoBlock[i].ReferenceNo, refNoBlock[i].BlockCode);
            }
        }
        var operationType = (pestData.length > 0) ? 'Insert & Select' : 'Select';
        const request = new sql.Request(con);
        request.input('operationType', operationType)
        request.input('tableVAWPestDetailsEntry', tableVAWPestDetailsEntry);
        request.input('tableRefNoBlock', tableRefNoBlock);
        request.input('ADOCode', adoCode);
        request.input('DistrictCode', distCode);
        request.input('ADOStatus', adoStatus);
        request.input('ExistingAAOCode', existingUserDetails.Username);
        request.execute('spADOSynchronize', function (err, result) {
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

exports.getUserDetails = function (username) {
    return sequelize.query('select ul.UserID, ul.PasswordHash, ul.RoleID, ul.AccessFailedCount, ul.Status, ur.RoleName from UserLogin ul inner join UserRole ur on ul.RoleID = ur.RoleID where UserID = :user_name', {
        replacements: { user_name: username }, type: sequelize.QueryTypes.SELECT
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
            else {
                callback(result.returnValue);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.updateFailedCount = function(failedCount, userID) {
    sequelize.query('update UserLogin set AccessFailedCount = :failed_count where UserID = :user_id', {
    replacements: { failed_count: failedCount, user_id: userID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.checkCPStatus = function(userName) {
    return sequelize.query('select UserID from ChangePasswordStatus where UserID = :user_name', {
        replacements: { user_name: userName }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};