var dbConfig = require('./dbConfig');
var sequelize = dbConfig.sequelize;
var sql = dbConfig.sql;
var locConfig = dbConfig.locConfig;

exports.addActivityLog = function (ipAddress, userID, url, deviceType, os, browser, action, attack, mode) {
    sequelize.query('insert into ActivityLog (IPAddress, UserID, URL, DeviceType, OS, Browser, DateTime, Action, Attack, Mode) values (:ip_address, :user_id, :url, :device_type, :os, :browser, getdate(), :action, :attack, :mode)', {
        replacements: { ip_address: ipAddress, user_id: userID, url: url, device_type: deviceType, os: os, browser: browser, action: action, attack: attack, mode: mode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.synchronize = function (aaoCode, blockCode, aaoStatus, cropData, refNofIDaID, pestData, existingUserDetails, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableVAWCropDetailsEntry = new sql.Table();
        tableVAWCropDetailsEntry.create = true;
        tableVAWCropDetailsEntry.columns.add('ReferenceNo', sql.VarChar(30), { nullable: false, primary: true });
        tableVAWCropDetailsEntry.columns.add('GPCode', sql.Int, { nullable: false });
        tableVAWCropDetailsEntry.columns.add('VillageCode', sql.Int, { nullable: false });
        tableVAWCropDetailsEntry.columns.add('Season', sql.VarChar(10), { nullable: false });
        tableVAWCropDetailsEntry.columns.add('MobileNo', sql.VarChar(10), { nullable: false });
        tableVAWCropDetailsEntry.columns.add('CropCategoryCode', sql.Int, { nullable: false });
        tableVAWCropDetailsEntry.columns.add('CropCode', sql.Int, { nullable: false });
        tableVAWCropDetailsEntry.columns.add('CropStageCode', sql.Int, { nullable: false });
        tableVAWCropDetailsEntry.columns.add('VAWCode', sql.VarChar(30), { nullable: false });
        tableVAWCropDetailsEntry.columns.add('Status', sql.Bit, { nullable: false });
        tableVAWCropDetailsEntry.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableVAWCropDetailsEntry.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        if (cropData.length > 0) {
            for (var i = 0; i < cropData.length; i++) {
                tableVAWCropDetailsEntry.rows.add(cropData[i].ReferenceNo, cropData[i].GPCode, cropData[i].VillageCode, cropData[i].Season, cropData[i].MobileNo, cropData[i].CropCategoryCode, cropData[i].CropCode, cropData[i].CropStageCode, cropData[i].VAWCode, cropData[i].Status, cropData[i].IPAddress, cropData[i].FinancialYear);
            }
        }
        const tableVAWRefNoFarmerID = new sql.Table();
        tableVAWRefNoFarmerID.create = true;
        tableVAWRefNoFarmerID.columns.add('ReferenceNo', sql.VarChar(30), { nullable: false });
        tableVAWRefNoFarmerID.columns.add('FarmerID', sql.VarChar(30), { nullable: true });
        tableVAWRefNoFarmerID.columns.add('Status', sql.VarChar(10), { nullable: true });
        tableVAWRefNoFarmerID.columns.add('AadhaarNo', sql.VarChar(100), { nullable: true });
        tableVAWRefNoFarmerID.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableVAWRefNoFarmerID.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        if (refNofIDaID.length > 0) {
            for (var i = 0; i < refNofIDaID.length; i++) {
                tableVAWRefNoFarmerID.rows.add(refNofIDaID[i].ReferenceNo, refNofIDaID[i].FarmerID, refNofIDaID[i].Status, refNofIDaID[i].AadhaarNo, refNofIDaID[i].IPAddress, refNofIDaID[i].FinancialYear);
            }
        }
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
        var operationType = (cropData.length > 0 && refNofIDaID.length > 0 && pestData.length > 0) ? 'Insert, Update & Select' : 'Select';
        const request = new sql.Request(con);
        request.input('operationType', operationType);
        request.input('tableVAWCropDetailsEntry', tableVAWCropDetailsEntry);
        request.input('tableVAWRefNoFarmerID', tableVAWRefNoFarmerID);
        request.input('tableVAWPestDetailsEntry', tableVAWPestDetailsEntry);
        request.input('AAOCode', aaoCode);
        request.input('BlockCode', blockCode);
        request.input('AAOStatus', aaoStatus);
        request.input('ExistingAAOCode', existingUserDetails.Username);
        request.input('ExistingBlockCode', existingUserDetails.BlockCode);
        request.input('ExistingAAOStatus', existingUserDetails.AAOStatus);
        request.execute('spAAOSynchronize', function (err, result) {
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

exports.getBlock = function (blockCode) {
    return sequelize.query('select BlockCode, BlockName from LGDBlock where BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
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

exports.changePasssword = function (obj, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('UserID', obj.UserID);
        request.input('NewPassword', obj.NewPassword);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.execute('spChangePassword', function (err, result) {
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

exports.updateFailedCount = function (failedCount, userID) {
    sequelize.query('update UserLogin set AccessFailedCount = :failed_count where UserID = :user_id', {
        replacements: { failed_count: failedCount, user_id: userID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.checkCPStatus = function (userName) {
    return sequelize.query('select UserID from ChangePasswordStatus where UserID = :user_name', {
        replacements: { user_name: userName }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};