import { getCollection } from "../../../lib/mongodb";

export async function GET() {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId") || "";
  const activityId = url.searchParams.get("activityId") || "";

  let notes: any[] = [];
  try {
    const collection = await getCollection("notes");

    // Filter by clientId if provided
    if (clientId && !activityId) {
      try {
        // Try to convert to ObjectId if it's a valid format
        const query = { clientId: clientId };
        notes = await collection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
      } catch (err) {
        console.error("Error processing clientId:", err);
        // Fallback to string comparison if ObjectId conversion fails
        notes = await collection
          .find({ clientId: clientId })
          .sort({ createdAt: -1 })
          .toArray();
      }
    }


  }