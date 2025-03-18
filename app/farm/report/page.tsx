"use client";

import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Download, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

// Update the interface to match API response fields.
interface ActivityListItem {
    activityId: number;
    activityType: string;
    description: string;
    amount: number;
    createdAt: string;
    resourcesUsed: string;
    assignedStaff: string;
    upcomingDates: string;
    involvedBranches: string;
}

const Report = () => {
    const [activitiesList, setActivitiesList] = useState<ActivityListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/dashboard"); // API returns the required fields
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setActivitiesList(result.activitiesList);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns: ColumnDef<ActivityListItem>[] = [
        {
            accessorKey: "activityId",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("activityId")}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("description")}</div>,
        },
        {
            accessorKey: "activityType",
            header: "Type",
            cell: ({ row }) => <div>{row.getValue("activityType")}</div>,
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <div>{row.getValue("amount")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Created Date",
            cell: ({ row }) => (
                <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
            ),
        },
        {
            accessorKey: "resourcesUsed",
            header: "Resources Used",
            cell: ({ row }) => <div>{row.getValue("resourcesUsed") || "N/A"}</div>,
        },
        {
            accessorKey: "assignedStaff",
            header: "Assigned Staff",
            cell: ({ row }) => <div>{row.getValue("assignedStaff") || "N/A"}</div>,
        },
        {
            accessorKey: "upcomingDates",
            header: "Upcoming Dates",
            cell: ({ row }) =>
                row.getValue("upcomingDates") ? (
                    <div>{new Date(row.getValue("upcomingDates")).toLocaleDateString()}</div>
                ) : (
                    <div>N/A</div>
                ),
        },
        {
            accessorKey: "involvedBranches",
            header: "Involved Branches",
            cell: ({ row }) => <div>{row.getValue("involvedBranches") || "N/A"}</div>,
        },
    ];

    const table = useReactTable({
        data: activitiesList,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Add title and date
        doc.text("Activity Report", 14, 16);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 23);

        // Map table rows to array format for PDF export
        const tableData = table.getFilteredRowModel().rows.map((row) => [
            String(row.getValue("activityId")),
            String(row.getValue("description")),
            String(row.getValue("activityType")),
            String(row.getValue("amount")),
            new Date(row.getValue("createdAt")).toLocaleDateString(),
            String(row.getValue("resourcesUsed") || "N/A"),
            String(row.getValue("assignedStaff") || "N/A"),
            row.getValue("upcomingDates")
                ? new Date(row.getValue("upcomingDates")).toLocaleDateString()
                : "N/A",
            String(row.getValue("involvedBranches") || "N/A"),
        ]);

        autoTable(doc, {
            head: [
                [
                    "ID",
                    "Description",
                    "Type",
                    "Amount",
                    "Created Date",
                    "Resources Used",
                    "Assigned Staff",
                    "Upcoming Dates",
                    "Involved Branches",
                ],
            ],
            body: tableData,
            startY: 30,
            headStyles: { fillColor: [146, 56, 46] },
        });

        doc.save(
            `Farm-Activity-Report-${new Date()
                .toLocaleDateString()
                .replace(/\//g, "-")}.pdf`
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Reports</h1>

            <Card className="w-full mt-5 shadow-none p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        <Search className="ml-2 h-4 w-4 text-gray-500" />
                    </div>
                    <Button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-600"
                    >
                        <Download className="h-4 w-4" /> Export PDF
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="font-medium">
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? "cursor-pointer select-none"
                                                            : ""
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{"asc": " 🔼", "desc": " 🔽"}[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-green-50">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex-1 text-sm text-gray-500">
                        Showing{" "}
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
                        to{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{" "}
                        of {table.getFilteredRowModel().rows.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="border-primary text-primary hover:bg-primary-50"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Report;
