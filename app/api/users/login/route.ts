// /api/users/login.ts

import bcrypt from 'bcrypt';
import { db } from '../../../../drizzle/db';
import { usersTable } from '../../../../drizzle/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    try {
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
        });

        if (user && await bcrypt.compare(password, user.passwordHash)) {
            return NextResponse.json({ success: true, user });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
