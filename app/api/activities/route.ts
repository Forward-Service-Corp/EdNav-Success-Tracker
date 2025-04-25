import { type NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to safely convert client IDs to MongoDB ObjectIds
const safeObjectId = (id: string) => {
  try {
    // Check if it's a 24-character hex string
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id);
    }

    // Try using createFromHexString if the format looks right
    if (id && id.length === 24) {
      return new ObjectId(id);
    }

    // Only use createFromBase64 if exactly 16 characters (MongoDB requirement)
    if (id && id.length === 16) {
      return ObjectId.createFromBase64(id);
    }

    // If all else fails, return the original ID
    console.log(`Unable to convert ID to ObjectId: ${id}`);
    return id;
  } catch (error) {
    console.error(`Error converting ObjectId: ${error}`);
    return id; // Return original ID on error
  }
};

// Helper function to flatten activity data for Power BI and other tools
// This ensures consistent structure between GET and POST responses
const flattenActivityData = (activity: any) => {
  if (!activity) return {};

  // Create a new object to hold flattened data
  const flattenedActivity = { ...activity };

  try {
    // Extract and flatten trackable items if they exist
    if (activity.trackable && activity.trackable.items && Array.isArray(activity.trackable.items)) {
      // Add trackable_program at the top level
      flattenedActivity.trackable_program = activity.trackable.program || '';

      // Add completed_items as a comma-separated string of completed item names
      const completedItems = activity.trackable.items
        .filter((item: any) => item && item.completed)
        .map((item: any) => item.name);
      flattenedActivity.completed_items = completedItems.join(', ');

      // Add total_items and completed_count
      flattenedActivity.total_items_count = activity.trackable.items.length;
      flattenedActivity.completed_items_count = completedItems.length;
    }

    // Extract path as a single string for easier filtering
    if (activity.path && Array.isArray(activity.path)) {
      flattenedActivity.path_string = activity.path.join(' > ');
    }

    // Extract selections as a string if they exist
    if (activity.selections && Array.isArray(activity.selections)) {
      flattenedActivity.selections_string = activity.selections.join(', ');
    }

    // Add any other valuable fields here that would be useful at the top level
    // for Power BI analysis, such as client information, timestamps, etc.

    // Ensure dates are in proper format if they exist
    if (activity.createdAt) {
      flattenedActivity.created_date = activity.createdAt.split('T')[0] || '';
    }

    if (activity.selectedDate) {
      flattenedActivity.selected_date = typeof activity.selectedDate === 'string'
        ? activity.selectedDate.split('T')[0]
        : '';
    }
  } catch (error) {
    console.error('Error flattening activity data:', error);
    // Return the original activity if there's an error during flattening
    return activity;
  }

  return flattenedActivity;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId");
  try {
    const actionsCollection = await getCollection("actions");
    const notesCollection = await getCollection("notes");
    const actionRes = await actionsCollection
      .aggregate([
        { $match: { clientId } },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray();
    const notesRes = await notesCollection
      .aggregate([
        { $match: { clientId } },
        {
          $group: {
            _id: "$activityId",
            records: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray();

    // Process nested data to create flattened versions for Power BI
    const processedActionRes = actionRes.map(action => flattenActivityData(action));

    return NextResponse.json(
      {
        success: true,
        data: actionRes,            // Original nested structure 
        flattenedData: processedActionRes, // New flattened structure for BI tools
        notesRes
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Aggregation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body and log for debugging
    const body = await request.json();
    console.log('Received activity request body:', JSON.stringify(body, null, 2));
    
    const actionsCollection = await getCollection("actions");
    const clientsCollection = await getCollection("clients");
    const notesCollection = await getCollection("notes");
    const commentsCollection = await getCollection("comments");

    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }

    // Ensure required fields are present
    if (!body.clientId) {
      console.error('Missing clientId in activity data');
      return NextResponse.json(
        { error: 'Missing clientId in activity data' },
        { status: 400 }
      );
    }
    // Handle direct note submissions (where isNote is true at the top level)
    if (body.isNote) {
      try {
        const clientId = body.clientId;
        if (!clientId) {
          return NextResponse.json(
            { error: "Missing clientId for note" },
            { status: 400 },
          );
        }

        // Convert string ID to ObjectId using our safe function
        const clientObjectId = typeof clientId === 'string'
          ? safeObjectId(clientId)
          : clientId;

        // Find the client using a flexible query that works with both ObjectId and string
        const client = await clientsCollection.findOne({
          $or: [
            { _id: clientObjectId },
            { _id: clientId }
          ]
        });
        
        if (!client) {
          return NextResponse.json(
            { error: "Client not found" },
            { status: 404 },
          );
        }

        // Create the note document
        const noteDoc = {
          noteContent: body.noteContent,
          noteAuthor: body.noteAuthor,
          createdAt: body.createdAt || new Date().toISOString(),
          clientId: clientId,
          isNote: true,
        };

        // Insert the note
        const insertResult = await notesCollection.insertOne(noteDoc);

        // Update client's last activity using flexible query
        await clientsCollection.updateOne(
          {
            $or: [
              { _id: clientObjectId },
              { _id: clientId }
            ]
          },
          { $set: { lastActivity: new Date().toISOString() } },
        );

        // Get an updated notes list
        const notes = await notesCollection
          .find({ clientId })
          .sort({ createdAt: -1 })
          .toArray();

        return NextResponse.json(
          {
            message: "Note added successfully",
            insertedId: insertResult.insertedId,
            client,
            notes,
          },
          { status: 201 },
        );
      } catch (error) {
        console.error("Error saving note:", error);
        return NextResponse.json(
          { error: "Failed to save note" },
          { status: 500 },
        );
      }
    }

    // Handle nested note object (legacy format) // TODO check which version we use
    if (body.note && body.note.isNote) {
      try {
        const clientId = body.note.clientId;
        // Use safe conversion function
        const clientObjectId = typeof clientId === 'string'
          ? safeObjectId(clientId)
          : clientId;

        // Find client with flexible query  
        const client = await clientsCollection.findOne({
          $or: [
            { _id: clientObjectId },
            { _id: clientId }
          ]
        });

        if (client) {
          await notesCollection.insertOne(body.note);
          // Update with flexible query
          await clientsCollection.updateOne(
            {
              $or: [
                { _id: clientObjectId },
                { _id: clientId }
              ]
            },
            { $set: { lastActivity: new Date().toISOString() } },
          );

          // Get an updated notes list
          const notes = await notesCollection
            .find({ clientId })
            .sort({ createdAt: -1 })
            .toArray();

          // Use safe conversion for activities query  
          const activities = await actionsCollection
            .find({
              $or: [
                { _id: clientObjectId },
                { _id: clientId }
              ]
            })
            .toArray();

          // Use safe conversion for comments query
          const comments = commentsCollection.find({
            $or: [
              { _id: clientObjectId },
              { _id: clientId }
            ]
          });

          return NextResponse.json(
            {
              message: "Note added successfully",
              client: {
                notes,
                activities,
                comments,
              },
            },
            { status: 201 }
          );
        } else {
          return NextResponse.json(
            { error: "Client not found" },
            { status: 404 },
          );
        }
      } catch (error) {
        console.error("Error saving note with nested format:", error);
        return NextResponse.json(
          { error: "Failed to save note" },
          { status: 500 },
        );
      }
    }

    // COMMENT SECTION
    if (body.comment && body.comment.isComment) {
      try {
        const clientId = body.clientId;
        if (!clientId) {
          return NextResponse.json(
            { error: "Missing clientId for comment" },
            { status: 400 },
          );
        }

        // Convert string ID to ObjectId using our safe function
        const clientObjectId = typeof clientId === 'string'
          ? safeObjectId(clientId)
          : clientId;

        // Find client with flexible query  
        const client = await clientsCollection.findOne({
          $or: [
            { _id: clientObjectId },
            { _id: clientId }
          ]
        });
        
        if (!client) {
          return NextResponse.json(
            { error: "Client not found" },
            { status: 404 },
          );
        }

        // Create the comment document
        const commentDoc = {
          commentContent: body.commentContent || body.comment.commentContent,
          commentAuthor: body.commentAuthor || body.comment.commentAuthor,
          createdAt:
            body.createdAt ||
            body.comment.createdAt ||
            new Date().toISOString(),
          clientId: clientId,
          isComment: true,
          // Add parent reference
          parentId: body.comment.parentId || null,
          parentType: body.comment.parentType || null,
        };

        // Insert the comment
        const insertResult = await commentsCollection.insertOne(commentDoc);

        // Update client's last activity with flexible query
        await clientsCollection.updateOne(
          {
            $or: [
              { _id: clientObjectId },
              { _id: clientId }
            ]
          },
          { $set: { lastActivity: new Date().toISOString() } },
        );

        // Get an updated comments list
        const comments = await commentsCollection
          .find({ clientId })
          .sort({ createdAt: -1 })
          .toArray();

        return NextResponse.json(
          {
            message: "Comment added successfully",
            insertedId: insertResult.insertedId,
            client,
            comments,
          },
          { status: 201 },
        );
      } catch (error) {
        console.error("Error saving comment:", error);
        return NextResponse.json(
          { error: "Failed to save comment" },
          { status: 500 },
        );
      }
    }

    if (
      body.path &&
      body.path.length &&
      body.path?.includes("graduated") &&
      body.path?.includes("inactive")
    ) {
      // Use safe conversion for client ID
      const clientObjectId = typeof body.clientId === 'string'
        ? safeObjectId(body.clientId)
        : body.clientId;
        
      const [client] = await Promise.all([
        clientsCollection.findOne({
          $or: [
            { _id: clientObjectId },
            { _id: body.clientId }
          ]
        })
      ]);

      if (client && client.group && client.group.toString().toLowerCase() === 'youth') {
        // Update client with flexible query
        await clientsCollection.updateOne(
          {
            $or: [
              { _id: clientObjectId },
              { _id: body.clientId }
            ]
          },
          {
            $set: {
              clientStatus: "graduated",
              lastActivity: new Date().toISOString(),
            },
          },
        );
        return NextResponse.json(
          { message: "Action added successfully", client },
          { status: 201 },
        );
      }
      if (client && client.group && client.group.toString().toLowerCase() === 'adult') {
        // Update client with flexible query
        await clientsCollection.updateOne(
          {
            $or: [
              { _id: clientObjectId },
              { _id: body.clientId }
            ]
          },
          {
            $set: {
              clientStatus: "inactive",
              lastActivity: new Date().toISOString(),
            },
          },
        );
        return NextResponse.json(
          { message: "Action added successfully", client },
          { status: 201 },
        );
      }
    }
    if (body.path?.includes("enrolled in")) {
      // Use safe conversion for client ID
      const clientObjectId = typeof body.clientId === 'string'
        ? safeObjectId(body.clientId)
        : body.clientId;

      // Find client with flexible query
      const client = await clientsCollection.findOne({
        $or: [
          { _id: clientObjectId },
          { _id: body.clientId }
        ]
      });

      if (client) {
        // Update client with flexible query
        await clientsCollection.updateOne(
          {
            $or: [
              { _id: clientObjectId },
              { _id: body.clientId }
            ]
          },
          {
            $set: {
              clientStatus: "active",
              lastActivity: new Date().toISOString(),
            },
          },
        );
        return NextResponse.json(
          { message: "Action added successfully", client },
          { status: 201 },
        );
      }
    }
    // Check if the activity should update the client status
    if (body.data && body.data.updateClientStatus) {
      const clientId = body.data.clientId || body.clientId;
      const newStatus = body.data.updateClientStatus;

      if (clientId) {
        try {
          // Update client status using flexible query
          const clientObjectId = typeof clientId === 'string'
            ? safeObjectId(clientId)
            : clientId;
            
          await clientsCollection.updateOne(
            {
              $or: [
                { _id: clientObjectId },
                { _id: clientId }
              ]
            },
            {
              $set: {
                clientStatus: newStatus,
                lastActivity: new Date().toISOString(),
              },
            },
          );

          console.log(
            `Client status updated to ${newStatus} for client ${clientId}`,
          );
        } catch (error) {
          console.error("Error updating client status:", error);
        }
      }
    }

    // Create a flexible query using our safe ID conversion
    const clientObjectId = typeof body.clientId === 'string'
      ? safeObjectId(body.clientId)
      : body.clientId;

    const query = {
      $or: [
        { _id: clientObjectId },
        { _id: body.clientId }
      ]
    };
    
    let user;

    // Update last activity with flexible query
    user = await clientsCollection.updateOne(query, {
      $set: { lastActivity: new Date().toISOString() },
    });

    if (body.trackable) {
      // Update trackable with flexible query
      user = await clientsCollection.updateOne(query, {
        $set: {
          trackable: body.trackable,
        },
      });
    }

    if (
      body.trackable?.items?.some(
        (item: { name: string; completed: boolean }) =>
          item.name.toLowerCase() === "orientation" && item.completed,
      )
    ) {
      user = await clientsCollection.updateOne(query, {
        $set: {
          orientation: {
            referralDate: new Date().toISOString(),
            completionDate: null,
          },
        },
      });
    }
    if (
      body.trackable?.items?.some(
        (item: { name: string; completed: boolean }) =>
          item.name.toLowerCase() === "tabe" && item.completed,
      )
    ) {
      user = await clientsCollection.updateOne(query, {
        $set: {
          tabe: {
            referralDate: new Date().toISOString(),
            completionDate: null,
          },
        },
      });
    }
    if (
      body.trackable?.items?.some(
        (item: { name: string; completed: boolean }) =>
          item.name.toLowerCase() === "hs transcript" && item.completed,
      )
    ) {
      user = await clientsCollection.updateOne(query, {
        $set: {
          transcripts: {
            referralDate: new Date().toISOString(),
            completionDate: null,
          },
        },
      });
    }

    try {
      // Ensure the payload is properly structured for MongoDB
      const cleanPayload = {
        ...body,
        // Ensure these fields are properly formatted
        clientId: body.clientId,
        timestamp: body.timestamp || new Date().toISOString(),
        createdAt: body.createdAt || new Date().toISOString(),
        // Convert Date objects to ISO strings
        selectedDate: body.selectedDate instanceof Date
          ? body.selectedDate.toISOString()
          : body.selectedDate || new Date().toISOString()
      };

      console.log('Inserting activity with payload:', JSON.stringify(cleanPayload, null, 2));
      const result = await actionsCollection.insertOne(cleanPayload);
      console.log('Activity inserted successfully with ID:', result.insertedId);

      const userActions = await actionsCollection
        .find({ clientId: body.clientId })
        .sort({ createdAt: -1 })
        .toArray();

      const comments = await notesCollection
        .find({ clientId: body.clientId })
        .sort({ createdAt: -1 })
        .toArray();

      // Handle potential conversion errors with client ID
      let wholeUser = null;
      try {
        // Find user with flexible query
        wholeUser = await clientsCollection.findOne({
          $or: [
            { _id: clientObjectId },
            { _id: body.clientId }
          ]
        });
      } catch (clientLookupError) {
        console.error('Error looking up client with ID:', body.clientId, clientLookupError);
        // Try a direct lookup without conversion as fallback
        try {
          wholeUser = await clientsCollection.findOne({ _id: body.clientId });
        } catch (directLookupError) {
          console.error('Direct client lookup also failed:', directLookupError);
        }
      }

      // Add the _id to the body object for a consistent return
      const savedActivity = {
        ...body,
        _id: result.insertedId
      };

      // Create flattened version of the saved activity for Power BI
      const flattenedActivity = flattenActivityData(savedActivity);

      console.log('API response:', {
        message: 'Action added successfully',
        activity: savedActivity,
        flattenedActivity
      });

      return NextResponse.json(
        {
          message: 'Action added successfully',
          wholeUser,
          userActions,
          comments,
          _id: result.insertedId,
          user,
          activity: savedActivity,
          // Include both the original nested data and the flattened version
          data: savedActivity,
          flattenedActivity
        },
        { status: 201 }
      );
    } catch (innerError) {
      console.error('Error inserting activity:', innerError);
      throw innerError; // Re-throw to be caught by the outer try/catch
    }
  } catch (error) {
    console.error("Error adding action:", error);

    // Provide more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack
    });
    
    return NextResponse.json(
      {
        error: 'Failed to add action',
        details: errorMessage,
        // Include request info for debugging (but sanitize sensitive data)
        request: {
          method: request.method,
          headers: Object.fromEntries(
            Array.from(request.headers.entries())
              .filter(([key]) => !['authorization', 'cookie'].includes(key.toLowerCase()))
          )
        }
      },
      { status: 500 },
    );
  }
}