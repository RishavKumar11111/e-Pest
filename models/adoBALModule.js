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

exports.getPesticide = function(pestDiseaseCode) {
    return sequelize.query('select * from Pesticide where PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestDiseaseCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitADOEMR = function(obj, callback) {
    sequelize.query('insert into EMRADO (EMRReferenceNo, InfectionIdentified, PestDiseaseCode, AdvisoryModerate, AdvisoryHigh, ADOCode, DistrictCode, BlockCode, ADOStatus, Status, DateTime, IPAddress, FinancialYear) values (:emr_reference_no, :infection_identified, :pest_disease_code, :advisory_moderate, :advisory_high, :ado_code, :district_code, :block_code, :ado_status, :status, getdate(), :ip_address, :financial_year)', {
    replacements: { emr_reference_no: obj.EMRReferenceNo, infection_identified: obj.InfectionIdentified, pest_disease_code: obj.PestDiseaseCode, advisory_moderate: obj.AdvisoryModerate, advisory_high: obj.AdvisoryHigh, ado_code: obj.ADOCode, district_code: obj.DistrictCode, block_code: obj.BlockCode, ado_status: obj.ADOStatus, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getADODistBlock = function(adoCode) {
    return sequelize.query('select DistrictCode, BlockCode from ADODistBlockMapping where ADOCode = :ado_code', {
        replacements: { ado_code: adoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getMessages = function(adoCode) {
    return sequelize.query('select Message, convert(varchar(10), DateTime, 105) as Date from ADOMessageJDAPP where ADOCode = :ado_code', {
        replacements: { ado_code: adoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitADOMFJ = function(obj, callback) {
    sequelize.query('insert into ADOMessageJDAPP (Message, ADOCode, DistrictCode, BlockCode, Status, DateTime, IPAddress, FinancialYear) values (:message, :ado_code, :district_code, :block_code, :status, getdate(), :ip_address, :financial_year)', {
    replacements: { message: obj.Message, ado_code: obj.ADOCode, district_code: obj.DistrictCode, block_code: obj.BlockCode, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getBlocks = function(username) {
    return sequelize.query('select a.BlockCode, BlockName from LGDBlock a inner join ADODistBlockMapping b on a.BlockCode = b.BlockCode where b.ADOCode = :user_name', {
        replacements: { user_name: username }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
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

exports.getAAODetails = function(adoCode) {
    return sequelize.query('select a.AAOMobileNo, a.AAOName, a.AAOCode, b.BlockName from AAOBlockMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode inner join ADODistBlockMapping c on c.BlockCode = a.BlockCode where c.ADOCode  = :ado_code', {
        replacements: { ado_code : adoCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
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

exports.getVAWGPDetails = function(blockCode) {
    return sequelize.query('select b.VAWCode, a.VAWMobileNo, a.VAWName, c.GPName from VAWGPMapping a inner join VAWGPTargets b on a.GPCode = b.GPCode inner join LGDGP c on c.GPCode = b.GPCode where a.BlockCode = :block_code and a.Status = 1', {
        replacements: { block_code : blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getDashboardDetails = function(adoCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('ADOCode', adoCode);
        request.execute('spGetADODashboardDetails', function(err, result) {
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

exports.getLTCDetails = function(dateOfEntry, season, financialYear, blockCode, cropCode, pestDiseaseCode,username, callback) {
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
        request.execute('spGetADOLTCReport', function(err, result) {
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
        request.execute('spGetADOVAWInspectionReport', function(err, result) {
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

exports.getBlocksByADO = function(userName) {
    return sequelize.query('select b.BlockCode, b.BlockName from ADODistBlockMapping a inner join LGDBlock b on a.BlockCode = b.BlockCode where a.ADOCode = :user_name', {
        replacements: { user_name : userName }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getADOPestDetails = function(dateOfEntry, season, financialYear, blockCode, cropCategoryCode, cropCode, pestDiseaseCode, userType, username, role, callback) {
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
        request.execute('spGetADOPestDetails', function(err, result) {
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

exports.getRefNos = function(adoCode, cropCategoryCode, cropCode) {
    return sequelize.query("declare @endDate datetime, @weekDay varchar(10), @diffDate int set @weekDay = (select datename(w, getdate())) set @diffDate = (case when @weekDay = 'Monday' then 0 when @weekDay = 'Tuesday' then 1 when @weekDay = 'Wednesday' then 2 when @weekDay = 'Thursday' then 3 when @weekDay = 'Friday' then 4 when @weekDay = 'Saturday' then 5 else null end) set @endDate = (select dateadd(d, -@diffDate, convert(datetime, getdate(), 103))) select distinct(a.EMRReferenceNo), convert(varchar(10), a.DateTime, 105) as Date from EMRFarmerDetailsEntry a left join EMRADO b on a.EMRReferenceNo = b.EMRReferenceNo left join EMRJDAPP c on a.EMRReferenceNo = c.EMRReferenceNo left join EMROUAT d on a.EMRReferenceNo = d.EMRReferenceNo where b.EMRReferenceNo is null and c.EMRReferenceNo is null and d.EMRReferenceNo is null and CropCategoryCode = :crop_category_code and CropCode = :crop_code and a.ADOCode = :ado_code and convert(datetime, convert(varchar(10), a.DateTime, 103), 103) between convert(datetime, convert(varchar(10), @endDate, 103), 103) and convert(datetime, convert(varchar(10), getdate(), 103), 103)", {
        replacements: { ado_code: adoCode, crop_category_code: cropCategoryCode, crop_code: cropCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getRefNoDetails = function(refNo) {
    return sequelize.query('select distinct(a.EMRReferenceNo), a.MobileNo, a.DistrictCode, a.BlockCode, d.BlockName, e.GPName, a.CropCategoryCode, a.CropCode, a.FixedLandPhoto, a.RandomLandPhoto1, a.RandomLandPhoto2, a.FixedLandLatitude, a.FixedLandLongitude, a.RandomLandLatitude1, a.RandomLandLongitude1, a.RandomLandLatitude2, a.RandomLandLongitude2, b.CategoryName, c.CropName from EMRFarmerDetailsEntry a inner join CropCategory b on b.CategoryCode = a.CropCategoryCode inner join Crop c on c.CropCode = a.CropCode inner join LGDBlock d on d.BlockCode = a.BlockCode inner join LGDGP e on e.GPCode = substring(a.EMRReferenceNo, 13, 6) where a.EMRReferenceNo = :ref_No', {
        replacements: { ref_No : refNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getPestPopulation = function(pestDiseaseCode) {
    return sequelize.query('select * from PestDiseaseIntensity where PestDiseaseCode = :pest_disease_code', {
        replacements: { pest_disease_code: pestDiseaseCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.submitADOEMR = function(obj, callback) {
    sequelize.query('insert into EMRADO (EMRReferenceNo, InfectionIdentified, PestDiseaseCode, ModerateIntensityPestPopulation, HighIntensityPestPopulation, AdvisoryModerate, AdvisoryHigh, ADOCode, DistrictCode, BlockCode, ADOStatus, Status, DateTime, IPAddress, FinancialYear) values (:emr_reference_no, :infection_identified, :pest_disease_code, :moderate_intensity_pestPopulation, :high_intensity_pestPopulation, :advisory_moderate, :advisory_high, :ado_code, :district_code, :block_code, :ado_status, :status, getdate(), :ip_address, :financial_year)', {
    replacements: { emr_reference_no: obj.EMRReferenceNo, infection_identified: obj.InfectionIdentified, pest_disease_code: obj.PestDiseaseCode, moderate_intensity_pestPopulation: obj.ModerateIntensityPestPopulation, high_intensity_pestPopulation : obj.HighIntensityPestPopulation, advisory_moderate: obj.AdvisoryModerate, advisory_high: obj.AdvisoryHigh, ado_code: obj.ADOCode, district_code: obj.DistrictCode, block_code: obj.BlockCode, ado_status: obj.ADOStatus, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getEMRNosForADO = function(dateOfEntry, cropCategory, crop, financialYear, username, blockCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('DateOfEntry', dateOfEntry);
        request.input('CropCategoryCode', cropCategory);
        request.input('CropCode', crop);
        request.input('FinancialYear', financialYear);
        request.input('Username', username);
        request.input('BlockCode', blockCode);
        request.execute('spGetEMRNosForADODetails', function(err, result) {
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

exports.getEMRReferenceNoDetailsADO = function (emrRefNo) {
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