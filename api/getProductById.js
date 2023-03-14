"use strict";
// Import the dependency.
const clientPromise = require('../api-utils/mongo-client');

module.exports = async (req, res) => {
    const { category, productId } = req.query
    const client = await clientPromise;
    const db = client.db()
    const categoryCollection = db.collection(`${category}`)
    console.log(`${category}`, categoryCollection, productId)
    if(!categoryCollection) return res.status(404).json({ success: false, message: 'Category not found' })

    const product = await categoryCollection.find({_id: `${productId}`}).limit(1).toArray()
    res.status(200).json({ product });
}