"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card } from "../../../components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../../../components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Sample data for the dashboard
const sampleData = {
    activities: [
        { id: 1, type: "Revenue", amount: 1500, date: "2024-10-18" },
        { id: 2, type: "Expense", amount: 300, date: "2024-10-15" },
        { id: 3, type: "Neutral", amount: 200, date: "2024-10-12" },
    ],
    metrics: {
        totalRevenue: 1500,
        totalExpenses: 300,
        netProfit: 1200,
    },
    notifications: [
        "New activity added.",
        "You have unscheduled tasks.",
        "Revenue has increased by 20% this month.",
    ],
};

// Bar chart data
const chartData = [
    { name: "Total Revenue", revenue: sampleData.metrics.totalRevenue },
    { name: "Total Expenses", expenses: sampleData.metrics.totalExpenses },
];

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-xl">${sampleData.metrics.totalRevenue}</p>
                </Card>
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Total Expenses</h2>
                    <p className="text-xl">${sampleData.metrics.totalExpenses}</p>
                </Card>
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Net Profit</h2>
                    <p className="text-xl">${sampleData.metrics.netProfit}</p>
                </Card>
            </div>

            {/* Bar Chart Section */}
            <div className="mt-10 w-full">
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
                    <div className="w-full ">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={chartData}
                            // margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#33b76d" radius={4} />
                                <Bar dataKey="expenses" fill="#dc2626" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Add User Button */}
            <Link href="/activity">
                <Button className="mt-10" variant="default">Create New</Button>
            </Link>

            {/* Activities Overview */}
            <Card className="w-full mt-5 shadow-none">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sampleData.activities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell>{activity.id}</TableCell>
                                <TableCell>{activity.type}</TableCell>
                                <TableCell>${activity.amount}</TableCell>
                                <TableCell>{activity.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Notifications Section */}
            <div className="flex flex-col mt-10 w-full">
                {sampleData.notifications.map((notification, index) => (
                    <div
                        key={index}
                        className="bg-green-100 text-green-800 p-2 rounded mb-2"
                        style={{ color: "hsl(146.4, 56.4%, 45.9%)" }}
                    >
                        {notification}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
