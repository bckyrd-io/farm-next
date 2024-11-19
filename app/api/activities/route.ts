// /api/activities/route.ts

import { db } from '../../../drizzle/db';
import { activitiesTable } from '../../../drizzle/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    // Create a new activity
    const { description, activityType, amount, activityDate } = await req.json();

    try {
        const newActivity = await db.insert(activitiesTable).values({
            description,
            activityType,
            amount,
            activityDate,
        });

        return NextResponse.json({ success: true, activity: newActivity });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    // Get all activities
    try {
        const activities = await db.select().from(activitiesTable);
        return NextResponse.json({ success: true, activities });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    // Update an activity
    const { id, description, activityType, amount, activityDate } = await req.json();

    try {
        const updatedActivity = await db
            .update(activitiesTable)
            .set({ description, activityType, amount, activityDate })
            .where(eq(activitiesTable.id, id))
            .returning();

        return NextResponse.json({ success: true, activity: updatedActivity });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    // Delete an activity
    const { id } = await req.json();

    try {
        await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
        return NextResponse.json({ success: true, message: 'Activity deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
