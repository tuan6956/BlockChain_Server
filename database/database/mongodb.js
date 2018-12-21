const mongodbClient = require('mongodb').MongoClient;
const config = require('../config/configMongoDB.js');


connect = () => {
    return new Promise((resolve, reject) => {
        mongodbClient.connect(config.database.url, config.database.option, (err, client) => {
            const db = client.db('qlpm');
            err ? reject(err) : resolve(db);
        });
    })
}

insertOneDB = (db, collectionName, data) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne(data, (err, result) => {
            return err ? reject(err) : resolve(result);
        })
    })
}

findOneDB = (db, collectionName, query, option={}) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).findOne(query, option, (err, result) => {
            return err || !result ? reject(err) : resolve(result)
        })
    })
}

findOneAndUpdateDB = (db, collectionName, filter, update) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).findOneAndUpdate(filter, update, (err, result) => {
            return err || !result ? reject(err) : resolve(result)
        })
    })
}


aggregateDB = (db, collectionName, query, option={}) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).aggregate(query).toArray((err, result) => {
            return err || !result || result.length === 0 ? reject(err) : resolve(result);
        })
    })
}

countDocument = (db, collectionName, query, option={}) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(query).count((err, result) => {
            return err ? reject(err) : resolve(result);
        })
    })
}

findMany = (db, collectionName, query, option ={}) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(query, option).toArray((err, result) => {
            return err || !result || result.length === 0 ? reject(err) : resolve(result);
        })
    })
}

module.exports = { 
    connect,
    insertOneDB,
    findOneDB,
    findOneAndUpdateDB,
    aggregateDB,
    countDocument,
    findMany
 };

