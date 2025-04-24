import { getCollection } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId") || "";
  const activityId = url.searchParams.get("activityId") || "";

  let notes;
  try {
    const collection = await getCollection("notes");

    // Filter by clientId if provided
    if (clientId && !activityId) {
      try {
        // Try to convert to ObjectId if it's a valid format
        const query = { clientId: clientId };
        notes = await collection.find(query).sort({ createdAt: -1 }).toArray();
      } catch (err) {
        console.error("Error processing clientId:", err);
        // Fallback to string comparison if ObjectId conversion fails
        notes = await collection
          .find({ clientId: clientId })
          .sort({ createdAt: -1 })
          .toArray();
      }
    }

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}