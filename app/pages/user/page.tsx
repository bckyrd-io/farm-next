"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from '../../../components/ui/table';

// Sample data for the list of users
const usersData = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        profilePicture: "/profile-picture-1.jpg",
        role: "Admin",
        joinedDate: "2023-06-15",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        profilePicture: "/profile-picture-2.jpg",
        role: "User",
        joinedDate: "2024-01-10",
    },
    {
        id: 3,
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        profilePicture: "/profile-picture-3.jpg",
        role: "Moderator",
        joinedDate: "2023-08-22",
    },
];

const UserPage = () => {
    const [users, setUsers] = useState(usersData);

    const handleEdit = (userId: number) => {
        console.log(`Edit user with ID: ${userId}`);
        // Implement edit user logic here
    };

    const handleResetPassword = (userId: number) => {
        console.log(`Reset password for user with ID: ${userId}`);
        // Implement password reset logic here
    };

    const handleDelete = (userId: number) => {
        console.log(`Delete user with ID: ${userId}`);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* Add User Button */}
            <Link href="/user-add">
                <Button className="mb-6" variant="default">Add New User</Button>
            </Link>
            
            {/* Users List Table */}
            <Card className="w-full max-w-4xl p-4 shadow-md">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.profilePicture} alt={`${user.name} Profile Picture`} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(user.id)}>
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleResetPassword(user.id)}>
                                            Reset Password
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default UserPage;
