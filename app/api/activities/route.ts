import { db } from '../../../src/db';
import { activitiesTable } from '../../../src/db/schema';
import { NextResponse } from 'next/server';


export async function GET() {
  const activities = await db.select().from(activitiesTable);
  return NextResponse.json(activities);
}



export async function POST(req: Request) {
  const { description, activityType, amount, activityDate } = await req.json();
  try {
    await db.insert(activitiesTable).values({ description, activityType, amount, activityDate });
    return NextResponse.json({ message: 'Activity added successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding activity' }, { status: 500 });
  }
}




