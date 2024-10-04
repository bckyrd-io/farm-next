import { NextRequest, NextResponse } from 'next/server';
import { db } from "../../../src/db"; // Adjust this to your Drizzle config location
import { usersTable } from '../../../src/db/schema'; // Adjust to where your schema is located

export async function POST(req: NextRequest) {
  try {
    const { name,age, email } = await req.json();

    const newUser = await db.insert(usersTable).values({
      name,
      age,
      email,
    }).returning();

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error inserting user' }, { status: 500 });
  }
}
