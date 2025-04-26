# Activities API

This API manages activity tracking for clients in the Success Tracker app.

## Recent Updates

The API now provides both nested original data and flattened data structures optimized for Power BI and other BI tools.
The flattened structure brings nested properties up to the first level for easier querying and reporting.

## API Endpoints

### GET /api/activities

Retrieves activities for a client.

**Query Parameters:**

- `clientId` (required): The ID of the client to retrieve activities for

**Response:**

```json
{
  "success": true,
  "data": [
    ...
  ],
  // Original nested activities 
  "flattenedData": [
    ...
  ],
  // Flattened activities for BI tools
  "notesRes": [
    ...
  ]
  // Notes related to these activities
}
```

### POST /api/activities

Creates a new activity.

**Request Body:**
Various fields depending on the activity type (see the type definitions in `index.ts` for details).

**Response:**

```json
{
  "message": "Action added successfully",
  "wholeUser": {
    ...
  },
  // Full user object
  "userActions": [
    ...
  ],
  // User's activities
  "comments": [
    ...
  ],
  // User's comments
  "_id": "...",
  // ID of the created activity
  "user": {
    ...
  },
  // User update result
  "activity": {
    ...
  },
  // The created activity (nested structure)
  "data": {
    ...
  },
  // Alias for activity
  "flattenedActivity": {
    ...
  }
  // Flattened activity for BI tools
}
```

## Flattened Data Structure

The flattened data structure makes it easier to query and report on activities in Power BI by bringing nested properties
up to the first level.

### Original Nested Structure

```json
{
  "clientId": "123",
  "createdAt": "2025-04-25T15:00:00Z",
  "path": [
    "adult",
    "educational activities",
    "GED"
  ],
  "trackable": {
    "program": "GED",
    "items": [
      {
        "name": "orientation",
        "completed": true
      },
      {
        "name": "tabe",
        "completed": false
      }
    ],
    "length": 2
  },
  "selections": [
    "orientation",
    "assessment"
  ]
}
```

### Flattened Structure

```json
{
  "clientId": "123",
  "createdAt": "2025-04-25T15:00:00Z",
  "path": [
    "adult",
    "educational activities",
    "GED"
  ],
  "trackable": {
    "program": "GED",
    "items": [
      {
        "name": "orientation",
        "completed": true
      },
      {
        "name": "tabe",
        "completed": false
      }
    ],
    "length": 2
  },
  "selections": [
    "orientation",
    "assessment"
  ],
  // Flattened fields for BI tools
  "trackable_program": "GED",
  "completed_items": "orientation",
  "total_items_count": 2,
  "completed_items_count": 1,
  "path_string": "adult > educational activities > GED",
  "selections_string": "orientation, assessment",
  "created_date": "2025-04-25",
  "selected_date": "2025-04-25"
}
```

## Usage in Power BI

The flattened structure allows for easier filtering and reporting in Power BI:

1. Use the `flattenedData` array from GET responses or the `flattenedActivity` object from POST responses
2. Filter using the string fields like `path_string` and `selections_string`
3. Create metrics using the count fields like `total_items_count` and `completed_items_count`
4. Create date-based reports using the formatted date fields
5. Group and filter by program using the top-level `trackable_program` field

## Types and Interfaces

See `index.ts` for complete TypeScript interfaces and types describing the API data structures.