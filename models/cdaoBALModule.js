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

exports.getDistrict = function(username) {
    return sequelize.query('select a.DistrictCode, DistrictName from CDAODistrictMapping a inner join LGDDistrict b on a.DistrictCode = b.DistrictCode where a.CDAOUserID = :user_name', {
        replacements: { user_name: username }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getBlocks = function(username) {
    return sequelize.query('select BlockCode, BlockName from LGDBlock a inner join CDAODistrictMapping b on a.DistrictCode = b.DistrictCode where BlockCode not in (select BlockCode from AAOBlockMapping) and b.CDAOUserID = :user_name', {
        replacements: { user_name: username }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.checkMobileNo = function(mobileNo) {
    return sequelize.query('select distinct(AAOMobileNo) from AAOBlockMapping where AAOMobileNo = :mobile_no', {
        replacements: { mobile_no: mobileNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.registerAAO = function(aaoData, userData, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableAAOBlock = new sql.Table();
        tableAAOBlock.create = true;
        tableAAOBlock.columns.add('AAOCode', sql.VarChar(10), {nullable: false, primary: true});
        tableAAOBlock.columns.add('BlockCode', sql.Int, {nullable: false, primary: true});
        tableAAOBlock.columns.add('AAOName', sql.VarChar(50), {nullable: false});
        tableAAOBlock.columns.add('AAOMobileNo', sql.VarChar(10), {nullable: false});
        tableAAOBlock.columns.add('AAOEmailID', sql.VarChar(30), {nullable: true});
        tableAAOBlock.columns.add('AAOSignature', sql.VarBinary(8000), {nullable: true});
        tableAAOBlock.columns.add('AAOAadhaarNo', sql.VarChar(100), {nullable: true});
        tableAAOBlock.columns.add('CDAOUserID', sql.VarChar(30), {nullable: false});
        tableAAOBlock.columns.add('Status', sql.Bit, {nullable: false});
        tableAAOBlock.columns.add('IPAddress', sql.VarChar(50), {nullable: false});
        tableAAOBlock.columns.add('FinancialYear', sql.VarChar(10), {nullable: false});
        for (var i = 0; i < aaoData.length; i++) {
            tableAAOBlock.rows.add(aaoData[i].AAOCode, aaoData[i].BlockCode, aaoData[i].AAOName, aaoData[i].AAOMobileNo, aaoData[i].AAOEmailID, aaoData[i].AAOSignature, aaoData[i].AAOAadhaarNo, aaoData[i].CDAOUserID, aaoData[i].Status, aaoData[i].IPAddress, aaoData[i].FinancialYear);
        }
        const tableUserLogin = new sql.Table();
        tableUserLogin.create = true;
        tableUserLogin.columns.add('UserID', sql.VarChar(50), {nullable: false, primary: true});
        tableUserLogin.columns.add('PasswordHash', sql.NVarChar(100), {nullable: false});
        tableUserLogin.columns.add('RoleID', sql.VarChar(10), {nullable: false});
        tableUserLogin.columns.add('ContactNo', sql.VarChar(10), {nullable: false});
        tableUserLogin.columns.add('EmailID', sql.VarChar(50), {nullable: true});
        tableUserLogin.columns.add('LockOutEnabled', sql.Bit, {nullable: false});
        tableUserLogin.columns.add('AccessFailedCount', sql.Int, {nullable: false});
        tableUserLogin.columns.add('Status', sql.Bit, {nullable: false});
        tableUserLogin.columns.add('IPAddress', sql.VarChar(50), {nullable: false});
        tableUserLogin.columns.add('FinancialYear', sql.VarChar(10), {nullable: false});
        for (var i = 0; i < userData.length; i++) {
            tableUserLogin.rows.add(userData[i].UserID, userData[i].PasswordHash, userData[i].RoleID, userData[i].ContactNo, userData[i].EmailID, userData[i].LockOutEnabled, userData[i].AccessFailedCount, userData[i].Status, userData[i].IPAddress, userData[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('tableAAOBlock', tableAAOBlock);
        request.input('tableUserLogin', tableUserLogin);
        request.execute('spRegisterAAO', function(err, result) {
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

exports.getRegisteredAAOs = function(cdaoUserID) {
    return sequelize.query('select AAOCode, AAOName, AAOMobileNo, abm.BlockCode, BlockName from AAOBlockMapping abm inner join LGDBlock lb on abm.BlockCode = lb.BlockCode where CDAOUserID = :cdao_user_id', {
        replacements: { cdao_user_id: cdaoUserID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.removeAAO = function(aaoCode, blockCode, callback) {
    return sequelize.query('select AAOMobileNo, BlockName from AAOBlockMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode where AAOCode = :aao_code and a.BlockCode = :block_code delete from AAOBlockMapping where AAOCode = :aao_code and BlockCode = :block_code', {
        replacements: { aao_code: aaoCode, block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(data);
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

exports.getAAODetailsReport = function(cdaoUserID) {
    return sequelize.query('select a.AAOCode, b.BlockName, a.AAOMobileNo, a.AAOName from AAOBlockMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode where CDAOUserID = :cdao_userid', {
        replacements: { cdao_userid : cdaoUserID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getBlocksByDistrict = function(username) {
    return sequelize.query('select BlockCode, BlockName from LGDBlock a inner join CDAODistrictMapping b on a.DistrictCode = b.DistrictCode where b.CDAOUserID = :user_name', {
        replacements: { user_name: username }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWDetailsReport = function(blockCode) {
    return sequelize.query('select VAWCode, VAWName, VAWMobileNo, GPName, Status from VAWGPMapping a inner join LGDGP b on a.GPCode = b.GPCode where a.BlockCode = :block_code', {
        replacements: { block_code : blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWDPTargets = function(blockCode) {
    return sequelize.query('select b.VAWCode, a.VAWMobileNo, a.VAWName, c.GPName from VAWGPMapping a inner join VAWGPTargets b on a.GPCode = b.GPCode inner join LGDGP c on c.GPCode = b.GPCode where a.BlockCode = :block_code and a.Status = 1', {
        replacements: { block_code : blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getDashboardDetails = function(cdaoUserID, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('CDAOUserID', cdaoUserID);
        request.execute('spGetCDAODashboardDetails', function(err, result) {
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

exports.getAllPestDiseases = function(cropCode, callback) {
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

exports.getPestDetails = function(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, username, role, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('BlockCode', blockCode);
        request.input('CropCategoryCode', cropCategoryCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('Username', username);
        request.input('Role', role);
        request.execute('spGetPestDetails', function(err, result) {
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

exports.updatePDE = function (objData, arrData, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableCDAOPestDetailsEntry = new sql.Table();
        tableCDAOPestDetailsEntry.create = true;
        tableCDAOPestDetailsEntry.columns.add('GPCode', sql.Int, { nullable: false });
        tableCDAOPestDetailsEntry.columns.add('LowAffectedArea', sql.Decimal(18, 3), {nullable: false});
        tableCDAOPestDetailsEntry.columns.add('MediumAffectedArea', sql.Decimal(18, 3), {nullable: false});
        tableCDAOPestDetailsEntry.columns.add('HighAffectedArea', sql.Decimal(18, 3), {nullable: false});
        tableCDAOPestDetailsEntry.columns.add('LowTreatedArea', sql.Decimal(18, 3), {nullable: false});
        tableCDAOPestDetailsEntry.columns.add('MediumTreatedArea', sql.Decimal(18, 3), {nullable: false});
        tableCDAOPestDetailsEntry.columns.add('HighTreatedArea', sql.Decimal(18, 3), {nullable: false});
        for (var i = 0; i < arrData.length; i++) {
            tableCDAOPestDetailsEntry.rows.add(arrData[i].GPCode, arrData[i].LowAffectedArea, arrData[i].MediumAffectedArea, arrData[i].HighAffectedArea, arrData[i].LowTreatedArea, arrData[i].MediumTreatedArea, arrData[i].HighTreatedArea);
        }
        const request = new sql.Request(con);
        request.input('DateTime', objData.DateTime);
        request.input('Season', objData.Season);
        request.input('FinancialYear', objData.FinancialYear);
        request.input('BlockCode', objData.BlockCode);
        request.input('CropCategoryCode', objData.CropCategoryCode);
        request.input('CropCode', objData.CropCode);
        request.input('PestDiseaseCode', objData.PestDiseaseCode);
        request.input('CDAOUserID', objData.CDAOUserID);
        request.input('tableCDAOPestDetailsEntry', tableCDAOPestDetailsEntry);
        console.log(objData);
        console.log(arrData);
        request.execute('spCDAOUpdatePDE', function (err, result) {
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

exports.getBlocksByCDAO = function(username) {
    return sequelize.query('select b.BlockCode, BlockName from CDAODistrictMapping a inner join LGDBlock b on a.DistrictCode = b.DistrictCode where CDAOUserID = :user_name', {
        replacements: { user_name : username }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCDAOPestDetails = function(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('BlockCode', blockCode);
        request.input('CropCategoryCode', cropCategoryCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('UserType', userType);
        request.input('Username', username);
        request.input('Role', role);
        request.execute('spGetCDAOPestDetails', function(err, result) {
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

exports.getLTCDetails = function(dateOfEntry, season, financialYear, blockCode, cropCode, pestDiseaseCode, username, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('BlockCode', blockCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('Username', username);
        request.execute('spGetCDAOLTCReport', function(err, result) {
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

exports.getVAWInspectionDetails = function(dateOfEntry, season, financialYear, username, blockCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('Username', username);
        request.input('BlockCode', blockCode);
        request.execute('spGetCDAOVAWInspectionReport', function(err, result) {
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

exports.getEMRNosForCDAO = function(dateOfEntry, cropCategory, crop, financialYear, username, blockCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('CropCategoryCode', cropCategory);
        request.input('CropCode', crop);
        request.input('FinancialYear', financialYear);
        request.input('Username', username);
        request.input('BlockCode', blockCode);
        request.execute('spGetEMRNosForCDAODetails', function(err, result) {
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

exports.getEMRReferenceNoDetailsCDAO = function (emrRefNo) {
    return sequelize.query('select a.*, j.PestDiseaseName from (select distinct(a.EMRReferenceNo), a.MobileNo, a.DistrictCode, g.DistrictName, a.BlockCode, h.BlockName, a.GPCode, i.GPName, a.CropCategoryCode, e.CategoryName, a.CropCode, f.CropName, a.FixedLandPhoto, a.RandomLandPhoto1, a.RandomLandPhoto2, a.FixedLandLatitude, a.FixedLandLongitude, a.RandomLandLatitude1, a.RandomLandLongitude1, a.RandomLandLatitude2, a.RandomLandLongitude2, case when (b.PestDiseaseCode is not null) then b.PestDiseaseCode when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.PestDiseaseCode when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.PestDiseaseCode end as PestDiseaseCode, case when (b.PestDiseaseCode is not null) then b.ModerateIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.ModerateIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.ModerateIntensityPestPopulation end as ModerateIntensityPestPopulation, case when (b.PestDiseaseCode is not null) then b.HighIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.HighIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.HighIntensityPestPopulation end as HighIntensityPestPopulation, case when (b.PestDiseaseCode is not null) then b.AdvisoryModerate when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.AdvisoryModerate when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.AdvisoryModerate end as AdvisoryModerate, case when (b.PestDiseaseCode is not null) then b.AdvisoryHigh when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.AdvisoryHigh when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.AdvisoryHigh end as AdvisoryHigh from EMRFarmerDetailsEntry a left join EMRADO b on a.EMRReferenceNo = b.EMRReferenceNo left join EMRJDAPP c on a.EMRReferenceNo = c.EMRReferenceNo left join EMROUAT d on a.EMRReferenceNo = d.EMRReferenceNo inner join CropCategory e on a.CropCategoryCode = e.CategoryCode inner join Crop f on a.CropCode = f.CropCode inner join LGDDistrict g on a.DistrictCode = g.DistrictCode inner join LGDBlock h on a.BlockCode = h.BlockCode inner join LGDGP i on substring(a.EMRReferenceNo, 13, 6) = i.GPCode) a left join PestDisease j on a.PestDiseaseCode =  j.PestDiseaseCode where a.EMRReferenceNo = :emr_ref_no', {
        replacements: { emr_ref_no: emrRefNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getComplianceReport = function (dateOfEntry, season, userType, userName, financialYear, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('UserType', userType);
        request.input('Username', userName);
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

exports.getSurveyGP = function (dateOfEntry, blockCode, season, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('BlockCode', blockCode);
        request.input('Season', season);
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