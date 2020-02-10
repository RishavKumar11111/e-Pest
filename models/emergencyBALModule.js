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

exports.getCropCategories = function () {
    return sequelize.query('select * from CropCategory where IsActive = 1', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getCrops = function (cropCategoryCode) {
    return sequelize.query('select CropCode, CropName from Crop where CropCategoryCode = :crop_category_code and IsActive = 1', {
        replacements: { crop_category_code: cropCategoryCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getDistricts = function () {
    return sequelize.query('select DistrictCode, DistrictName from LGDDistrict', {
        type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getBlocksByDistrict = function (districtCode) {
    return sequelize.query('select BlockCode, BlockName from LGDBlock where DistrictCode = :district_code', {
        replacements: { district_code: districtCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getGPsByBlock = function (blockCode) {
    return sequelize.query('select GPCode, GPName from LGDGP where BlockCode = :block_code', {
        replacements: { block_code: blockCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getVillagesByGP = function (gpCode) {
    return sequelize.query('select VillageCode, VillageName from LGDVillage where GPCode = :gp_code', {
        replacements: { gp_code: gpCode }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        return data;
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};

exports.getEMRDetails = function (financialYear, season, districtCode, blockCode, gpCode, callback) {
    var con = new sql.ConnectionPool(locConfig);
    con.connect().then(function success() {
        const request = new sql.Request(con);
        request.input('FinancialYear', financialYear);
        request.input('Season', season);
        request.input('DistrictCode', districtCode);
        request.input('BlockCode', blockCode);
        request.input('GPCode', gpCode);
        request.execute('spGetEMRDetails', function (err, result) {
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

exports.submitCropPhotoDetails = function (obj, callback) {
    sequelize.query('insert into EMRFarmerDetailsEntry (EMRReferenceNo, FarmerID, MobileNo, CropCategoryCode, CropCode, FixedLandPhoto, RandomLandPhoto1, RandomLandPhoto2, FixedLandLatitude, FixedLandLongitude, RandomLandLatitude1, RandomLandLongitude1, RandomLandLatitude2, RandomLandLongitude2, ADOCode, DistrictCode, BlockCode, GPCode, VillageCode, Status, DateTime, IPAddress, FinancialYear) values (:emr_reference_no, :farmer_id, :mobile_no, :crop_category_code, :crop_code, :fixed_land_photo, :random_land_photo1, :random_land_photo2, :fixed_land_latitude, :fixed_land_longitude, :random_land_latitude1, :random_land_longitude1, :random_land_latitude2, :random_land_longitude2, :ado_code, :district_code, :block_code, :gp_code, :village_code, :status, getdate(), :ip_address, :financial_year)', {
        replacements: { emr_reference_no: obj.ReferenceNo, farmer_id: obj.FarmerID, mobile_no: obj.MobileNo, crop_category_code: obj.CropCategoryCode, crop_code: obj.CropCode, fixed_land_photo: obj.FixedLandPhoto, random_land_photo1: obj.RandomLandPhoto1, random_land_photo2: obj.RandomLandPhoto2, fixed_land_latitude: obj.FixedLandLatitude, fixed_land_longitude: obj.FixedLandLongitude, random_land_latitude1: obj.RandomLandLatitude1, random_land_longitude1: obj.RandomLandLongitude1, random_land_latitude2: obj.RandomLandLatitude2, random_land_longitude2: obj.RandomLandLongitude2, ado_code: obj.ADOCode, district_code: obj.DistrictCode, block_code: obj.BlockCode, gp_code: obj.GPCode, village_code: obj.VillageCode, status: obj.Status, ip_address: obj.IPAddress, financial_year: obj.FinancialYear }, type: sequelize.QueryTypes.SELECT
    }).then(function success(data) {
        callback(true);
    }).catch(function error(err) {
        console.log('An error occurred...', err);
    });
};