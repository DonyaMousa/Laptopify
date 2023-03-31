"use strict";
// Import the dependency.
process.env.MONGO_DB = "users"
const clientPromise = require('../api-utils/mongo-client');
var sha256 = require('js-sha256').sha256

module.exports = async (req, res) => {
    const { email, password } = req.query
    console.log(email, password)
    const client = await clientPromise;
    const db = client.db()
    const adminCollection = db.collection('admin')
    const passDigest = sha256(password)
    const user = (await adminCollection.find({pass: `${passDigest}`}).limit(1).toArray())[0]
    if(!user || user.email != email) {
        res.status(404).json({ error: 'User not found' });
        return
    } else {
        res.status(200).json({ user });
        return
    }
}