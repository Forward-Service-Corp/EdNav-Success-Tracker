import { ObjectId } from 'mongodb';

export const safeObjectId = (id: string) => {
  try {
    // Check if it's a 24-character hex string
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id) as any;
    }

    // Try using createFromHexString if the format looks right
    if (id && id.length === 24) {
      return new ObjectId(id) as any;
    }

    // Only use createFromBase64 if exactly 16 characters (MongoDB requirement)
    if (id && id.length === 16) {
      return ObjectId.createFromBase64(id) as any;
    }

    // If all else fails, return the original ID
    // console.log(`Unable to convert ID to ObjectId: ${id}`);
    return id;
  } catch (error) {
    console.error(`Error converting ObjectId: ${error}`);
    return id as any; // Return original ID on error
  }
};