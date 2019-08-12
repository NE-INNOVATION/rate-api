const mongo = require('mongodb').MongoClient
const collection = process.env.COLLECTION_NAME
const connectionString = process.env.CONNECTION_STRING
const dbName = process.env.DB_NAME
let clientPromise

const createDbConnection = () => {
    if (!clientPromise) {
        clientPromise = getDbConnection()
    }
}

const getDbConnection = () => {
    return new Promise((resolve, reject) => {
        mongo.connect(connectionString, {
            connectTimeoutMS: 30000,
            useNewUrlParser: true,
            keepAlive: 1, 
            reconnectTries: 30, 
            reconnectInterval: 2000
        },
            (err, client) => {
                if (err) {
                    console.log('Failed to connect MongoDB')
                    reject(err)
                } else {
                    console.log('Successfully created MongoDB connection')
                    resolve(client)
                }
            })
    })
}

const find = async (type, quoteId) => {
    let client = await clientPromise
    let db = client.db(dbName)
    let filter = { quoteId: quoteId, type: type }
    return new Promise((resolve, reject) => {
        try {
            db.collection(collection)
                .findOne(filter, async (err, covpol) => {
                    if (err) {
                        console.log(`Something went wrong - ${err}`)
                        reject()
                    }
                    resolve(covpol)
                })

        } catch (error) {
            console.log(`Something went wrong, Error - ${error}`)
            reject()
        }
    })
}

const upsertRateIssue = async (type, rateCoverageInfo) => {
    let client = await clientPromise
    let db = client.db(dbName)
    let filter = { quoteId: rateCoverageInfo.quoteId , type: type }
    let objectId, action
    try {
        rateCoverageInfo.type = type
        let saveResult = await db.collection(collection)
            .replaceOne(filter, rateCoverageInfo,
                {
                    upsert: true
                })
        objectId = saveResult.insertedId
        action = 'upserted'
    } catch (error) {
        console.log(`Failed to update mongo - QuoteID : ${rateCoverageInfo.quoteId}`)
    }
    console.log(`${type} with QuoteID - ${rateCoverageInfo.quoteId} ${action}`)
    // client.close()
    return objectId
}

module.exports = {
    createDbConnection,
    addCoverage : upsertRateIssue.bind(null, 'rate'),
    addPolicy : upsertRateIssue.bind(null, 'issue'),
    findCoverage: find.bind(null, 'rate'),
    findPolicy: find.bind(null, 'issue')
}