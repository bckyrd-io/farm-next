import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../drizzle/db";
import { performanceTable, activitiesTable } from "../../../drizzle/db/schema";
import { eq } from "drizzle-orm";

// 1. Fetch all performances (Staff Page)
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        console.log("Received GET request:");
        console.log("URL:", req.url);
        console.log("Extracted userId:", userId);

        if (userId) {
            console.log("Fetching performance for specific user...");
            // Fetch specific user's performance (Performance Page)
            const performances = await db
                .select({
                    id: performanceTable.id,
                    activity: activitiesTable.description,
                    status: performanceTable.status,
                    updatedAt: performanceTable.updatedAt,
                })
                .from(performanceTable)
                .innerJoin(activitiesTable, eq(performanceTable.activityId, activitiesTable.id))
                .where(eq(performanceTable.userId, Number(userId)));

            console.log("Performance data for userId:", userId, performances);
            return NextResponse.json({ success: true, performance: performances });
        } else {
            console.log("Fetching all performances for staff page...");
            // Fetch all performances (Staff Page)
            const performances = await db
                .select({
                    id: performanceTable.id,
                    userId: performanceTable.userId,
                    username: performanceTable.userId, // Assuming username can be fetched similarly
                    activity: activitiesTable.description,
                    status: performanceTable.status,
                    updatedAt: performanceTable.updatedAt,
                })
                .from(performanceTable)
                .innerJoin(activitiesTable, eq(performanceTable.activityId, activitiesTable.id));

            console.log("All performances fetched:", performances);
            return NextResponse.json({ success: true, performance: performances });
        }
    } catch (error) {
        console.error("Error fetching performance data:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// 2. Fetch chart-specific data (Chart Page)
export async function POST(req: NextRequest) {
    try {
        console.log("Received POST request for chart data:");
        const { userId } = await req.json();

        console.log("Request body:", { userId });

        if (!userId) {
            console.warn("User ID is missing in request body");
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        console.log("Fetching chart data for userId:", userId);
        const chartData = await db
            .select({
                activityType: activitiesTable.description,
                totalAmount: performanceTable.status, // Assuming status represents the amount
            })
            .from(performanceTable)
            .innerJoin(activitiesTable, eq(performanceTable.activityId, activitiesTable.id))
            .where(eq(performanceTable.userId, Number(userId)));

        console.log("Fetched chart data:", chartData);
        return NextResponse.json({ success: true, chartData });
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
