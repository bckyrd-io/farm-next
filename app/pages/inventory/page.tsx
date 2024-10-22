"use client";

import { useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	ColumnDef,
	flexRender,
} from '@tanstack/react-table';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from '../../../components/ui/table';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "../../../components/ui/chart";

// Sample data for the dashboard
const sampleData = {
	activities: [
		{ id: 1, type: 'Revenue', amount: 1500, date: '2024-10-18' },
		{ id: 2, type: 'Expense', amount: 300, date: '2024-10-15' },
		{ id: 3, type: 'Neutral', amount: 200, date: '2024-10-12' },
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

const chartConfig = {
	revenue: {
		label: "Revenue",
		color: "#2563eb",
	},
	expenses: {
		label: "Expenses",
		color: "#dc2626",
	},
} satisfies ChartConfig;

const Inventory = () => {
	const [filter, setFilter] = useState('All');

	// Define columns for TanStack Table
	const columns: ColumnDef<typeof sampleData.activities[0]>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'type',
			header: 'Type',
		},
		{
			accessorKey: 'amount',
			header: 'Amount',
			cell: info => `$${info.getValue()}`,
		},
		{
			accessorKey: 'date',
			header: 'Date',
		},
	];

	// Filter activities based on selected filter
	const filteredActivities = sampleData.activities.filter(activity =>
		filter === 'All' || activity.type === filter
	);

	// Create the table instance
	const table = useReactTable({
		data: filteredActivities,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col items-center justify-center min-h-screen  p-4">
			<h1 className="text-2xl font-bold mb-6">Inventory</h1>


			<Card className="w-full mt-5">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							{table.getFlatHeaders().map(header => (
								<TableHead key={header.id}>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			<Button className="mt-4" onClick={() => console.log('Add Activity')}>
				Add
			</Button>
		</div>
	);
};

export default Inventory;
