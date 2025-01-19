"use client";

import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PerformanceData {
    id: number;
    userId: number;
    username: string;
    activity: string;
    status: string;
    updatedAt: string;
}

const StaffPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const response = await fetch("/api/performance");
                if (!response.ok) {
                    throw new Error("Failed to fetch performance data.");
                }

                const result = await response.json();
                setPerformanceData(result.performance);
            } catch (err) {
                setError((err as Error).message || "An error occurred.");
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An error occurred while fetching performance data. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, [toast]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6">Performance Overview</h1>

            <Card className="w-full p-4 shadow-sm">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {performanceData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>{item.activity}</TableCell>
                                <TableCell>
                                    <Badge variant="default">{item.status}</Badge>
                                </TableCell>
                                <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/farm/staff/assign/${item.userId}`)}
                                        >
                                            Assign
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/farm/staff/performance/${item.userId}`)}
                                        >
                                            Track
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

export default StaffPage;
