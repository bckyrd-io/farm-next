"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from '../../../components/ui/table';

// TypeScript types for API response
interface Resource {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    resourceType: string;
}

const ResourcesPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [resources, setResources] = useState<Resource[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/resources"); // API route
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setResources(result.resources);
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Resource Management</h1>

            {/* Add Resource Button */}
            <Link href="resource/add">
                <Button className="mb-6" variant="default">Add New Resource</Button>
            </Link>

            {/* Resources List Table */}
            <Card className="w-full p-4 shadow-sm">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resources.map(resource => (
                            <TableRow key={resource.id}>
                                <TableCell>{resource.id}</TableCell>
                                <TableCell>{resource.name}</TableCell>
                                <TableCell>{resource.resourceType}</TableCell>
                                <TableCell>{resource.quantity}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{resource.unit}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default ResourcesPage;
