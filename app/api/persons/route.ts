import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../src/db';
import { personsTable } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';

// GET: Fetch all persons
export async function GET() {
    const persons = await db.select().from(personsTable);
    return NextResponse.json(persons);
}

// POST: Create a new person
export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data.name || !data.hourlyRate) {
        return NextResponse.json({ error: 'Name and hourly rate are required' }, { status: 400 });
    }

    const newPerson = await db.insert(personsTable).values({
        name: data.name,
        hourlyRate: data.hourlyRate,
    }).returning();

    return NextResponse.json(newPerson);
}

// PUT: Update a person
export async function PUT(request: NextRequest) {
    const data = await request.json();

    if (!data.id || !data.name || !data.hourlyRate) {
        return NextResponse.json({ error: 'ID, name, and hourly rate are required' }, { status: 400 });
    }

    const updatedPerson = await db.update(personsTable)
        .set({ name: data.name, hourlyRate: data.hourlyRate })
        .where(eq(personsTable.id,data.id))
        .returning();

    return NextResponse.json(updatedPerson);
}


// DELETE: Delete a person
export async function DELETE(request: NextRequest) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(personsTable).where(eq(personsTable.id,id));
    return NextResponse.json({ message: 'Person deleted successfully' });
}
