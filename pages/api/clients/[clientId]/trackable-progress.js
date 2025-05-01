// pages/api/clients/[clientId]/trackable-progress.js

import db from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { trackable } = req.body;

  if (!trackable || !trackable.items) {
    return res.status(400).json({ message: 'Trackable items missing in body' });
  }

  try {
    const client = await db.connect();
    const db = client.db(); // Default db unless you named it

    const result = await db.collection('clients').updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'trackable.items': trackable.items } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    return res.status(200).json({
      message: 'Trackable progress updated successfully',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating trackable progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}