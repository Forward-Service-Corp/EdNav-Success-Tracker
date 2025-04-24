import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all comments
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId") || "";
  const parentId = url.searchParams.get("parentId") || "";
  const parentType = url.searchParams.get("parentType") || "";

  let comments: any[] = [];
  try {
    const collection = await getCollection("comments");

    let query: any = {};

    // Filter by clientId if provided
    if (clientId) {
      query.clientId = clientId;
    }

    // Filter by parentId if provided
    if (parentId) {
      query.parentId = parentId;
    }

    // Filter by parentType if provided
    if (parentType) {
      query.parentType = parentType;
    }

    comments = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

// POST to add a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both a nested 'comment' object and flat structure
    const commentData = body.comment || body;

    if (!commentData) {
      return NextResponse.json(
        { error: "Comment data is required" },
        { status: 400 },
      );
    }

    const collection = await getCollection("comments");
    const clientsCollection = await getCollection("clients");

    // Ensure required fields are present
    if (!commentData.commentContent) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 },
      );
    }

    if (!commentData.clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 },
      );
    }

    // Prepare the comment object for database insertion
    const commentToInsert = {
      ...commentData,
      createdAt: commentData.createdAt || new Date().toISOString(),
      isComment: true,
    };

    // Make sure clientId is stored as a string for consistent querying
    if (commentData.clientId) {
      commentToInsert.clientId = commentData.clientId.toString();
    }

    const result = await collection.insertOne(commentToInsert);

    // Update client's last activity
    try {
      // Convert string ID to ObjectId
      const clientObjectId = new ObjectId(commentData.clientId);

      await clientsCollection.updateOne(
        { _id: clientObjectId },
        { $set: { lastActivity: new Date().toISOString() } },
      );
    } catch (error) {
      console.error("Error updating client last activity:", error);
      // Continue even if this fails - it's not critical
    }

    return NextResponse.json(
      {
        message: "Comment added successfully",
        _id: result.insertedId,
        comment: commentToInsert,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 },
    );
  }
}
