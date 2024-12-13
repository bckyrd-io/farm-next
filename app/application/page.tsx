"use client";

import { Card } from "../../components/ui/card";
import { AtomIcon, CctvIcon, HotelIcon, SaladIcon, ShipIcon } from "lucide-react";


const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Apps</h1>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Card className="p-4 shadow-none">
                    <h2 className="text-lg font-semibold">Agriculture</h2>
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
                    <h2 className="text-lg font-semibold">Shipping</h2>
                    <p className="text-xl text-primary"><ShipIcon /></p>
                </Card>
            </div>

        </div>
    );
};

export default Dashboard;
