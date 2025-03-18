import { NextResponse } from 'next/server';
import { db } from '../../../drizzle/db'; // Adjusted path to the `db` setup
import { activitiesTable, activityResourcesTable, branchesTable, performanceTable, resourcesTable, schedulesTable, usersTable } from '../../../drizzle/db/schema'; // Correct schema import
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
        activities: sql<string[]>`GROUP_CONCAT(${activitiesTable.description})`, // Specify the type as string[]
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
        resourcesUsed: sql<string>`IFNULL(GROUP_CONCAT(DISTINCT 
            CONCAT(${resourcesTable.name}, ' (', ${activityResourcesTable.allocatedQuantity}, ' ', ${resourcesTable.unit}, ')')
            SEPARATOR ', '), '')`,
        assignedStaff: sql<string>`IFNULL(GROUP_CONCAT(DISTINCT
            CONCAT(${usersTable.username}, ' [', ${performanceTable.status}, ']') 
            SEPARATOR ', '), '')`,
        upcomingDates: sql<string>`IFNULL(GROUP_CONCAT(DISTINCT
            DATE_FORMAT(${schedulesTable.scheduledDate}, '%Y-%m-%d') 
            SEPARATOR ', '), '')`,
        involvedBranches: sql<string>`IFNULL(GROUP_CONCAT(DISTINCT 
            ${branchesTable.location} 
            SEPARATOR ', '), '')`
    })
    .from(activitiesTable)
    .leftJoin(activityResourcesTable, sql`${activityResourcesTable.activityId} = ${activitiesTable.id}`)
    .leftJoin(resourcesTable, sql`${resourcesTable.id} = ${activityResourcesTable.resourceId}`)
    .leftJoin(performanceTable, sql`${performanceTable.activityId} = ${activitiesTable.id}`)
    .leftJoin(usersTable, sql`${usersTable.id} = ${performanceTable.userId}`)
    .leftJoin(branchesTable, sql`${branchesTable.id} = ${usersTable.branchId}`)
    .leftJoin(schedulesTable, sql`${schedulesTable.activityId} = ${activitiesTable.id}`)
    .groupBy(activitiesTable.id);


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
