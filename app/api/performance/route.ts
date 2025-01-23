import { db } from "../../../drizzle/db";
import { performanceTable, activitiesTable, usersTable } from "../../../drizzle/db/schema";
import { eq, or, and, isNull } from "drizzle-orm";

// Fetch all performances or specific user's performances
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (userId) {
            // Fetch specific user's performance where role is 'Staff'
            const performances = await db
                .select({
                    id: performanceTable.id,
                    userId: performanceTable.userId,
                    username: usersTable.username,
                    role: usersTable.role,
                    activity: activitiesTable.description,
                    status: performanceTable.status,
                    updatedAt: performanceTable.updatedAt,
                })
                .from(usersTable)
                .leftJoin(performanceTable, eq(usersTable.id, performanceTable.userId))
                .leftJoin(activitiesTable, eq(performanceTable.activityId, activitiesTable.id))
                .where(
                    and(
                        eq(usersTable.id, Number(userId)),
                        eq(usersTable.role, "Staff")
                    )
                );

            return new Response(JSON.stringify({ success: true, performance: performances }), {
                status: 200,
            });
        } else {
            // Fetch all performances where role is 'Staff', including unassigned staff
            const performances = await db
                .select({
                    id: performanceTable.id,
                    userId: usersTable.id,
                    username: usersTable.username,
                    role: usersTable.role,
                    activity: activitiesTable.description,
                    status: performanceTable.status,
                    updatedAt: performanceTable.updatedAt,
                })
                .from(usersTable)
                .leftJoin(performanceTable, eq(usersTable.id, performanceTable.userId))
                .leftJoin(activitiesTable, eq(performanceTable.activityId, activitiesTable.id))
                .where(eq(usersTable.role, "Staff"));

            return new Response(JSON.stringify({ success: true, performance: performances }), {
                status: 200,
            });
        }
    } catch (error) {
        console.error("Error fetching performance data:", error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), {
            status: 500,
        });
    }
}

// Create a new performance entry
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const newPerformance = await db.insert(performanceTable).values({
            userId: body.userId,
            activityId: body.activityId,
            status: body.status,
            updatedAt: new Date(), // Use Date object directly
        });

        return new Response(JSON.stringify({ success: true, performance: newPerformance }), {
            status: 201,
        });
    } catch (error) {
        console.error("Error creating performance entry:", error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), {
            status: 500,
        });
    }
}
