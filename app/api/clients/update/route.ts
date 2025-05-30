import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { safeObjectId } from "@/lib/safeObjectId";

// GET all navigators
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const navigatorId = url.searchParams.get("navigatorId") || "";
  try {
    if (navigatorId) {
      const collection = await getCollection("users");
      const navigator = await collection.findOne({
        _id: ObjectId.createFromBase64(navigatorId)
      });
      return NextResponse.json(navigator, { status: 200 });
    }
    const collection = await getCollection("users");
    const navigators = await collection.find({}).toArray();
    return NextResponse.json(navigators, { status: 200 });
  } catch (e) {
    console.error("Error fetching navigators:", e);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId");
  const trackable = url.searchParams.get("trackable");
  try {
    const body = await request.json(); // Correctly parse request body
    const collection = await getCollection("clients");
    const activities = await getCollection("activities");
    if (clientId) {
      if (trackable) {
        const { completed, name } = body;
        await collection.updateOne(
          { _id: new ObjectId(clientId) },
          {
            $set: {
              [`items.${trackable}.completed`]: completed,
              [`items.${trackable}.createdAt`]: new Date().toISOString(),
              [`items.${trackable}.name`]: name,
              [`items.${trackable}.itemIndex`]: parseInt(trackable)
            },
          },
        );
      }
      const { _id, ...updateData } = body;
      const activity = await activities.insertOne({ body });
      const result = await collection.updateOne(
        { _id: safeObjectId(_id ?? clientId) },
        { $set: updateData
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 }
        );
      }
      const newestActivity = await activities.findOne(
        { _id: activity.insertedId },
        { sort: { createdAt: -1 } }
      );
      const client = await collection.findOne({
        _id: safeObjectId(_id ?? clientId)
      });
      return NextResponse.json({ newestActivity, client }, { status: 200 });
    }
  } catch (error) {
      console.error("Error adding/updating client:", error);
      return NextResponse.json(
        { error: "Failed to add/update client" },
        { status: 500 }
      );
  }
}
