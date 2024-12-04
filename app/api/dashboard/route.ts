import { NextResponse } from 'next/server';
import { db } from '../../../drizzle/db'; // Adjusted path to the `db` setup
import { activitiesTable, schedulesTable } from '../../../drizzle/db/schema'; // Correct schema import
import { sql } from 'drizzle-orm'; // SQL utilities from Drizzle ORM

// GET function for the `/api/dashboard` route
export async function GET() {
  try {
    // Fetch aggregated activity data grouped by `activity_type`
    const activitiesByType = await db
      .select({
        activityType: activitiesTable.activityType,
        totalAmount: sql<number>`SUM(${activitiesTable.amount})`,
        revenueAmount: sql<number>`SUM(CASE WHEN ${activitiesTable.activityType} = 'revenue' THEN ${activitiesTable.amount} ELSE 0 END)`,
        expenseAmount: sql<number>`SUM(CASE WHEN ${activitiesTable.activityType} = 'expense' THEN ${activitiesTable.amount} ELSE 0 END)`,
        netProfit: sql<number>`SUM(CASE WHEN ${activitiesTable.activityType} = 'revenue' THEN ${activitiesTable.amount} ELSE 0 END) - SUM(CASE WHEN ${activitiesTable.activityType} = 'expense' THEN ${activitiesTable.amount} ELSE 0 END)`,
        activities: sql<any>`ARRAY_AGG(${activitiesTable.description})`,
      })
      .from(activitiesTable)
      .where(sql`${activitiesTable.activityType} != 'Neutral'`) // Add this condition to exclude 'neutral' activity type
      .groupBy(activitiesTable.activityType);


    // Fetch detailed activity list grouped by activity ID
    const activitiesList = await db
      .select({
        activityId: activitiesTable.id,
        activityType: activitiesTable.activityType,
        description: activitiesTable.description,
        amount: activitiesTable.amount,
        createdAt: activitiesTable.createdAt,
      })
      .from(activitiesTable);

    // Fetch notifications from the schedules table
    const notifications = await db
      .select({
        notificationMessage: schedulesTable.notificationMessage,
      })
      .from(schedulesTable);

    // Send the result as JSON
    return NextResponse.json({
      activitiesByType,
      activitiesList,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
