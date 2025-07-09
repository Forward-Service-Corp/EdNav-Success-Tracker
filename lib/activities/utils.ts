// lib/activities/utils.ts
import { ObjectId } from 'mongodb';

export const safeObjectId = (id: string) => {
  try {
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) return new ObjectId(id);
    if (id && id.length === 16) return ObjectId.createFromBase64(id);
    return id;
  } catch {
    return id;
  }
};

export const flattenActivityData = (activity: any) => {
  if (!activity) return {};

  const flattened = { ...activity };
  try {
    if (activity.trackable?.items?.length) {
      flattened.trackable_program = activity.trackable.program || '';
      const completedItems = activity.trackable.items.filter((i: { completed: any; }) => i?.completed).map((i: {
        name: any;
      }) => i.name);
      flattened.completed_items = completedItems.join(', ');
      flattened.total_items_count = activity.trackable.items.length;
      flattened.completed_items_count = completedItems.length;
    }
    if (Array.isArray(activity.path)) {
      flattened.path_string = activity.path.join(' > ');
    }
    if (Array.isArray(activity.selections)) {
      flattened.selections_string = activity.selections.join(', ');
    }
    if (activity.createdAt) {
      flattened.created_date = activity.createdAt.split('T')[0];
    }
    if (activity.selectedDate && typeof activity.selectedDate === 'string') {
      flattened.selected_date = activity.selectedDate.split('T')[0];
    }
  } catch (e) {
    console.error('Flattening error:', e);
  }

  return flattened;
};