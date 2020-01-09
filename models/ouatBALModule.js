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
        request.execute('spGetRefNoDetailsOUAT', function(err, result) {
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

exports.removeRefNo = function (referenceNo, callback) {
    sequelize.query('update VAWFarmerCropDetailsEntry set Status = 0 where ReferenceNo = :reference_no', {
        replacements: { reference_no: referenceNo }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(true);
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
    return sequelize.query('select i.ReferenceNo, i.PestDiseaseCode, j.PestDiseaseName, i.InfectionIdentified, i.AreaOfLand, i.LowIntensityAttackArea, i.MediumIntensityAttackArea, i.HighIntensityAttackArea, i.LowIntensityTreatedArea, i.MediumIntensityTreatedArea, i.HighIntensityTreatedArea, i.ModerateIntensityPestPopulation, i.HighIntensityPestPopulation, i.AdvisoryModerate, i.AdvisoryHigh from VAWFarmerPestDetailsEntry i inner join PestDisease j on i.PestDiseaseCode = j.PestDiseaseCode where i.ReferenceNo = :reference_no', {
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
        request.input('OUATUserID', obj.OUATUserID);
        request.input('OUATStatus', obj.OUATStatus);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.execute('spUpdatePestDetailsOUAT', function(err, result) {
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
        request.input('OUATUserID', obj.OUATUserID);
        request.input('OUATStatus', obj.OUATStatus);
        request.input('Status', obj.Status);
        request.input('IPAddress', obj.IPAddress);
        request.input('FinancialYear', obj.FinancialYear);
        request.input('tableVAWRefNo', tableVAWRefNo);
        request.execute('spUpdateAdvisoryOUAT', function(err, result) {
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
        const tableOUATSubmit = new sql.Table();
        tableOUATSubmit.create = true;
        tableOUATSubmit.columns.add('ReferenceNo', sql.VarChar(30), {nullable: false, primary: true});
        tableOUATSubmit.columns.add('OUATAdvisoryModerate', sql.VarChar(1000), {nullable: true});
        tableOUATSubmit.columns.add('OUATAdvisoryHigh', sql.VarChar(1000), {nullable: true});
        tableOUATSubmit.columns.add('OUATUserID', sql.VarChar(30), {nullable: false});
        tableOUATSubmit.columns.add('OUATStatus', sql.Bit, {nullable: false});
        tableOUATSubmit.columns.add('Status', sql.Bit, {nullable: false});
        tableOUATSubmit.columns.add('IPAddress', sql.VarChar(50), {nullable: false});
        tableOUATSubmit.columns.add('FinancialYear', sql.VarChar(10), {nullable: false});
        for (var i = 0; i < arr.length; i++) {
            tableOUATSubmit.rows.add(arr[i].ReferenceNo, arr[i].OUATAdvisoryModerate, arr[i].OUATAdvisoryHigh, arr[i].OUATUserID, arr[i].OUATStatus, arr[i].Status, arr[i].IPAddress, arr[i].FinancialYear);
        }
        const request = new sql.Request(con);
        request.input('tableOUATSubmit', tableOUATSubmit);
        request.execute('spOUATSubmit', function(err, result) {
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

exports.getEMRRefNos = function(cropCode) {
    return sequelize.query("declare @endDate datetime, @weekDay varchar(10), @diffDate int set @weekDay = (select datename(w, getdate())) set @diffDate = (case when @weekDay = 'Monday' then 0 when @weekDay = 'Tuesday' then 1 when @weekDay = 'Wednesday' then 2 when @weekDay = 'Thursday' then 3 when @weekDay = 'Friday' then 4 when @weekDay = 'Saturday' then 5 else null end) set @endDate = (select dateadd(d, -@diffDate, convert(datetime, getdate(), 103))) select distinct(a.EMRReferenceNo), convert(varchar(10), a.DateTime, 105) as Date, MobileNo, case when (b.EMRReferenceNo is null) then 'Pending' when (b.EMRReferenceNo is not null and b.InfectionIdentified = 'No') then 'Pest is not identified' end as ADOStatus, case when ((b.EMRReferenceNo is null and c.EMRReferenceNo is null) or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and b.InfectionIdentified = 'No')) then 'Pending' when ((b.EMRReferenceNo is null and c.EMRReferenceNo is not null and c.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and c.InfectionIdentified = 'No' and b.InfectionIdentified = 'No')) then 'Pest is not identified' end as JDAPPStatus, case when ((b.EMRReferenceNo is null and c.EMRReferenceNo is null and d.EMRReferenceNo is null) or (b.EMRReferenceNo is null and c.EMRReferenceNo is not null and d.EMRReferenceNo is null and c.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and d.EMRReferenceNo is null and b.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and d.EMRReferenceNo is null and b.InfectionIdentified = 'No' and c.InfectionIdentified = 'No')) then 'Pending' when ((b.EMRReferenceNo is null and c.EMRReferenceNo is null and d.EMRReferenceNo is not null and d.InfectionIdentified = 'No') or (b.EMRReferenceNo is null and c.EMRReferenceNo is not null and d.EMRReferenceNo is not null and c.InfectionIdentified = 'No' and d.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and d.EMRReferenceNo is not null and b.InfectionIdentified = 'No' and d.InfectionIdentified = 'No') or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and d.EMRReferenceNo is not null and b.InfectionIdentified = 'No' and c.InfectionIdentified = 'No' and d.InfectionIdentified = 'No')) then 'Pest is not identified' end as OUATStatus from EMRFarmerDetailsEntry a left join EMRADO b on a.EMRReferenceNo = b.EMRReferenceNo left join EMRJDAPP c on a.EMRReferenceNo = c.EMRReferenceNo left join EMROUAT d on a.EMRReferenceNo = d.EMRReferenceNo where (((b.EMRReferenceNo is null and c.EMRReferenceNo is not null and c.InfectionIdentified ='No' ) or (b.EMRReferenceNo is not null and c.EMRReferenceNo is null and b.InfectionIdentified = 'No') and convert(datetime, convert(varchar(10), a.DateTime, 103), 103) between convert(datetime, convert(varchar(10), dateadd(d, -7, @endDate), 103), 103) and convert(datetime, convert(varchar(10), dateadd(d, -2, @endDate), 103), 103)) or (b.EMRReferenceNo is null and c.EMRReferenceNo is null and convert(datetime, convert(varchar(10), a.DateTime, 103), 103) < convert(datetime, convert(varchar(10), dateadd(d, -7, @endDate), 103), 103)) or (b.EMRReferenceNo is not null and c.EMRReferenceNo is not null and b.InfectionIdentified = 'No' and c.InfectionIdentified = 'No' and convert(datetime, convert(varchar(10), a.DateTime, 103), 103) between convert(datetime, convert(varchar(10), @endDate, 103), 103) and convert(datetime, convert(varchar(10), getdate(), 103), 103))) and d.EMRReferenceNo is null and CropCode = :crop_code", {
        replacements: { crop_code: cropCode}, type: sequelize.QueryTypes.SELECT
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
    sequelize.query('insert into EMROUAT (EMRReferenceNo, InfectionIdentified, PestDiseaseCode, ModerateIntensityPestPopulation, HighIntensityPestPopulation, AdvisoryModerate, AdvisoryHigh, OUATUserID, OUATStatus, Status, DateTime, IPAddress, FinancialYear) values (:emr_reference_no, :infection_identified, :pest_disease_code, :moderate_intensity_pestPopulation, :high_intensity_pestPopulation, :advisory_moderate, :advisory_high, :ouat_code, :ouat_status, :status, getdate(), :ip_address, :financial_year)', {
        replacements: { emr_reference_no: obj.EMRReferenceNo, infection_identified: obj.InfectionIdentified, pest_disease_code: obj.PestDiseaseCode, moderate_intensity_pestPopulation: obj.ModerateIntensityPestPopulation, high_intensity_pestPopulation: obj.HighIntensityPestPopulation, advisory_moderate: obj.AdvisoryModerate, advisory_high: obj.AdvisoryHigh, ouat_code: obj.OUATUserID, ouat_status: obj.OUATStatus, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.INSERT
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