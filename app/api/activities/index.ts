/**
 * Types and interfaces for the Activities API
 *
 * This file defines the data structures used by the Activities API,
 * including both the nested original format and the flattened format
 * designed for easier consumption by Power BI and other BI tools.
 */

import { ObjectId } from 'mongodb';

export interface TrackableItem {
  name: string;
  completed: boolean;
  id?: string;
  savedInDatabase?: boolean;
}

export interface Trackable {
  program: string;
  items: TrackableItem[];
  createdAt: string;
  length: number;
}

export interface Activity {
  _id?: string | ObjectId;
  clientId: string;
  clientEmail?: string;
  fep?: string;
  navigator?: string;
  timestamp: string;
  createdAt: string;
  selectedDate?: string | Date;
  selection?: string;
  path?: string[];
  statement?: string;
  trackable?: Trackable;
  selections?: string[];
  updateClientStatus?: string;
  type?: string;
  isOptimistic?: boolean;
  preventDuplicates?: string;
}

/**
 * FlattenedActivity includes all properties from Activity plus
 * additional flattened properties for easier consumption by BI tools.
 *
 * The flattened fields include:
 * - trackable_program: The program from trackable (GED, HSED, etc.)
 * - completed_items: Comma-separated string of completed trackable items
 * - total_items_count: Total number of trackable items
 * - completed_items_count: Number of completed trackable items
 * - path_string: Path array joined with ">" for easier filtering
 * - selections_string: Selections array joined with "," for easier filtering
 * - created_date: ISO date string split to just the date portion
 * - selected_date: ISO date string split to just the date portion
 */
export interface FlattenedActivity extends Activity {
  trackable_program?: string;
  completed_items?: string;
  total_items_count?: number;
  completed_items_count?: number;
  path_string?: string;
  selections_string?: string;
  created_date?: string;
  selected_date?: string;
}

/**
 * API response shape for GET /api/activities
 */
export interface GetActivitiesResponse {
  success: boolean;
  data?: Activity[];
  flattenedData?: FlattenedActivity[];
  notesRes?: any[];
  error?: string;
}

/**
 * API response shape for POST /api/activities
 */
export interface PostActivityResponse {
  message: string;
  wholeUser?: any;
  userActions?: any[];
  comments?: any[];
  _id?: string | ObjectId;
  user?: any;
  activity?: Activity;
  data?: Activity;
  flattenedActivity?: FlattenedActivity;
  error?: string;
}

/**
 * Flattens an activity object for easier consumption by BI tools.
 * This is the TypeScript type definition for the implementation in route.ts.
 */
export type FlattenActivityFn = (activity: Activity) => FlattenedActivity;