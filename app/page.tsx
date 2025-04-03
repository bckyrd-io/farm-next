"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, HelpCircleIcon, LogInIcon, ClipboardCopy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [copiedCommand, setCopiedCommand] = useState("");

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        router.push("/farm/");
    };

    const scrollToFeatures = () => {
        const element = document.getElementById("features");
        element?.scrollIntoView({ behavior: "smooth" });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCommand(text);
        setTimeout(() => setCopiedCommand(""), 2000);
    };

    // Command component for consistent styling and copy functionality
    const Command = ({ text }: { text: string }) => (
        <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
            <code className="p-2 text-primary font-mono">{text}</code>
            <button 
                onClick={() => copyToClipboard(text)}
                className="p-2 hover:bg-gray-200"
                title="Copy to clipboard"
            >
                <ClipboardCopy size={16} className={copiedCommand === text ? "text-green-500" : "text-gray-500"} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <section className="pt-20 mb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-8">
                                <img src="/logo.png" alt="EcoHarvest Logo" className="h-10" />
                                <span className="text-xl font-bold text-primary">EcoHarvest</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg max-w-2xl">
                            The Farm Management System helps farm admins manage users, schedule activities, track performance, and analyze financial data, while staff can log activities, view schedules, and request inventory.
                        </p>

                        <p className="flex space-x-4">
                            <Button onClick={handleLogin} variant={"default"}>
                                Get Started
                                <LogInIcon size={20} className="ml-2" />
                            </Button>
                            <Button onClick={scrollToFeatures} variant="outline">
                                Help
                                <HelpCircleIcon size={20} className="ml-2" />
                            </Button>
                        </p>
                    </motion.div>
                </div>
            </section>

            <section id="help" className="px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }} 
                        viewport={{ once: true }} 
                        className="mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">User Guide</h2>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            This guide provides an overview of system functionalities, installation steps, and user roles.
                        </p>
                    </motion.div>

                    <div className="space-y-16">
                        {/* Combined Features Section */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-semibold">1. System Features</h3>
                            
                            <div className="space-y-16">
                                {/* Admin Features */}
                                <div>
                                    <h4 className="text-xl font-medium mb-6">Admin Features</h4>
                                    <p className="text-gray-600 mb-8">
                                        Farm administrators have full access to manage the entire system, including users, activities, finances, and reporting.
                                    </p>
                                    
                                    <div className="space-y-12">
                                        {/* Admin Feature 1: User Management */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">User Management</h5>
                                            <p className="text-gray-600">
                                                Create, edit, and deactivate user accounts. Assign roles and permissions to staff members.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="User Management" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">User management interface with options to edit roles and permissions</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Admin Feature 2: Financial Tracking */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Financial Analytics</h5>
                                            <p className="text-gray-600">
                                                Record revenue and expenses. Generate profit reports and financial analyses with visual charts.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Financial Analytics" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Financial dashboard with charts showing farm profit trends and expense breakdowns</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Admin Feature 3: Schedule Creation */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Schedule Management</h5>
                                            <p className="text-gray-600">
                                                Create and assign work schedules to staff members. Set recurring activities and manage calendar events.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Schedule Management" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Schedule creation interface with calendar view and assignment options</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Admin Feature 4: Inventory Management */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Inventory Control</h5>
                                            <p className="text-gray-600">
                                                Approve inventory requests, track stock levels, and order new supplies. Manage equipment allocation.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Inventory Control" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Inventory dashboard showing stock levels, pending requests, and order history</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Admin Feature 5: Performance Tracking */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Staff Performance Dashboard</h5>
                                            <p className="text-gray-600">
                                                Monitor productivity metrics and generate performance reports for individual staff members.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Performance Dashboard" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Performance analytics showing productivity metrics across different staff members</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Admin Feature 6: Reporting */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Advanced Reporting</h5>
                                            <p className="text-gray-600">
                                                Generate comprehensive reports on farm operations, finances, and staff performance with export options.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Advanced Reporting" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Report generation interface with customizable parameters and export formats</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Admin Feature 7: System Settings */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">System Configuration</h5>
                                            <p className="text-gray-600">
                                                Manage system-wide settings, customize modules, and configure notification preferences.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="System Configuration" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">System settings panel with configuration options for different modules</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Staff Features */}
                                <div>
                                    <h4 className="text-xl font-medium mb-6">Staff Features</h4>
                                    <p className="text-gray-600 mb-8">
                                        Farm staff members have focused access to tools for daily activities, viewing schedules, and managing basic operational needs.
                                    </p>
                                    
                                    <div className="space-y-12">
                                        {/* Staff Feature 1: Activity Logging */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Activity Logging</h5>
                                            <p className="text-gray-600">
                                                Record daily activities with details on time spent, resources used, and outcomes achieved.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Activity Logging" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Activity logging form with fields for recording task details and outcomes</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Staff Feature 2: Schedule Viewing */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Schedule Viewer</h5>
                                            <p className="text-gray-600">
                                                Access personal work schedules and upcoming assignments through an intuitive calendar interface.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Schedule Viewer" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Staff calendar view showing assigned tasks and upcoming activities</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Staff Feature 3: Inventory Requests */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Resource Requests</h5>
                                            <p className="text-gray-600">
                                                Submit requests for required supplies, tools, and equipment with detailed justifications.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Resource Requests" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Inventory request form with options to specify quantities and priorities</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Staff Feature 4: Personal Dashboard */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Personal Dashboard</h5>
                                            <p className="text-gray-600">
                                                View personal performance metrics, activity history, and upcoming tasks in one centralized location.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Personal Dashboard" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Staff dashboard showing personal metrics and recent activities</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Staff Feature 5: Notifications */}
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-medium text-primary">Notification Center</h5>
                                            <p className="text-gray-600">
                                                Receive updates on schedule changes, request approvals, and system announcements in real-time.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img 
                                                    src="/api/placeholder/800/400" 
                                                    alt="Notification Center" 
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-3 bg-gray-50">
                                                    <p className="text-sm text-gray-500">Notification panel showing system alerts and messages for staff</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Installation Section */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-semibold">2. Installation</h3>
                            
                            <ol className="space-y-6">
                                <li className="space-y-2">
                                    <div className="font-medium">1. Install Node.js and MySQL Server</div>
                                    <p className="text-gray-600">Download and install the latest versions from their official websites.</p>
                                </li>
                                
                                <li className="space-y-2">
                                    <div className="font-medium">2. Install project dependencies</div>
                                    <p className="text-gray-600">Navigate to the project folder and run:</p>
                                    <div className="mt-2 max-w-md">
                                        <Command text="pnpm install" />
                                    </div>
                                </li>
                                
                                <li className="space-y-2">
                                    <div className="font-medium">3. Setup database</div>
                                    <p className="text-gray-600">Initialize your database with:</p>
                                    <div className="mt-2 max-w-md">
                                        <Command text="drizzle-kit migrate" />
                                    </div>
                                </li>
                                
                                <li className="space-y-2">
                                    <div className="font-medium">4. Start the application</div>
                                    <p className="text-gray-600">Run the development server:</p>
                                    <div className="mt-2 max-w-md">
                                        <Command text="pnpm dev" />
                                    </div>
                                </li>
                            </ol>
                        </div>

                        {/* Creating Users Section */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-semibold">3. Creating Users</h3>
                            
                            <p className="text-gray-600">Since the system starts without an admin, follow these steps:</p>
                            
                            <ol className="space-y-6">
                                <li className="space-y-2">
                                    <div className="font-medium">1. Create a branch</div>
                                    <p className="text-gray-600">Access the branch creation URL:</p>
                                    <div className="mt-2 max-w-md">
                                        <Command text="http://localhost:3000/farm/branch/add" />
                                    </div>
                                </li>
                                
                                <li className="space-y-2">
                                    <div className="font-medium">2. Add a new user</div>
                                    <p className="text-gray-600">Access the user creation URL:</p>
                                    <div className="mt-2 max-w-md">
                                        <Command text="http://localhost:3000/farm/user/add" />
                                    </div>
                                </li>
                                
                                <li className="space-y-2">
                                    <div className="font-medium">3. Update user role in database</div>
                                    <p className="text-gray-600">Use a database client to update the user role to admin:</p>
                                    <div className="mt-2 max-w-md">
                                        <Command text="UPDATE users SET role = 'admin' WHERE email = 'youremail@example.com';" />
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}