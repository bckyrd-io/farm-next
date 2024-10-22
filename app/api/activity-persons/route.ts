import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../src/db';
import { activityPersonsTable } from '../../../src/db/schema';
import { and, eq } from 'drizzle-orm';

// GET: Fetch all activity-person relations
export async function GET() {
    const activityPersons = await db.select().from(activityPersonsTable);
    return NextResponse.json(activityPersons);
}

// POST: Add a person to an activity
export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data.activityId || !data.personId || !data.workHours) {
        return NextResponse.json({ error: 'Activity ID, Person ID, and Work Hours are required' }, { status: 400 });
    }

    const newActivityPerson = await db.insert(activityPersonsTable).values({
        activityId: data.activityId,
        personId: data.personId,
        workHours: data.workHours,
    }).returning();

    return NextResponse.json(newActivityPerson);
}

// DELETE: Remove a person from an activity
export async function DELETE(request: NextRequest) {
    const { activityId, personId } = await request.json();

    if (!activityId || !personId) {
        return NextResponse.json({ error: 'Activity ID and Person ID are required' }, { status: 400 });
    }

    await db.delete(activityPersonsTable).where(
        and(
            eq(activityPersonsTable.activityId, activityId),
            eq(activityPersonsTable.personId, personId)
        )
    );
    return NextResponse.json({ message: 'Person removed from activity successfully' });
}
