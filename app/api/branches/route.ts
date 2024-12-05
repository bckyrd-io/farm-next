import { db } from '../../../drizzle/db';
import { branchesTable, usersTable } from '../../../drizzle/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Create Branch
export async function POST(req: Request) {
    const { name, location } = await req.json();

    try {
        const newBranch = await db.insert(branchesTable).values({
            name,
            location,
        });

        return NextResponse.json({ success: true, branch: newBranch });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('unique constraint')) {
            return NextResponse.json({ success: false, message: 'Branch name already exists' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Get All Branches with Additional Metrics (like user count)
export async function GET() {
    try {
        // Query to fetch branches and user count for each branch
        const branchesWithUserCount = await db
            .select({
                id: branchesTable.id,
                name: branchesTable.name,
                location: branchesTable.location,
                userCount: sql<number>`count(${usersTable.id})`.as('userCount') // Counting users for each branch
            })
            .from(branchesTable)
            .leftJoin(usersTable, eq(usersTable.branchId, branchesTable.id)) // Left join ensures all branches are included
            .groupBy(branchesTable.id); // Group by branch ID to get one row per branch

        return NextResponse.json({ success: true, branches: branchesWithUserCount });
    } catch (error: unknown) {
        console.error('Error fetching branches:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Update Branch
export async function PATCH(req: Request) {
    const { id, name, location } = await req.json();

    try {
        const updatedBranch = await db.update(branchesTable)
            .set({ name, location })
            .where(eq(branchesTable.id, id))
            .returning();

        if (updatedBranch.length === 0) {
            return NextResponse.json({ success: false, message: 'Branch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, branch: updatedBranch[0] });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('unique constraint')) {
            return NextResponse.json({ success: false, message: 'Branch name already exists' }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Delete Branch
export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        const deletedBranch = await db.delete(branchesTable)
            .where(eq(branchesTable.id, id))
            .returning();

        if (deletedBranch.length === 0) {
            return NextResponse.json({ success: false, message: 'Branch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Branch deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting branch:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic'; // Optional: Enable dynamic behavior if needed
