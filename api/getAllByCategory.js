"use strict";
// Import the dependency.
process.env.MONGO_DB = "Amazon"
const clientPromise = require('../api-utils/mongo-client');

module.exports = async (req, res) => {
    const { category } = req.query
    const client = await clientPromise;
    const db = client.db()
    const categoryCollection = db.collection(`${category}`)
    if(!categoryCollection) return res.status(404).json({ success: false, message: 'Category not found' })

    const products = await categoryCollection.find().toArray()
    res.status(200).json({ success: true, products });
}