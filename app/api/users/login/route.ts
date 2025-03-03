// import bcrypt from 'bcrypt';
import { db } from '../../../../drizzle/db';
import { usersTable } from '../../../../drizzle/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Parse the request body
    const { username, password } = await req.json();

    // Validate input fields
    if (!username || !password) {
        return NextResponse.json({ success: false, message: 'Missing username or password' }, { status: 400 });
    }

    try {
        // Fetch user by username from the database
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
        });

        // If user is not found, return an error
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Compare the provided password with the stored hashed password
        // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
       
        
        if (password == user.passwordHash) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...userWithoutPassword } = user;
            // Respond with success and user data (without the password hash)
            return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 });
        }
        else {
            // Respond with invalid credentials message
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        // Handle unexpected server errors
        console.error('Error during login:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
