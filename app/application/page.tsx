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
import { Card } from "../../components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../../components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AtomIcon, AxeIcon, BeerIcon, CarIcon, CctvIcon, CropIcon, HomeIcon, HotelIcon, KeyIcon, LockIcon, SaladIcon, ShipIcon } from "lucide-react";
import { GearIcon } from "@radix-ui/react-icons";


const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Apps</h1>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Farm</h2>
                    <p className="text-xl text-primary"><SaladIcon /></p>
                </Card>
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Real Estate</h2>
                    <p className="text-xl text-primary"><HotelIcon/></p>
                </Card>
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-xl text-primary"><CctvIcon/></p>
                </Card>
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Technical</h2>
                    <p className="text-xl text-primary"><AtomIcon/></p>
                </Card>
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Courier</h2>
                    <p className="text-xl text-primary"><ShipIcon /></p>
                </Card>
            </div>

        </div>
    );
};

export default Dashboard;
