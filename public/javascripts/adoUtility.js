var dbPromise = idb.open('e-pest', 1, function (db) {
    if (!db.objectStoreNames.contains('user-authentication')) {
        db.createObjectStore('user-authentication', { keyPath: 'Pin' });
    }
    if (!db.objectStoreNames.contains('user-login')) {
        db.createObjectStore('user-login', { keyPath: 'Username' });
    }
    if (!db.objectStoreNames.contains('referenceNo')) {
        db.createObjectStore('referenceNo', { keyPath: 'ReferenceNo' });
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
    if (!db.objectStoreNames.contains('crop-details')) {
        db.createObjectStore('crop-details', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('photo-location')) {
        db.createObjectStore('photo-location', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('pest-details')) {
        db.createObjectStore('pest-details', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('referenceNo-status')) {
        db.createObjectStore('referenceNo-status', { keyPath: 'ReferenceNo' });
    }
    if (!db.objectStoreNames.contains('emr-refNo-fID')) {
        db.createObjectStore('emrRefNo-fID', { keyPath: 'EMRReferenceNo' });
    }
    if (!db.objectStoreNames.contains('block')) {
        db.createObjectStore('block', { keyPath: 'BlockCode' });
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
            // return store.get(id);
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

function objStDelete(objSt) {
    return idb.open('e-pest', 1, function (db) {
        if (db.objectStoreNames.contains(objSt)) {
            db.deleteObjectStore(objSt);
        }
    }).then(function () {
        console.log('Object Store deleted!');
    });
};