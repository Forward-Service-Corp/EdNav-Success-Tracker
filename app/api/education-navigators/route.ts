import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const navigator = url.searchParams.get("navigator") || "";
  const navigatorsCollection = await getCollection("users");
  const navigators = await navigatorsCollection.findOne({ name: navigator });
  return NextResponse.json(navigators, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json(); // body.item = item to toggle
  try {
    const users = await getCollection("users");
    const navObjectId = ObjectId.createFromBase64(body.navigator);
    const navigator = await users.findOne({ _id: navObjectId });

    if (!navigator)
      return NextResponse.json("Navigator not found", { status: 404 });

    const alreadyPinned = navigator.pinned?.includes(body.clientId);

    const result = await users.updateOne(
      { _id: navObjectId },
      alreadyPinned
        ? { $pull: { pinned: body.clientId } }
        : { $addToSet: { pinned: body.clientId } },
    );

    const updatedNavigator = await users.findOne({ _id: navObjectId });

    return NextResponse.json({ updatedNavigator, result }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("Server error", { status: 500 });
  }
}
