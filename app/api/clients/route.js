import { NextResponse } from 'next/server';
import { getCollection } from '/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  const url = await new URL(request.url);
  const {navigator, clientId} = await url.searchParams;
  const grouped = url.searchParams.get("grouped") || undefined;
  let clients = [];
  try {
    const collection = await getCollection("clients")
    if (navigator) {
      clients = await collection.find({navigator: navigator}).toArray()
    } else if (clientId) {
      clients = await collection.findOne({ _id: ObjectId.createFromBase64(clientId.toString()) });
    } else if (grouped === "true") {
      clients = await collection.aggregate([
        // { $match: { navigator: nav } },
        {
          $group: {
            _id: "$clientStatus",
            clients: { $push: "$$ROOT" }
          }
        }
      ]).toArray()
    } else {
      clients = await collection.find({}).toArray()
    }

    return NextResponse.json(clients, { status: 200 })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

// POST to add a new client
export async function POST(request) {
  try {
    const body = await request.json(); // Correctly parse request body
    const collection = await getCollection("clients");

    // If _id exists, it's an update operation
    if (body._id) {
      const id = body._id;
      body.name = body.first_name + " " + body.last_name;
      const { _id, ...updateData } = body;

      const result = await collection.updateOne(
        { _id: ObjectId.createFromBase64(id) },
          { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Client updated successfully", _id: id }, { status: 200 });
    }

    // Otherwise, it's a new client
    const result = await collection.insertOne(body);
    return NextResponse.json({
      message: 'Client added successfully',
      _id: result.insertedId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding/updating client:", error);
    return NextResponse.json({ error: "Failed to add/update client" }, { status: 500 });
  }
}
