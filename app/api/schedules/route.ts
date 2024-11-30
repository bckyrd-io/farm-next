import { db } from '../../../drizzle/db';
import { schedulesTable, activitiesTable } from '../../../drizzle/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Fetch schedules with their related activity descriptions using a join
        const schedules = await db
            .select({
                scheduleId: schedulesTable.id,
                scheduledDate: schedulesTable.scheduledDate,
                activityDescription: activitiesTable.description,
            })
            .from(schedulesTable)
            .leftJoin(activitiesTable, eq(activitiesTable.id, schedulesTable.activityId));

        // Validate and format the response to match FullCalendar's expected structure
        const events = schedules.map((schedule) => ({
            id: schedule.scheduleId?.toString() ?? '', // Ensure id is a string
            title: schedule.activityDescription ?? 'Untitled Activity', // Provide a default title
            start: schedule.scheduledDate ? new Date(schedule.scheduledDate).toISOString() : '', // Ensure ISO string format
        }));

        return NextResponse.json({ 
            success: true, 
            events,
            total: events.length 
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : 'Unknown server error',
                events: [] 
            },
            { status: 500 }
        );
    }
}