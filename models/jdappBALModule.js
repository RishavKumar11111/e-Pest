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

exports.getCrops = function() {
    return sequelize.query('select CropCode, CropName from Crop where IsActive = 1 order by CropName', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestCount = function(obj, arr, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tablePesticideEntry = new sql.Table();
        tablePesticideEntry.create = true;
        tablePesticideEntry.columns.add('PesticideName', sql.VarChar(300), {nullable: false});
        tablePesticideEntry.columns.add('PesticideNameOdia', sql.NVarChar(300), {nullable: false});
        tablePesticideEntry.columns.add('RecommendedDose', sql.VarChar(100), {nullable: false});
        tablePesticideEntry.columns.add('RecommendedDoseOdia', sql.NVarChar(100), {nullable: false});
        for (var i = 0; i < arr.length; i++) {
            tablePesticideEntry.rows.add(arr[i].PesticideName, arr[i].PesticideNameOdia, arr[i].RecommendedDose, arr[i].RecommendedDoseOdia);
        }
        const request = new sql.Request(con);
        request.input('CropCode', obj.CropCode);
        request.input('CropType', obj.CropType);
        request.input('PestDiseaseName', obj.PestDiseaseName);
        request.input('tablePesticideEntry', tablePesticideEntry)
        request.execute('spGetPestCount', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordset[0]);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitAD = function(obj, arr, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableAdvisoryEntry = new sql.Table();
        tableAdvisoryEntry.create = true;
        tableAdvisoryEntry.columns.add('PesticideCode', sql.Int, {nullable: false, primary: true});
        tableAdvisoryEntry.columns.add('PesticideName', sql.VarChar(300), {nullable: false});
        tableAdvisoryEntry.columns.add('PesticideNameOdia', sql.NVarChar(300), {nullable: false});
        tableAdvisoryEntry.columns.add('RecommendedDose', sql.VarChar(100), {nullable: false});
        tableAdvisoryEntry.columns.add('RecommendedDoseOdia', sql.NVarChar(100), {nullable: false});
        tableAdvisoryEntry.columns.add('PestDiseaseCode', sql.Int, {nullable: false});
        for (var i = 0; i < arr.length; i++) {
            tableAdvisoryEntry.rows.add(arr[i].PesticideCode, arr[i].PesticideName, arr[i].PesticideNameOdia, arr[i].RecommendedDose, arr[i].RecommendedDoseOdia, arr[i].PestDiseaseCode);
        }
        const request = new sql.Request(con);
        request.input('PestDiseaseCode', obj.PestDiseaseCode);
        request.input('PestDiseaseName', obj.PestDiseaseName);
        request.input('CropType', obj.CropType);
        request.input('CropCode', obj.CropCode);
        request.input('tableAdvisoryEntry', tableAdvisoryEntry);
        request.execute('spSubmitAD', function(err, result) {
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

exports.submitEF = function(arr, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableEFAdvisoryEntry = new sql.Table();
        tableEFAdvisoryEntry.create = true;
        tableEFAdvisoryEntry.columns.add('CropCode', sql.Int, {nullable: false});
        tableEFAdvisoryEntry.columns.add('CropType', sql.VarChar(10), {nullable: false});
        tableEFAdvisoryEntry.columns.add('PestDiseaseName', sql.VarChar(300), {nullable: false});
        tableEFAdvisoryEntry.columns.add('PesticideName', sql.VarChar(300), {nullable: false});
        tableEFAdvisoryEntry.columns.add('RecommendedDose', sql.VarChar(100), {nullable: false});
        for (var i = 0; i < arr.length; i++) {
            tableEFAdvisoryEntry.rows.add(arr[i].CropCode, arr[i].CropType, arr[i].PestDiseaseName, arr[i].PesticideName, arr[i].RecommendedDose);
        }
        const request = new sql.Request(con);
        request.input('tableEFAdvisoryEntry', tableEFAdvisoryEntry)
        request.execute('spSubmitEF', function(err, result) {
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

exports.getLockedAccounts = function() {
    return sequelize.query('select UserID, b.RoleName from UserLogin a inner join UserRole b on a.RoleID = b.RoleID where AccessFailedCount = 5', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.unlock = function(userID, callback) {
    sequelize.query('update UserLogin set AccessFailedCount = 0 where UserID = :user_id', {
    replacements: { user_id: userID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.unlockAll = function(userIDs, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableUserIDs = new sql.Table();
        tableUserIDs.create = true;
        tableUserIDs.columns.add('UserID', sql.VarChar(50), {nullable: false, primary: true});
        for (var i = 0; i < userIDs.length; i++) {
            tableUserIDs.rows.add(userIDs[i].UserID);
        }
        const request = new sql.Request(con);
        request.input('tableUserIDs', tableUserIDs);
        request.execute('spUnlockAll', function(err, result) {
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

exports.resetPasswords = function(userIDs, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableUserIDs = new sql.Table();
        tableUserIDs.create = true;
        tableUserIDs.columns.add('UserID', sql.VarChar(50), {nullable: false, primary: true});
        for (var i = 0; i < userIDs.length; i++) {
            tableUserIDs.rows.add(userIDs[i].UserID);
        }
        const request = new sql.Request(con);
        request.input('tableUserIDs', tableUserIDs);
        request.execute('spResetPasswords', function(err, result) {
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

exports.getCropCategories = function() {
    return sequelize.query('select * from CropCategory where IsActive = 1', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropsByCategory = function(cropCategoryCode) {
    return sequelize.query('select CropCode, CropName from Crop where CropCategoryCode = :crop_category_code and IsActive = 1', {
        replacements: { crop_category_code: cropCategoryCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getRefNoDetails = function(cropCode, season, pestDiseaseCode, intensityType, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('CropCode', cropCode);
        request.input('Season', season);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('IntensityType', intensityType);
        request.execute('spGetRefNoDetailsJDAPP', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordset);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCD = function (referenceNo) {
    return sequelize.query('select a.ReferenceNo, h.DistrictCode, h.DistrictName, g.BlockCode, g.BlockName, b.GPCode, b.GPName, c.VillageCode, c.VillageName, MobileNo, Season, d.CategoryCode, d.CategoryName, e.CropCode, e.CropName, f.CropStageCode, f.CropStageName from VAWFarmerCropDetailsEntry a inner join LGDGP b on a.GPCode = b.GPCode inner join LGDVillage c on a.VillageCode = c.VillageCode inner join CropCategory d on a.CropCategoryCode = d.CategoryCode inner join Crop e on a.CropCode = e.CropCode inner join CropStage f on a.CropStageCode = f.CropStageCode inner join LGDBlock g on g.BlockCode = b.BlockCode inner join LGDDistrict h on h.DistrictCode = g.DistrictCode where a.ReferenceNo = :reference_no', {
        replacements: { reference_no: referenceNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPLD = function (referenceNo) {
    return sequelize.query('select ReferenceNo, FixedLandPhoto, RandomLandPhoto1, RandomLandPhoto2, FixedLandLatitude, FixedLandLongitude, RandomLandLatitude1, RandomLandLongitude1, RandomLandLatitude2, RandomLandLongitude2 from VAWFarmerPhotoLocationEntry where ReferenceNo = :reference_no', {
        replacements: { reference_no: referenceNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPD = function (referenceNo) {
    return sequelize.query('select i.ReferenceNo, i.PestDiseaseCode, j.PestDiseaseName, i.InfectionIdentified, i.AreaOfLand, i.LowIntensityAttackArea, i.MediumIntensityAttackArea, i.HighIntensityAttackArea, i.LowIntensityTreatedArea, i.MediumIntensityTreatedArea, i.HighIntensityTreatedArea, i.ModerateIntensityPestPopulation, i.HighIntensityPestPopulation, i.AdvisoryModerate, i.AdvisoryHigh from VAWFarmerPestDetailsEntry i left join PestDisease j on i.PestDiseaseCode = j.PestDiseaseCode where i.ReferenceNo = :reference_no', {
        replacements: { reference_no: referenceNo }, type: sequelize.QueryTypes.SELECT
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

exports.getPestPopulation = function(pestDiseaseCode) {
    return sequelize.query('select pdi.PestDiseaseCode, pd.PestDiseaseName, pdi.HighIntensityPopulation, pdi.ModerateIntensityPopulation from PestDiseaseIntensity pdi inner join PestDisease pd on pdi.PestDiseaseCode = pd.PestDiseaseCode where pdi.PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestDiseaseCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPesticide = function(pestDiseaseCode) {
    return sequelize.query('select * from Pesticide where PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestDiseaseCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.updatePestDetails = function(obj, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('ReferenceNo', obj.ReferenceNo);
        request.input('InfectionIdentified', obj.InfectionIdentified);
        request.input('PestDiseaseCode', obj.PestDiseaseCode);
        request.input('AreaOfLand', obj.AreaOfLand);
        request.input('LowIntensityAttackArea', obj.LowIntensityAttackArea);
        request.input('MediumIntensityAttackArea', obj.MediumIntensityAttackArea);
        request.input('HighIntensityAttackArea', obj.HighIntensityAttackArea);
        request.input('LowIntensityTreatedArea', obj.LowIntensityTreatedArea);
        request.input('MediumIntensityTreatedArea', obj.MediumIntensityTreatedArea);
        request.input('HighIntensityTreatedArea', obj.HighIntensityTreatedArea);
        request.input('ModerateIntensityPestPopulation', obj.ModerateIntensityPestPopulation);
        request.input('HighIntensityPestPopulation', obj.HighIntensityPestPopulation);
        request.input('AdvisoryModerate', obj.AdvisoryModerate);
        request.input('AdvisoryHigh', obj.AdvisoryHigh);
        request.input('JDAPPUserID', obj.JDAPPUserID);
        request.input('JDAPPStatus', obj.JDAPPStatus);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.execute('spUpdatePestDetailsJDAPP', function(err, result) {
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

exports.updateMADetails = function(arr, obj, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        const tableVAWRefNo = new sql.Table();
        tableVAWRefNo.create = true;
        tableVAWRefNo.columns.add('ReferenceNo', sql.VarChar(30), {nullable: false, primary: true});
        for (var i = 0; i < arr.length; i++) {
            tableVAWRefNo.rows.add(arr[i].ReferenceNo);
        }
        request.input('InfectionIdentified', obj.pi);
        request.input('AdvisoryModerate', obj.ma);
        request.input('AdvisoryHigh', obj.ha);
        request.input('JDAPPUserID', obj.JDAPPUserID);
        request.input('JDAPPStatus', obj.JDAPPStatus);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.input('tableVAWRefNo', tableVAWRefNo);
        request.execute('spUpdateAdvisoryJDAPP', function(err, result) {
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

exports.submitDetails = function(arr, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableJDAPPSubmit = new sql.Table();
        tableJDAPPSubmit.create = true;
        tableJDAPPSubmit.columns.add('ReferenceNo', sql.VarChar(30), {nullable: false, primary: true});
        tableJDAPPSubmit.columns.add('JDAPPAdvisoryModerate', sql.VarChar(1000), {nullable: true});
        tableJDAPPSubmit.columns.add('JDAPPAdvisoryHigh', sql.VarChar(1000), {nullable: true});
        tableJDAPPSubmit.columns.add('JDAPPUserID', sql.VarChar(30), {nullable: false});
        tableJDAPPSubmit.columns.add('JDAPPStatus', sql.Bit, {nullable: false});
        tableJDAPPSubmit.columns.add('Status', sql.Bit, {nullable: false});
        tableJDAPPSubmit.columns.add('IPAddress', sql.VarChar(50), {nullable: false});
        tableJDAPPSubmit.columns.add('FinancialYear', sql.VarChar(10), {nullable: false});
        for (var i = 0; i < arr.length; i++) {
            tableJDAPPSubmit.rows.add(arr[i].ReferenceNo, arr[i].JDAPPAdvisoryModerate, arr[i].JDAPPAdvisoryHigh, arr[i].JDAPPUserID, arr[i].JDAPPStatus, arr[i].Status, arr[i].IPAddress, arr[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('tableJDAPPSubmit', tableJDAPPSubmit);
        request.execute('spJDAPPSubmit', function(err, result) {
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

exports.getAAOVAWMobileNo = function(blockCode) {
    return sequelize.query('select AAOMobileNo as MobileNo from AAOBlockMapping where BlockCode = :block_code select VAWMobileNo as MobileNo from VAWGPMapping where BlockCode = :block_code group by VAWMobileNo', {
        replacements: { block_code : blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitBAS = function(obj, callback) {
    sequelize.query('insert into BlockwiseAdvisorySMS (AdvisorySMS, DistrictCode, BlockCode, Status, DateTime, IPAddress, FinancialYear) values (:advisory_sms, :district_code, :block_code, :status, getdate(), :ip_address, :financial_year)', {
    replacements: { advisory_sms: obj.AdvisorySMS, district_code: obj.DistrictCode, block_code: obj.BlockCode, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getAdvisorySMS = function() {
    return sequelize.query('select AdvisorySMS, a.DistrictCode, DistrictName, a.BlockCode, BlockName, convert(varchar(10), DateTime, 105) as Date from BlockwiseAdvisorySMS a inner join LGDDistrict b on a.DistrictCode = b.DistrictCode inner join LGDBlock c on a.BlockCode = c.BlockCode', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestIntensity = function(pestCode) {
    return sequelize.query('select * from PestDiseaseIntensity where PestDiseaseCode = :pest_code', {
        replacements: { pest_code: pestCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitETL = function(obj, arr, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableETLEntry = new sql.Table();
        tableETLEntry.create = true;
        tableETLEntry.columns.add('PestDiseaseCode', sql.Int, {nullable: false, primary: true});
        tableETLEntry.columns.add('ModerateIntensityPopulation', sql.VarChar(300), {nullable: false});
        tableETLEntry.columns.add('HighIntensityPopulation', sql.VarChar(100), {nullable: false});
        for (var i = 0; i < arr.length; i++) {
            tableETLEntry.rows.add(arr[i].PestDiseaseDetails.PestDiseaseCode, arr[i].ModerateIntensityPopulation, arr[i].HighIntensityPopulation);
        }
        const request = new sql.Request(con);
        request.input('CropCode', obj.CropCode);
        request.input('tableETLEntry', tableETLEntry);
        request.execute('spSubmitETL', function(err, result) {
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

exports.getAAODetails = function(districtCode) {
    return sequelize.query('select a.AAOMobileNo, a.AAOName, a.AAOCode, b.BlockName from AAOBlockMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode where b.DistrictCode = :district_code', {
        replacements: { district_code : districtCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getDashboardDetails = function(callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.execute('spGetJDAPPDashboardDetails', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else{
                callback(result.recordsets);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWDetails = function(blockCode) {
    return sequelize.query('select a.VAWCode, a.VAWName, a.VAWMobileNo, b.GPName, a.Status from VAWGPMapping a inner join LGDGP b on a.GPCode = b.GPCode where a.BlockCode = :block_code', {
        replacements: { block_code : blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWGPDetails = function(blockCode, season, financialYear) {
    return sequelize.query('select b.VAWCode, a.VAWMobileNo, a.VAWName, c.GPName from VAWGPMapping a inner join VAWGPTargets b on a.GPCode = b.GPCode inner join LGDGP c on c.GPCode = b.GPCode where a.BlockCode = :block_code and a.Status = 1 and Season = :season and b.FinancialYear = :financial_year', {
        replacements: { block_code : blockCode, season: season, financial_year: financialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWGPAllocatedDetails = function (districtCode, status, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DistrictCode', districtCode);
        request.input('Status', status);
        request.execute('spGetVAWGPAUDetails', function (err, result) {
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

exports.getAllCDAODetails = function () {
    return sequelize.query('select CDAOUserID, b.DistrictName, CDAOName, CDAOMobileNo, CDAOAadhaarNo, Status from CDAODistrictMapping a inner join LGDDistrict b on a.DistrictCode = b.DistrictCode', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitCDAODetails = function (obj, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('CDAOUserID', obj.CDAOUserID);
        request.input('CDAOName', obj.CDAOName);
        request.input('CDAOMobileNo', obj.CDAOMobileNo);
        request.input('CDAOAadhaarNo', obj.CDAOAadhaarNo);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.execute('spSubmitCDAODetails', function(err, result) {
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

exports.getPestDetails = function(dateOfEntry, season, financialYear, districtCode, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, callback) {
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
        request.input('UserType', userType);
        request.input('Username', username);
        request.input('Role', role);
        request.execute('spGetPDJDAPPOUAT', function(err, result) {
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

exports.getAllADODetails = function () {
    return sequelize.query('select c.DistrictName, a.ADOName, a.ADOAadhaarNo, a.ADOMobileNo, a.ADOCode, b.BlockName, b.BlockCode, a.DistrictCode, a.Status  from ADODistBlockMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode inner join LGDDistrict c on c.DistrictCode = a.DistrictCode', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitADODetails = function (obj, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('ADOCode', obj.ADOCode);
        request.input('ADOName', obj.ADOName);
        request.input('ADOMobileNo', obj.ADOMobileNo);
        request.input('ADOAadhaarNo', obj.ADOAadhaarNo);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.execute('spSubmitADODetails', function(err, result) {
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

exports.getGISMapDetails = function(financialYear, season, districtCode, dateOfEntry) {
    if (districtCode != 0) {
        return sequelize.query("select a.ReferenceNo, FixedLandLatitude, FixedLandLongitude, CropName, case when PestDiseaseName is null then 'NA' else PestDiseaseName end as PestName, MediumIntensityAttackArea, HighIntensityAttackArea, MediumIntensityTreatedArea, HighIntensityTreatedArea, DistrictName, BlockName, GPName, VillageName from VAWFarmerPhotoLocationEntry a inner join VAWFarmerCropDetailsEntry b on a.ReferenceNo = b.ReferenceNo inner join Crop c on b.CropCode = c.CropCode inner join VAWFarmerPestDetailsEntry d on d.ReferenceNo = b.ReferenceNo left join PestDisease e on e.PestDiseaseCode = d.PestDiseaseCode inner join LGDGP f on f.GPCode = b.GPCode inner join LGDBlock g on g.BlockCode = f.BlockCode inner join LGDDistrict h on h.DistrictCode = g.DistrictCode inner join LGDVillage i on i.VillageCode = b.VillageCode where a.FinancialYear = :financial_year and b.Season = :season and g.DistrictCode = :district_code and convert(datetime, convert(varchar(10), b.DateTime, 103), 103) = :date_of_entry", {
            replacements: { financial_year: financialYear, season: season, district_code: districtCode, date_of_entry: dateOfEntry }, type: sequelize.QueryTypes.SELECT
        }).then(function success(data) {
            return data;
        }).catch(function error(err) {
            console.log('An error occurred...', err);
        });
    }
    else {
        return sequelize.query("select a.ReferenceNo, FixedLandLatitude, FixedLandLongitude, CropName, case when PestDiseaseName is null then 'NA' else PestDiseaseName end as PestName, MediumIntensityAttackArea, HighIntensityAttackArea, MediumIntensityTreatedArea, HighIntensityTreatedArea, DistrictName, BlockName, GPName, VillageName from VAWFarmerPhotoLocationEntry a inner join VAWFarmerCropDetailsEntry b on a.ReferenceNo = b.ReferenceNo inner join Crop c on b.CropCode = c.CropCode inner join VAWFarmerPestDetailsEntry d on d.ReferenceNo = b.ReferenceNo left join PestDisease e on e.PestDiseaseCode = d.PestDiseaseCode inner join LGDGP f on f.GPCode = b.GPCode inner join LGDBlock g on g.BlockCode = f.BlockCode inner join LGDDistrict h on h.DistrictCode = g.DistrictCode inner join LGDVillage i on i.VillageCode = b.VillageCode where a.FinancialYear = :financial_year and b.Season = :season and convert(datetime, convert(varchar(10), b.DateTime, 103), 103) = :date_of_entry", {
            replacements: { financial_year: financialYear, season: season, district_code: districtCode, date_of_entry: dateOfEntry }, type: sequelize.QueryTypes.SELECT
        }).then(function success(data) {
            return data;
        }).catch(function error(err) {
            console.log('An error occurred...', err);
        });
    }
};

exports.getPestPhoto = function(refNo) {
    return sequelize.query('select FixedLandPhoto from VAWFarmerPhotoLocationEntry where ReferenceNo = :ref_no', {
        replacements: { ref_no: refNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.removeRefNo = function (referenceNo, callback) {
    sequelize.query('update VAWFarmerCropDetailsEntry set Status = 0 where ReferenceNo = :reference_no', {
        replacements: { reference_no: referenceNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWRecordDetails = function(vawCode) {
    return sequelize.query('select DistrictName, BlockName, GPName, VAWName, VAWMobileNo from VAWGPMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode inner join LGDDistrict c on c.DistrictCode = b.DistrictCode inner join LGDGP d on d.GPCode = a.GPCode where VAWCode = :vaw_code', {
        replacements: { vaw_code : vawCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWInspectionDetails = function(dateOfEntry, season, financialYear, districtCode, blockCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('DistrictCode', districtCode);
        request.input('BlockCode', blockCode);
        request.execute('spGetVAWInspectionReport', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordset);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPesticideDetails = function (pestdiseaseCode) {
    return sequelize.query('select * from Pesticide where PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestdiseaseCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.updateAdvisoryDetails = function (arr, obj, pestCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableAdvisoryModifyEntry = new sql.Table();
        tableAdvisoryModifyEntry.create = true;
        tableAdvisoryModifyEntry.columns.add('PesticideCode', sql.Int, { nullable: false });
        tableAdvisoryModifyEntry.columns.add('PesticideName', sql.VarChar(300), { nullable: false });
        tableAdvisoryModifyEntry.columns.add('PesticideNameOdia', sql.NVarChar(300), { nullable: false });
        tableAdvisoryModifyEntry.columns.add('RecommendedDose', sql.VarChar(100), { nullable: false });
        tableAdvisoryModifyEntry.columns.add('RecommendedDoseOdia', sql.NVarChar(100), { nullable: false });
        for (var i = 0; i < arr.length; i++) {
            tableAdvisoryModifyEntry.rows.add(arr[i].PesticideCode, arr[i].PesticideName, arr[i].PesticideNameOdia, arr[i].RecommendedDose, arr[i].RecommendedDoseOdia);
        }
        const request = new sql.Request(con);
        request.input('PestdiseaseCode', pestCode);
        request.input('JDAPPUserID', obj.JDAPPUserID);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.input('tableAdvisoryModifyEntry', tableAdvisoryModifyEntry);
        request.execute('spUpdateAdvisoryDetails', function (err, result) {
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

exports.getLTCCrops = function() {
    return sequelize.query("select CropCode, CropName, CategoryCode, CategoryName from crop a inner join CropCategory b on a.CropCategoryCode = b.CategoryCode where Status = 'LTC'", {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getLTCPestDiseases = function(cropCode) {
    return sequelize.query("select PestDiseaseCode, PestDiseaseName from PestDisease a inner join Crop b on a.CropCode = b.CropCode where ((a.CropCode = :crop_code and a.Status = 'LTC') or (CropCategoryCode = :crop_code and a.Status = 'LTC' and b.Status = 'LTC'))", {
        replacements: { crop_code: cropCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getLTCDetails = function(dateOfEntry, season, financialYear, districtCode, blockCode, cropCode, pestDiseaseCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('DistrictCode', districtCode);
        request.input('BlockCode', blockCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.execute('spGetLTCReport', function(err, result) {
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

exports.getETLDetails = function (pestdiseaseCode) {
    return sequelize.query('select ModerateIntensityPopulation, HighIntensityPopulation from PestDiseaseIntensity where PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestdiseaseCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.updateETLDetails = function (arr,obj,pestCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableETLModifyEntry = new sql.Table();
        tableETLModifyEntry.create = true;
        tableETLModifyEntry.columns.add('PestdiseaseCode', sql.Int, { nullable: false });
        tableETLModifyEntry.columns.add('ModerateIntensityPopulation', sql.VarChar(100), { nullable: false });
        tableETLModifyEntry.columns.add('HighIntensityPopulation', sql.VarChar(100), { nullable: false });
        for (var i = 0; i < arr.length; i++) {
            tableETLModifyEntry.rows.add(arr[i].PestdiseaseCode, arr[i].ModerateIntensityPopulation, arr[i].HighIntensityPopulation);
        }
        const request = new sql.Request(con);
        request.input('PestdiseaseCode', pestCode);
        request.input('JDAPPUserID', obj.JDAPPUserID);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.input('tableETLModifyEntry', tableETLModifyEntry);
        request.execute('spUpdateETLDetails', function (err, result) {
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

exports.removeAD = function (pesticideCode, jdappUserID, ipAddress, financialYear, callback) {
    sequelize.query('insert into PesticideLog (PesticideCode, PesticideName, RecommendedDose, PestDiseaseCode, JDAPPUserID, DateTime, IPAddress, FinancialYear) select PesticideCode, PesticideName, RecommendedDose, PestDiseaseCode, :jdapp_user_id, getdate(), :ip_address, :financial_year from Pesticide where PesticideCode = :pesticide_code delete from Pesticide where PesticideCode = :pesticide_code', {
        replacements: { pesticide_code: pesticideCode, jdapp_user_id: jdappUserID, ip_address: ipAddress, financial_year: financialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.removeETL = function (pestDiseaseCode, jdappUserID, ipAddress, financialYear, callback) {
    sequelize.query('insert into PestDiseaseIntensityLog (PestDiseaseCode, ModerateIntensityPopulation, HighIntensityPopulation, JDAPPUserID, DateTime, IPAddress, FinancialYear) select PestDiseaseCode, ModerateIntensityPopulation, HighIntensityPopulation, :jdapp_user_id, getdate(), :ip_address, :financial_year from PestDiseaseIntensity where PestDiseaseCode = :pest_disease_code delete from PestDiseaseIntensity where PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestDiseaseCode, jdapp_user_id: jdappUserID, ip_address: ipAddress, financial_year: financialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(true);
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
    return sequelize.query('select a.GPCode, GPName from VAWGPTargets a left join LGDGP b on a.GPCode = b.GPCode left join LGDBlock c on c.BlockCode = b.BlockCode where c.BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getSurveyGP = function (dateOfEntry, blockCode, callback) {
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

exports.getEMRRefNos = function (cropCode) {
    return sequelize.query("declare @endDate datetime, @weekDay varchar(10), @diffDate int set @weekDay = (select datename(w, getdate())) set @diffDate = (case when @weekDay = 'Monday' then 0 when @weekDay = 'Tuesday' then 1 when @weekDay = 'Wednesday' then 2 when @weekDay = 'Thursday' then 3 when @weekDay = 'Friday' then 4 when @weekDay = 'Saturday' then 5 else null end) set @endDate = (select dateadd(d, -@diffDate, convert(datetime, getdate(), 103))) select distinct(a.EMRReferenceNo), convert(varchar(10), a.DateTime, 105) as Date, MobileNo, case when (b.EMRReferenceNo is null) then 'Pending' when (b.EMRReferenceNo is not null and b.InfectionIdentified = 'No') then 'Pest is not identified' end as ADOStatus, case when ((b.EMRReferenceNo is null and c.EMRReferenceNo is null) or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and b.InfectionIdentified = 'No')) then 'Pending' when ((b.EMRReferenceNo is null and c.EMRReferenceNo is not null and c.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and c.InfectionIdentified = 'No' and b.InfectionIdentified = 'No')) then 'Pest is not identified' end as JDAPPStatus, case when ((b.EMRReferenceNo is null and c.EMRReferenceNo is null and d.EMRReferenceNo is null) or (b.EMRReferenceNo is null and c.EMRReferenceNo is not null and d.EMRReferenceNo is null and c.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and d.EMRReferenceNo is null and b.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and d.EMRReferenceNo is null and b.InfectionIdentified = 'No' and c.InfectionIdentified = 'No')) then 'Pending' when ((b.EMRReferenceNo is null and c.EMRReferenceNo is null and d.EMRReferenceNo is not null and d.InfectionIdentified = 'No') or (b.EMRReferenceNo is null and c.EMRReferenceNo is not null and d.EMRReferenceNo is not null and c.InfectionIdentified = 'No' and d.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and d.EMRReferenceNo is not null and b.InfectionIdentified = 'No' and d.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and d.EMRReferenceNo is not null and b.InfectionIdentified = 'No' and c.InfectionIdentified = 'No' and d.InfectionIdentified = 'No')) then 'Pest is not identified' end as OUATStatus from EMRFarmerDetailsEntry a left join EMRADO b on a.EMRReferenceNo = b.EMRReferenceNo left join EMRJDAPP c on a.EMRReferenceNo = c.EMRReferenceNo left join EMROUAT d on a.EMRReferenceNo = d.EMRReferenceNo where ((b.EMRReferenceNo is not null and b.InfectionIdentified = 'No' and convert(datetime, convert(varchar(10), a.DateTime, 103), 103) between convert(datetime, convert(varchar(10), @endDate, 103), 103) and convert(datetime, convert(varchar(10), getdate(), 103), 103)) or (b.EMRReferenceNo is null and convert(datetime, convert(varchar(10), a.DateTime, 103), 103) between convert(datetime, convert(varchar(10), dateadd(d, -7, @endDate), 103), 103) and convert(datetime, convert(varchar(10), dateadd(d, -2, @endDate), 103), 103))) and c.EMRReferenceNo is null and d.EMRReferenceNo is null and CropCode = :crop_code", {
        replacements: { crop_code: cropCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getEMRRefNoDetails = function (refNo) {
    return sequelize.query('select distinct(a.EMRReferenceNo), a.MobileNo, a.DistrictCode, a.BlockCode, d.BlockName, e.GPName, a.CropCategoryCode, a.CropCode, a.FixedLandPhoto, a.RandomLandPhoto1, a.RandomLandPhoto2, a.FixedLandLatitude, a.FixedLandLongitude, a.RandomLandLatitude1, a.RandomLandLongitude1, a.RandomLandLatitude2, a.RandomLandLongitude2, b.CategoryName, c.CropName from EMRFarmerDetailsEntry a inner join CropCategory b on b.CategoryCode = a.CropCategoryCode inner join Crop c on c.CropCode = a.CropCode inner join LGDBlock d on d.BlockCode = a.BlockCode inner join LGDGP e on e.GPCode = substring(a.EMRReferenceNo, 13, 6) where a.EMRReferenceNo = :ref_No', {
        replacements: { ref_No: refNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitEMRDetails = function (obj, callback) {
    sequelize.query('insert into EMRJDAPP (EMRReferenceNo, InfectionIdentified, PestDiseaseCode, ModerateIntensityPestPopulation, HighIntensityPestPopulation, AdvisoryModerate, AdvisoryHigh, JDAPPUserID, JDAPPStatus, Status, DateTime, IPAddress, FinancialYear) values (:emr_reference_no, :infection_identified, :pest_disease_code, :moderate_intensity_pestPopulation, :high_intensity_pestPopulation, :advisory_moderate, :advisory_high, :jdapp_code, :jdapp_status, :status, getdate(), :ip_address, :financial_year)', {
        replacements: { emr_reference_no: obj.EMRReferenceNo, infection_identified: obj.InfectionIdentified, pest_disease_code: obj.PestDiseaseCode, moderate_intensity_pestPopulation: obj.ModerateIntensityPestPopulation, high_intensity_pestPopulation: obj.HighIntensityPestPopulation, advisory_moderate: obj.AdvisoryModerate, advisory_high: obj.AdvisoryHigh, jdapp_code: obj.JDAPPUserID, jdapp_status: obj.JDAPPStatus, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getEMRNos = function(dateOfEntry, cropCategory, crop, financialYear, districtCode, blockCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('CropCategoryCode', cropCategory);
        request.input('CropCode', crop);
        request.input('FinancialYear', financialYear);
        request.input('DistrictCode', districtCode);
        request.input('BlockCode', blockCode);
        request.execute('spGetEMRReferenceNoDetails', function(err, result) {
            if (err) {
                console.log('An error occurred...', err);
            }
            else {
                callback(result.recordset);
            }
            con.close();
        });
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getEMRReferenceNoDetails = function (emrRefNo) {
    return sequelize.query('select a.*, j.PestDiseaseName from (select distinct(a.EMRReferenceNo), a.MobileNo, a.DistrictCode, g.DistrictName, a.BlockCode, h.BlockName, a.GPCode, i.GPName, a.CropCategoryCode, e.CategoryName, a.CropCode, f.CropName, a.FixedLandPhoto, a.RandomLandPhoto1, a.RandomLandPhoto2, a.FixedLandLatitude, a.FixedLandLongitude, a.RandomLandLatitude1, a.RandomLandLongitude1, a.RandomLandLatitude2, a.RandomLandLongitude2, case when (b.PestDiseaseCode is not null) then b.PestDiseaseCode when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.PestDiseaseCode when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.PestDiseaseCode end as PestDiseaseCode, case when (b.PestDiseaseCode is not null) then b.ModerateIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.ModerateIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.ModerateIntensityPestPopulation end as ModerateIntensityPestPopulation, case when (b.PestDiseaseCode is not null) then b.HighIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.HighIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.HighIntensityPestPopulation end as HighIntensityPestPopulation, case when (b.PestDiseaseCode is not null) then b.AdvisoryModerate when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.AdvisoryModerate when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.AdvisoryModerate end as AdvisoryModerate, case when (b.PestDiseaseCode is not null) then b.AdvisoryHigh when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.AdvisoryHigh when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.AdvisoryHigh end as AdvisoryHigh from EMRFarmerDetailsEntry a left join EMRADO b on a.EMRReferenceNo = b.EMRReferenceNo left join EMRJDAPP c on a.EMRReferenceNo = c.EMRReferenceNo left join EMROUAT d on a.EMRReferenceNo = d.EMRReferenceNo inner join CropCategory e on a.CropCategoryCode = e.CategoryCode inner join Crop f on a.CropCode = f.CropCode inner join LGDDistrict g on a.DistrictCode = g.DistrictCode inner join LGDBlock h on a.BlockCode = h.BlockCode inner join LGDGP i on substring(a.EMRReferenceNo, 13, 6) = i.GPCode) a left join PestDisease j on a.PestDiseaseCode =  j.PestDiseaseCode where a.EMRReferenceNo = :emr_ref_no', {
        replacements: { emr_ref_no: emrRefNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropCategoryPestDiseases = function(cropCategoryCode) {
    return sequelize.query('select PestDiseaseCode, PestDiseaseName from PestDisease a inner join Crop b on a.CropCode = b.CropCode inner join CropCategory c on c.CategoryCode = b.CropCategoryCode where c.CategoryCode = :crop_category_code and a.IsActive = 1 and b.IsActive = 1 and c.IsActive = 1', {
        replacements: { crop_category_code: cropCategoryCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestGraphData = function(arr, callback) {
    return sequelize.query('select PestDiseaseName, a.PestDiseaseCode, sum(MediumIntensityAttackArea + HighIntensityAttackArea) as totalAffectedArea from VAWFarmerPestDetailsEntry a right join PestDisease b on a.PestDiseaseCode = b.PestDiseaseCode where a.PestDiseaseCode in(:status) group by PestDiseaseName, a.PestDiseaseCode', {
        replacements: { status: arr }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(data);
        console.log(data);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getGraphforCrop = function() {
    return sequelize.query('select sum(MediumAffectedArea + HighAffectedArea) as totalAffectedArea, b.CategoryName, CropCategoryCode from AAOPestDetailsEntry a left join CropCategory b on a.CropCategoryCode = b.CategoryCode and b.IsActive = 1 group by CropCategoryCode, b.CategoryName', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        console.log(data);
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropDetailsCategory = function(cropCategoryCode) {
    return sequelize.query('select sum(MediumAffectedArea + HighAffectedArea) as totalAffectedArea, b.CropName, b.CropCode from AAOPestDetailsEntry a left join Crop b on a.CropCategoryCode = b.CropCategoryCode where a.CropCategoryCode = :crop_category_code and b.IsActive = 1 group by b.CropCode, CropName', {
        replacements: { crop_category_code: cropCategoryCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        console.log(data);
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};