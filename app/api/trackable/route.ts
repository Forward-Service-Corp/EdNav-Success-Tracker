import { type NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    const body = await request.json()
    const clientsCollection = await getCollection("clients")
    // const actionsCollection = await getCollection("actions")
    // @ts-ignore
    const query = { _id: ObjectId.createFromBase64(clientId) };

    const user = await clientsCollection.findOne(query)
    let dataRes
    if (user) {
        user.trackable = body.trackable
      dataRes = await clientsCollection.updateOne({ _id: clientId ? ObjectId.createFromBase64(clientId) : undefined }, { $set: { trackable: body.trackable } });
    }
    if (body.trackable?.items?.some((item: { name: string; completed: boolean }) => item.name.toLowerCase() === "orientation" && item.completed)) {
      dataRes = await clientsCollection.updateOne(
        query,
        {
          $set:
            {
              orientation: {dateReferred: new Date().toISOString(), completedDate: null},
            }
        }
      )
    }
    if (body.trackable?.items?.some((item: { name: string; completed: boolean }) => item.name.toLowerCase() === "tabe" && item.completed)) {
      dataRes = await clientsCollection.updateOne(
        query,
        {
          $set:
            {
              tabe: {dateReferred: new Date().toISOString(), completedDate: null},
            }
        }
      )
    }

    return NextResponse.json({ message: "Action added successfully", dataRes, user }, { status: 201 })
  } catch (error) {
    console.error("Error adding action:", error)
    return NextResponse.json({ error: "Failed to add action" }, { status: 500 })
  }
}
