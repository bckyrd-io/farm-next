"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from '../../../components/ui/table';


// TypeScript types for API response
interface usersData {
    id: number;
    username: string;
    email: string;
    image: string;
    role: string;
    createdAt: string;
}


const UserPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<usersData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/users"); // API route
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();

                setUsers(result.users);

            } catch (err) {
                setError((err as Error).message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleEdit = (userId: number) => {
        console.log(`Edit user with ID: ${userId}`);
        // Implement edit user logic here
    };

    const handleDelete = (userId: number) => {
        console.log(`Delete user with ID: ${userId}`);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* Add User Button */}
            <Link href="user/add">
                <Button className="mb-6" variant="default">Add New User</Button>
            </Link>

            {/* Users List Table */}
            <Card className="w-full p-4 shadow-sm">
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
                                        <AvatarImage src={user.image} alt={`${user.username} Profile Picture`} />
                                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(user.id)}>
                                            Edit
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
