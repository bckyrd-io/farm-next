"use client";

import { useState, useEffect } from "react";
import { Card } from "../../../../../components/ui/card";
import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useParams } from "next/navigation";
import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

interface PerformanceActivity {
    id: number;
    activity: string;
    status: string;
    updatedAt: string;
}

const ChartPage = () => {
    const { userId } = useParams(); // Dynamic route param for user ID
    const [performanceData, setPerformanceData] = useState<PerformanceActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Format data for the pie chart
    const pieChartData = performanceData.map((item) => ({
        name: item.activity,
        status: item.status,
        value: 1,
    }));

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c"];

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                // Make the API call using the dynamic userId
                const response = await fetch(`http://localhost:3000/api/performance?userId=${userId}`);
                const data = await response.json();

                if (data.success) {
                    setPerformanceData(data.performance);
                } else {
                    setError("Failed to load performance data");
                }
            } catch (err) {
                setError((err as Error).message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6">Staff Performance</h1>

            {/* Pie Chart Section */}
            <Card className="flex flex-col shadow-none pb-10">
                <PieChart width={600} height={400}>
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="activity" // Pie chart will display the activity names
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name }) => `${name}`} // Display activity name in the pie chart
                    >
                        {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    {/* Corrected Tooltip */}
                    <Tooltip />
                    <Legend
                        formatter={(value) => value} // Show the status in the legend
                        payload={pieChartData.map((item) => ({
                            value: item.status, // Now legend displays status
                            type: "square",
                            id: item.status,
                            color: COLORS[pieChartData.indexOf(item) % COLORS.length],
                        }))}
                    />
                </PieChart>
            </Card>
        </div>
    );
};

export default ChartPage;
