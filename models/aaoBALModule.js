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

exports.getBlock = function (blockCode) {
    return sequelize.query('select BlockCode, BlockName from LGDBlock where BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getGPs = function (blockCode) {
    return sequelize.query('select GPCode, GPName from LGDGP where GPCode not in (select GPCode from VAWGPMapping where Status = 1) and BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWsCount = function () {
    return sequelize.query('select count(distinct VAWCode) as VAWCount from VAWGPMapping', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.checkMobileNo = function (mobileNo) {
    return sequelize.query('select distinct(VAWMobileNo) from VAWGPMapping where Status = 1 and VAWMobileNo = :mobile_no', {
        replacements: { mobile_no: mobileNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.registerVAW = function (obj, vawData, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableVAWGP = new sql.Table();
        tableVAWGP.create = true;
        tableVAWGP.columns.add('VAWCode', sql.VarChar(30), { nullable: false, primary: true });
        tableVAWGP.columns.add('GPCode', sql.Int, { nullable: false, primary: true });
        tableVAWGP.columns.add('VAWName', sql.VarChar(50), { nullable: false });
        tableVAWGP.columns.add('VAWMobileNo', sql.VarChar(10), { nullable: false });
        tableVAWGP.columns.add('VAWEmailID', sql.VarChar(30), { nullable: true });
        tableVAWGP.columns.add('VAWSignature', sql.VarBinary(8000), { nullable: true });
        tableVAWGP.columns.add('VAWAadhaarNo', sql.VarChar(100), { nullable: true });
        tableVAWGP.columns.add('AAOCode', sql.VarChar(10), { nullable: false });
        tableVAWGP.columns.add('BlockCode', sql.Int, { nullable: false });
        tableVAWGP.columns.add('Status', sql.Bit, { nullable: false });
        tableVAWGP.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableVAWGP.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        for (var i = 0; i < vawData.length; i++) {
            tableVAWGP.rows.add(vawData[i].VAWCode, vawData[i].GPCode, vawData[i].VAWName, vawData[i].VAWMobileNo, vawData[i].VAWEmailID, vawData[i].VAWSignature, vawData[i].VAWAadhaarNo, vawData[i].AAOCode, vawData[i].BlockCode, vawData[i].Status, vawData[i].IPAddress, vawData[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('UserID', obj.UserID);
        request.input('PasswordHash', obj.PasswordHash);
        request.input('RoleID', obj.RoleID);
        request.input('ContactNo', obj.ContactNo);
        request.input('EmailID', obj.EmailID);
        request.input('LockOutEnabled', obj.LockOutEnabled);
        request.input('AccessFailedCount', obj.AccessFailedCount);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.input('tableVAWGP', tableVAWGP);
        request.execute('spRegisterVAW', function (err, result) {
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

exports.getRegisteredVAWs = function (aaoCode) {
    return sequelize.query('select VAWCode, VAWName, VAWMobileNo, vgm.GPCode, GPName from VAWGPMapping vgm inner join LGDGP lg on vgm.GPCode = lg.GPCode where AAOCode = :aao_code and Status = 1', {
        replacements: { aao_code: aaoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.removeVAW = function (vawCode, gpCode, season, ipAddress, financialYear, callback) {
    return sequelize.query('select VAWMobileNo, GPName from VAWGPMapping a inner join LGDGP b on a.GPCode = b.GPCode where VAWCode = :vaw_code and a.GPCode = :gp_code update VAWGPMapping set Status = 0 where VAWCode = :vaw_code and GPCode = :gp_code insert into VAWGPTargetsLog (VAWCode, GPCode, Season, Status, DateTime, IPAddress, FinancialYear) values (:vaw_code, :gp_code, :season, 0, getdate(), :ip_address, :financial_year) delete from VAWGPTargets where VAWCode = :vaw_code and GPCode = :gp_code and Season = :season and FinancialYear = :financial_year', {
        replacements: { vaw_code: vawCode, gp_code: gpCode, season: season, ip_address: ipAddress, financial_year: financialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(data);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getUnallocatedGPs = function (blockCode) {
    return sequelize.query('select GPCode, GPName from LGDGP where GPCode in (select GPCode from VAWGPMapping where Status = 0 and GPCode not in (select GPCode from VAWGPMapping where Status = 1)) and BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getAllRegisteredVAWs = function (aaoCode) {
    return sequelize.query('select distinct(VAWCode), VAWName, VAWMobileNo from VAWGPMapping where AAOCode = :aao_code', {
        replacements: { aao_code: aaoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWDetails = function (vawCode) {
    return sequelize.query('select distinct(VAWName), VAWMobileNo, VAWAadhaarNo, AAOCode, BlockCode from VAWGPMapping where VAWCode = :vaw_code', {
        replacements: { vaw_code: vawCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.checkDupMobileNo = function (mobileNo, vawCode) {
    return sequelize.query('select distinct(VAWMobileNo) from VAWGPMapping where Status = 1 and VAWMobileNo = :mobile_no and VAWMobileNo not in (select distinct(VAWMobileNo) from VAWGPMapping where VAWCode = :vaw_code and Status = 1)', {
        replacements: { mobile_no: mobileNo, vaw_code: vawCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.assignVAWs = function (vawData, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableVAWGP = new sql.Table();
        tableVAWGP.create = true;
        tableVAWGP.columns.add('VAWCode', sql.VarChar(30), { nullable: false, primary: true });
        tableVAWGP.columns.add('GPCode', sql.Int, { nullable: false, primary: true });
        tableVAWGP.columns.add('VAWName', sql.VarChar(50), { nullable: false });
        tableVAWGP.columns.add('VAWMobileNo', sql.VarChar(10), { nullable: false });
        tableVAWGP.columns.add('VAWEmailID', sql.VarChar(30), { nullable: true });
        tableVAWGP.columns.add('VAWSignature', sql.VarBinary(8000), { nullable: true });
        tableVAWGP.columns.add('VAWAadhaarNo', sql.VarChar(100), { nullable: true });
        tableVAWGP.columns.add('AAOCode', sql.VarChar(10), { nullable: false });
        tableVAWGP.columns.add('BlockCode', sql.Int, { nullable: false });
        tableVAWGP.columns.add('Status', sql.Bit, { nullable: false });
        tableVAWGP.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableVAWGP.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        for (var i = 0; i < vawData.length; i++) {
            tableVAWGP.rows.add(vawData[i].VAWCode, vawData[i].GPCode, vawData[i].VAWName, vawData[i].VAWMobileNo, vawData[i].VAWEmailID, vawData[i].VAWSignature, vawData[i].VAWAadhaarNo, vawData[i].AAOCode, vawData[i].BlockCode, vawData[i].Status, vawData[i].IPAddress, vawData[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('VName', vawData[0].VAWName);
        request.input('VMobileNo', vawData[0].VAWMobileNo);
        request.input('VAadhaarNo', vawData[0].VAWAadhaarNo);
        request.input('VCode', vawData[0].VAWCode);
        request.input('tableVAWGP', tableVAWGP);
        request.execute('spAssignVAW', function (err, result) {
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

exports.getAllocatedGPsVAWs = function (aaoCode, season, financialYear) {
    return sequelize.query('select a.VAWCode, b.VAWName, b.VAWMobileNo, a.GPCode, c.GPName from VAWGPTargets a inner join VAWGPMapping b on a.VAWCode = b.VAWCode and a.GPCode = b.GPCode inner join LGDGP c on a.GPCode = c.GPCode where b.AAOCode = :aao_code and a.Season = :season and a.FinancialYear = :financial_year', {
        replacements: { aao_code: aaoCode, season: season, financial_year: financialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.allocateGPsVAWs = function (vawGPData, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableVAWGPTargets = new sql.Table();
        tableVAWGPTargets.create = true;
        tableVAWGPTargets.columns.add('VAWCode', sql.VarChar(30), { nullable: false, primary: true });
        tableVAWGPTargets.columns.add('GPCode', sql.Int, { nullable: false, primary: true });
        tableVAWGPTargets.columns.add('Season', sql.VarChar(10), { nullable: false });
        tableVAWGPTargets.columns.add('Status', sql.Bit, { nullable: false });
        tableVAWGPTargets.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableVAWGPTargets.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        for (var i = 0; i < vawGPData.length; i++) {
            tableVAWGPTargets.rows.add(vawGPData[i].VAWCode, vawGPData[i].GPCode, vawGPData[i].Season, vawGPData[i].Status, vawGPData[i].IPAddress, vawGPData[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('vawCode', vawGPData[0].VAWCode);
        request.input('season', vawGPData[0].Season);
        request.input('financialYear', vawGPData[0].FinancialYear);
        request.input('tableVAWGPTargets', tableVAWGPTargets);
        request.execute('spAllocateGPsVAWs', function (err, result) {
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

exports.getReferenceNos = function (aaoCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('AAOCode', aaoCode);
        request.execute('spGetAAORRRefNo', function (err, result) {
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
    return sequelize.query('select a.ReferenceNo, b.GPCode, b.GPName, c.VillageCode, c.VillageName, MobileNo, Season, d.CategoryCode, d.CategoryName, e.CropCode, e.CropName, f.CropStageCode, f.CropStageName from VAWFarmerCropDetailsEntry a inner join LGDGP b on a.GPCode = b.GPCode inner join LGDVillage c on a.VillageCode = c.VillageCode inner join CropCategory d on a.CropCategoryCode = d.CategoryCode inner join Crop e on a.CropCode = e.CropCode inner join CropStage f on a.CropStageCode = f.CropStageCode where a.ReferenceNo = :reference_no', {
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
    return sequelize.query('select i.ReferenceNo, i.PestDiseaseCode, j.PestDiseaseName, i.InfectionIdentified, i.AreaOfLand, i.LowIntensityAttackArea, i.MediumIntensityAttackArea, i.HighIntensityAttackArea, i.LowIntensityTreatedArea, i.MediumIntensityTreatedArea, i.HighIntensityTreatedArea, i.ModerateIntensityPestPopulation, i.HighIntensityPestPopulation, i.AdvisoryModerate, i.AdvisoryHigh from VAWFarmerPestDetailsEntry i inner join PestDisease j on i.PestDiseaseCode = j.PestDiseaseCode where i.ReferenceNo = :reference_no', {
        replacements: { reference_no: referenceNo }, type: sequelize.QueryTypes.SELECT
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

exports.getLTCGPs = function (blockCode) {
    return sequelize.query('select GPCode, GPName from LGDGP where BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCrops = function () {
    return sequelize.query("select CropCode, CropName, CategoryCode, CategoryName from crop a inner join CropCategory b on a.CropCategoryCode = b.CategoryCode where Status = 'LTC'", {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestDiseases = function (cropCode) {
    return sequelize.query("select PestDiseaseCode, PestDiseaseName from PestDisease a inner join Crop b on a.CropCode = b.CropCode where ((a.CropCode = :crop_code and a.Status = 'LTC') or (CropCategoryCode = :crop_code and a.Status = 'LTC' and b.Status = 'LTC'))", {
        replacements: { crop_code: cropCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.checkLTC = function (dateOfEntry, season, financialYear, gpCode, pestDiseaseCode, aaoCode) {
    return sequelize.query('select * from LightTrapCatchDetails where GPCode = :gp_code and PestDiseaseCode = :pest_disease_code and convert(datetime, convert(varchar(10), DateTime, 103), 103) = :date_of_entry and Season = :season and FinancialYear = :financial_year and AAOCode = :aao_code', {
        replacements: { date_of_entry: dateOfEntry, season: season, financial_year: financialYear, gp_code: gpCode, pest_disease_code: pestDiseaseCode, aao_code: aaoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitAAOLTC = function (obj, callback) {
    sequelize.query('insert into LightTrapCatchDetails (GPCode, CropCode, PestDiseaseCode, Season, PestTrappedNo, AAOCode, BlockCode, AAOStatus, Status, DateTime, IPAddress, FinancialYear) values (:gp_code, :crop_code, :pest_disease_code, :season, :pest_trapped_no, :aao_code, :block_code, :aao_status, :status, getdate(), :ip_address, :financial_year)', {
        replacements: { gp_code: obj.GPCode, crop_code: obj.CropCode, pest_disease_code: obj.PestDiseaseCode, season: obj.Season, pest_trapped_no: obj.PestTrappedNo, aao_code: obj.AAOCode, block_code: obj.BlockCode, aao_status: obj.AAOStatus, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getLTCDetails = function (aaoCode, dateOfEntry, season, financialYear) {
    return sequelize.query("select a.GPCode, GPName, a.CropCode, CropName, a.PestDiseaseCode, PestDiseaseName, PestTrappedNo from LightTrapCatchDetails a inner join LGDGP b on a.GPCode = b.GPCode left join Crop d on a.CropCode = d.CropCode inner join PestDisease e on a.PestDiseaseCode = e.PestDiseaseCode where AAOCode = :aao_code and convert(datetime, convert(varchar(10), DateTime, 103), 103) = :date_of_entry and Season = :season and FinancialYear = :financial_year", {
        replacements: { aao_code: aaoCode, date_of_entry: dateOfEntry, season: season, financial_year: financialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropCategories = function () {
    return sequelize.query('select * from CropCategory where IsActive = 1', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCropsByCategory = function (cropCategoryCode) {
    return sequelize.query('select CropCode, CropName from Crop where CropCategoryCode = :crop_category_code and IsActive = 1', {
        replacements: { crop_category_code: cropCategoryCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getAllPestDiseases = function (cropCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('CropCode', cropCode);
        request.execute('spGetPestDisease', function (err, result) {
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

exports.submitAAOPDE = function (pestData, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const tableAAOPestDetailsEntry = new sql.Table();
        tableAAOPestDetailsEntry.create = true;
        tableAAOPestDetailsEntry.columns.add('GPCode', sql.Int, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('CropCategoryCode', sql.Int, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('CropCode', sql.Int, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('PestDiseaseCode', sql.Int, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('LowAffectedArea', sql.Decimal(18, 3), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('MediumAffectedArea', sql.Decimal(18, 3), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('HighAffectedArea', sql.Decimal(18, 3), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('LowTreatedArea', sql.Decimal(18, 3), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('MediumTreatedArea', sql.Decimal(18, 3), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('HighTreatedArea', sql.Decimal(18, 3), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('Season', sql.VarChar(10), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('AAOCode', sql.VarChar(10), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('BlockCode', sql.Int, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('AAOStatus', sql.Bit, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('Status', sql.Bit, { nullable: false });
        tableAAOPestDetailsEntry.columns.add('IPAddress', sql.VarChar(50), { nullable: false });
        tableAAOPestDetailsEntry.columns.add('FinancialYear', sql.VarChar(10), { nullable: false });
        for (var i = 0; i < pestData.length; i++) {
            tableAAOPestDetailsEntry.rows.add(pestData[i].GPCode, pestData[i].CropCategoryCode, pestData[i].CropCode, pestData[i].PestDiseaseCode, pestData[i].LowAffectedArea, pestData[i].MediumAffectedArea, pestData[i].HighAffectedArea, pestData[i].LowTreatedArea, pestData[i].MediumTreatedArea, pestData[i].HighTreatedArea, pestData[i].Season, pestData[i].AAOCode, pestData[i].BlockCode, pestData[i].AAOStatus, pestData[i].Status, pestData[i].IPAddress, pestData[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('tableAAOPestDetailsEntry', tableAAOPestDetailsEntry);
        request.execute('spAAOPestDetailsSubmit', function (err, result) {
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

exports.getPDs = function (dateOfEntry, yesterdayDate, season, financialYear, cropCategoryCode, cropCode, pestDiseaseCode, aaoCode) {
    return sequelize.query('select a.GPCode, b.GPName, LowAffectedArea, MediumAffectedArea, HighAffectedArea, LowTreatedArea, MediumTreatedArea, HighTreatedArea from AAOPestDetailsEntry a inner join LGDGP b on a.GPCode = b.GPCode where convert(datetime, convert(varchar(10), DateTime, 103), 103) in(:date) and Season = :season and FinancialYear = :financial_year and CropCategoryCode = :crop_category_code and CropCode = :crop_code and PestDiseaseCode = :pest_disease_code and AAOCode = :aao_code', {
        replacements: { date: [dateOfEntry, yesterdayDate], season: season, financial_year: financialYear, crop_category_code: cropCategoryCode, crop_code: cropCode, pest_disease_code: pestDiseaseCode, aao_code: aaoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestDetails = function (dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, username, role, callback) {
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
        request.execute('spGetPestDetails', function (err, result) {
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

exports.getUserDetails = function (userName) {
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

exports.updateIsLoggedIn = function (isLoggedIn, userID) {
    sequelize.query('update UserLogin set IsLoggedIn = :is_logged_in where UserID = :user_id', {
        replacements: { is_logged_in: isLoggedIn, user_id: userID }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getDashboardDetails = function (aaoCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('AAOCode', aaoCode);
        request.execute('spGetAAODashboardDetails', function (err, result) {
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

exports.getVAWDetails1 = function (aaoCode) {
    return sequelize.query('select a.VAWCode, b.GPName, a.VAWName, a.VAWMobileNo, a.Status from VAWGPMapping a inner join LGDGP b on a.GPCode = b.GPCode where a.AAOCode = :aao_code', {
        replacements: { aao_code: aaoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVAWGPTargets = function (aaoCode) {
    return sequelize.query('select b.VAWCode, c.GPName, a.VAWMobileNo, a.VAWName from VAWGPMapping a inner join VAWGPTargets b on a.GPCode = b.GPCode inner join LGDGP c on c.GPCode = b.GPCode where a.AAOCode = :aao_code and a.Status = 1', {
        replacements: { aao_code: aaoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getAAOPestDetails = function (dateOfEntry, season, financialYear, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('CropCategoryCode', cropCategoryCode);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('UserType', userType);
        request.input('Username', username);
        request.input('Role', role);
        request.execute('spGetAAOPestDetails', function (err, result) {
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

exports.getLTCReportDetails = function (dateOfEntry, season, financialYear, cropCode, pestDiseaseCode, username, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('CropCode', cropCode);
        request.input('PestDiseaseCode', pestDiseaseCode);
        request.input('Username', username);
        request.execute('spGetAAOLTCReport', function (err, result) {
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

exports.getVAWInspectionDetails = function (dateOfEntry, season, financialYear, username, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('Season', season);
        request.input('FinancialYear', financialYear);
        request.input('Username', username);
        request.execute('spGetAAOVAWInspectionReport', function (err, result) {
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

exports.getEMRNosForAAO = function (dateOfEntry, cropCategory, crop, financialYear, username, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('CropCategoryCode', cropCategory);
        request.input('CropCode', crop);
        request.input('FinancialYear', financialYear);
        request.input('Username', username);
        request.execute('spGetEMRNosForAAODetails', function (err, result) {
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

exports.getEMRReferenceNoDetailsAAO = function (emrRefNo) {
    return sequelize.query('select a.*, j.PestDiseaseName from (select distinct(a.EMRReferenceNo), a.MobileNo, a.DistrictCode, g.DistrictName, a.BlockCode, h.BlockName, a.GPCode, i.GPName, a.CropCategoryCode, e.CategoryName, a.CropCode, f.CropName, a.FixedLandPhoto, a.RandomLandPhoto1, a.RandomLandPhoto2, a.FixedLandLatitude, a.FixedLandLongitude, a.RandomLandLatitude1, a.RandomLandLongitude1, a.RandomLandLatitude2, a.RandomLandLongitude2, case when (b.PestDiseaseCode is not null) then b.PestDiseaseCode when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.PestDiseaseCode when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.PestDiseaseCode end as PestDiseaseCode, case when (b.PestDiseaseCode is not null) then b.ModerateIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.ModerateIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.ModerateIntensityPestPopulation end as ModerateIntensityPestPopulation, case when (b.PestDiseaseCode is not null) then b.HighIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.HighIntensityPestPopulation when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.HighIntensityPestPopulation end as HighIntensityPestPopulation, case when (b.PestDiseaseCode is not null) then b.AdvisoryModerate when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.AdvisoryModerate when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.AdvisoryModerate end as AdvisoryModerate, case when (b.PestDiseaseCode is not null) then b.AdvisoryHigh when (b.PestDiseaseCode is null and c.PestDiseaseCode is not null) then c.AdvisoryHigh when (b.PestDiseaseCode is null and c.PestDiseaseCode is null and d.PestDiseaseCode is not null) then d.AdvisoryHigh end as AdvisoryHigh from EMRFarmerDetailsEntry a left join EMRADO b on a.EMRReferenceNo = b.EMRReferenceNo left join EMRJDAPP c on a.EMRReferenceNo = c.EMRReferenceNo left join EMROUAT d on a.EMRReferenceNo = d.EMRReferenceNo inner join CropCategory e on a.CropCategoryCode = e.CategoryCode inner join Crop f on a.CropCode = f.CropCode inner join LGDDistrict g on a.DistrictCode = g.DistrictCode inner join LGDBlock h on a.BlockCode = h.BlockCode inner join LGDGP i on substring(a.EMRReferenceNo, 13, 6) = i.GPCode) a left join PestDisease j on a.PestDiseaseCode =  j.PestDiseaseCode where a.EMRReferenceNo = :emr_ref_no', {
        replacements: { emr_ref_no: emrRefNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};