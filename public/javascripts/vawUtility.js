var dbPromise = idb.open('e-pest', 1, function (db) {
    if (!db.objectStoreNames.contains('user-authentication')) {
        db.createObjectStore('user-authentication', { keyPath: 'Pin' });
    }
    if (!db.objectStoreNames.contains('user-login')) {
        db.createObjectStore('user-login', { keyPath: 'Username' });
    }
    if (!db.objectStoreNames.contains('referenceNo-count')) {
        db.createObjectStore('referenceNo-count', { keyPath: 'semiRefNo' });
    }
    if (!db.objectStoreNames.contains('gp')) {
        db.createObjectStore('gp', { keyPath: 'GPCode' });
    }
    if (!db.objectStoreNames.contains('village')) {
        db.createObjectStore('village', { keyPath: 'VillageCode' });
    }
    if (!db.objectStoreNames.contains('crop-category')) {
        db.createObjectStore('crop-category', { keyPath: 'CategoryCode' });
    }
    if (!db.objectStoreNames.contains('crop')) {
        db.createObjectStore('crop', { keyPath: 'CropCode' });
    }
    if (!db.objectStoreNames.contains('crop-stage')) {
        db.createObjectStore('crop-stage', { keyPath: 'CropStageCode' });
    }
    if (!db.objectStoreNames.contains('pest-disease')) {
        db.createObjectStore('pest-disease', { keyPath: 'PestDiseaseCode' });
    }
    if (!db.objectStoreNames.contains('pesticide')) {
        db.createObjectStore('pesticide', { keyPath: 'PesticideCode' });
    }
    if (!db.objectStoreNames.contains('pest-disease-intensity')) {
        db.createObjectStore('pest-disease-intensity', { keyPath: 'PestDiseaseCode' });
    }
    if (!db.objectStoreNames.contains('crop-details-entry')) {
        db.createObjectStore('crop-details-entry', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('refNo-fID-aID')) {
        db.createObjectStore('refNo-fID-aID', { keyPath: 'ID', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('pest-details-entry')) {
        db.createObjectStore('pest-details-entry', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('photo-location-entry')) {
        db.createObjectStore('photo-location-entry', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('referenceNo-status')) {
        db.createObjectStore('referenceNo-status', { keyPath: 'ReferenceNo' });
    }
});

function writeData(st, data) {
    return dbPromise
        .then(function (db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.put(data);
            return tx.complete;
        });
};

function readAllData(st) {
    return dbPromise
        .then(function (db) {
            var tx = db.transaction(st, 'readonly');
            var store = tx.objectStore(st);
            return store.getAll();
        });
};

function readItemFromData(st, ID) {
    return dbPromise
        .then(function (db) {
            var tx = db.transaction(st, 'readonly');
            var store = tx.objectStore(st);
            return store.get(ID);
        });
};

function clearAllData(st) {
    return dbPromise
        .then(function (db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.clear();
            return tx.complete;
        });
};

function clearItemFromData(st, ID) {
    return dbPromise
        .then(function (db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.delete(ID);
            return tx.complete;
        }).then(function () {
            console.log('Item deleted!');
        });
};

function dbDelete() {
    return idb.delete('e-pest', function () { })
        .then(function () {
            console.log('Database deleted!');
        });
};