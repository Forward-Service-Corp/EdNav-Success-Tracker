import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// import { createGetHandler } from '@/lib/api/createGetHandler';
// import { flattenActivityData } from '@/lib/activities/utils';
//
// export const GET = createGetHandler({
//   collectionName: 'activities',
//   queryParam: 'clientId',
//   transform: (results) => results.map(flattenActivityData),
// });

type GetHandlerOptions = {
  collectionName: string;
  queryParam: string; // e.g. "clientId"
  queryKey?: string; // if different from queryParam
  transform?: (results: any[]) => any;
};

export const createGetHandler = ({
                                   collectionName,
                                   queryParam,
                                   queryKey,
                                   transform
                                 }: GetHandlerOptions) => {
  return async function GET(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const paramValue = url.searchParams.get(queryParam);

      if (!paramValue) {
        return NextResponse.json(
          { error: `Missing query param: ${queryParam}` },
          { status: 400 }
        );
      }

      const collection = await getCollection(collectionName);
      const results = await collection
        .find({ [queryKey || queryParam]: paramValue })
        .sort({ createdAt: -1 })
        .toArray();

      const data = transform ? transform(results) : results;

      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
      console.error(`[${collectionName}] GET error:`, error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  };
};