"use client";

import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/card";
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
import "datatables.net-dt/css/dataTables.dataTables.css"; // DataTables default CSS
import "datatables.net-buttons-dt/css/buttons.dataTables.css"; // Buttons CSS >change to tailwind
import "datatables.net-responsive-dt";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5';
import jszip from 'jszip';
import pdfmake from 'pdfmake';

// Activate the DataTables module
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

// TypeScript types for API response
interface ActivityByType {
    activityType: string;
    totalAmount: number;
    activities: string[];
}

interface ActivityListItem {
    activityId: number;
    activityType: string;
    description: string;
    amount: number;
    createdAt: string;
}

const Dashboard = () => {
    const [activitiesByType, setActivitiesByType] = useState<ActivityByType[]>([]);
    const [activitiesList, setActivitiesList] = useState<ActivityListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const chartData = activitiesByType.map((activity) => ({
        name: activity.activityType,
        revenue: activity.activityType === "Revenue" ? activity.totalAmount : 0,
        expense: activity.activityType === "Expense" ? activity.totalAmount : 0,
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/dashboard"); // API route
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();

                setActivitiesByType(result.activitiesByType);
                setActivitiesList(result.activitiesList);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    // Calculate net profit
    const calculateNetProfit = () => {
        let revenue = 0;
        let expense = 0;

        activitiesByType.forEach((activity) => {
            if (activity.activityType === "Revenue") {
                revenue += activity.totalAmount;
            } else if (activity.activityType === "Expense") {
                expense += activity.totalAmount;
            }
        });

        return revenue - expense;
    };

    const netProfit = calculateNetProfit();

    // DataTable columns definition
    const columns = [
        { title: "ID", data: "activityId" },
        { title: "Description", data: "description" },
        { title: "Type", data: "activityType" },
        { title: "Amount", data: "amount" },
        { title: "Date", data: "createdAt" },
    ];

    // Format data for the DataTable
    const data = activitiesList.map((activity) => ({
        ...activity,
        createdAt: new Date(activity.createdAt).toLocaleDateString(),
    }));

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {activitiesByType.map((activity) => (
                    <Card className="p-4 shadow-none" key={activity.activityType}>
                        <h2 className="text-lg font-semibold">{activity.activityType}</h2>
                        <p className="text-xl">MWK{activity.totalAmount}</p>
                    </Card>
                ))}
                {/* Display Net Profit */}
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Net Profit</h2>
                    <p className="text-xl text-green-600">MWK{netProfit}</p>
                </Card>
            </div>


            {/* Bar Chart Section */}
            <div className="mt-10 w-full">
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                height={300} width={300}
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 'dataMax']} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#33b76d" radius={4} />
                                <Bar dataKey="expense" fill="#ff4d4d" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Activities Overview using DataTable */}
            <Card className="w-full mt-5 shadow-none p-4">
                <DataTable
                    data={data}
                    columns={columns}
                    options={{
                        ordering: true,
                        responsive: true,
                        info: true,
                        layout: {
                            topStart: 'buttons',
                        },
                    }}
                    className="display"
                />
            </Card>
        </div>
    );
};

export default Dashboard;