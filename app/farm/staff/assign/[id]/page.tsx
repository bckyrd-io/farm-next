"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation"; // Use next/navigation to get dynamic route parameters (App Router)
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card";
import { useToast } from "../../../../../hooks/use-toast";

// Define schema to validate the form data
const performanceSchema = z.object({
    activityId: z.number().min(1, "Activity is required"),
    status: z.string().min(1, "Status is required"),
});

type PerformanceFormValues = z.infer<typeof performanceSchema>;

const PerformancePage = () => {
    const { id } = useParams(); // Get the dynamic id from the URL (App Router)
    const [activities, setActivities] = useState<{ id: number; description: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Set the form using react-hook-form and validate with zod
    const form = useForm<PerformanceFormValues>({
        resolver: zodResolver(performanceSchema),
        defaultValues: {
            activityId: 0,
            status: "Assigned", // Default status
        },
    });

    // Fetch available activities for the select dropdown
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/activities");
                const data = await response.json();

                if (response.ok) {
                    setActivities(data.activities);
                } else {
                    throw new Error("Failed to fetch activities.");
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch activities.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [toast]);

    const onSubmit = async (data: PerformanceFormValues) => {
        setLoading(true);

        try {
            // Ensure the id is available before making the request
            if (!id) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "User ID is missing.",
                });
                return;
            }

            // Get the current date for the 'updatedAt' field
            const updatedAt = new Date().toISOString();

            // Make an API call to record the performance
            const response = await fetch("/api/performance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: id, // Use the userId from the URL
                    activityId: data.activityId,
                    status: data.status,
                    updatedAt, // Automatically set the updated date
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    variant: "default",
                    title: "Performance Recorded",
                    description: `Performance for user ID ${id} has been recorded successfully.`,
                });
                form.reset();
            } else {
                throw new Error(result.message || "Failed to record performance.");
            }
        } catch (error) {
            console.error("Error recording performance:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Ensure the page is not rendered before the ID is available
    if (!id) {
        return <div>Loading...</div>; // You can customize this loading state
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6">Record Performance</h1>

            <Card className="shadow-none w-full max-w-sm p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        {/* Activity Selection */}
                        <FormField
                            control={form.control}
                            name="activityId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Activity</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            disabled={loading}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        >
                                            <option value="" disabled>
                                                Select activity
                                            </option>
                                            {activities.map((activity) => (
                                                <option key={activity.id} value={activity.id}>
                                                    {activity.description}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Selection (Dropdown) */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Status</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            disabled={loading}
                                        >
                                            <option value="Assigned">Assigned</option>
                                            <option value="Completed">Completed</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button type="submit" className="mt-4" disabled={loading}>
                            {loading ? "Submitting..." : "Record Performance"}
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default PerformancePage;
