"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useToast } from "../../../../hooks/use-toast"; // Custom hook for toast notifications

// Schema for form validation using Zod
const resourceSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    quantity: z.preprocess((val) => parseFloat(val as string), z.number().min(0, { message: "Quantity must be a positive number." })).optional(),
    unit: z.string().optional(), // Unit is optional for Human resources
    resourceType: z.enum(["Human", "Inventory"], {
        errorMap: () => ({ message: "Select a valid resource type." }),
    }),
    activityId: z.string().optional(), // Activities are optional
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const AddResourcePage: React.FC = () => {
    const [activities, setActivities] = useState<{ id: string; description: string }[]>([]);
    const { toast } = useToast(); // Custom hook for toast notifications
    const [loading, setLoading] = useState(false); // State for loading status

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            name: '',
            quantity: 0,
            unit: '',
            resourceType: "Human", // Default set to "Human"
            activityId: '',
        },
    });

    // Fetch activities for the select dropdown
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/activities');
                const data = await response.json();
                if (Array.isArray(data.activities)) {
                    setActivities(data.activities);
                } else {
                    throw new Error("Failed to load activities.");
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An error occurred while fetching activities. Please try again later.",
                });
            }
        };
        fetchActivities();
    }, [toast]);

    // Handle form submission
    const onSubmit = async (data: ResourceFormValues) => {
        setLoading(true); // Set loading to true when submission starts
        try {
            const response = await fetch('/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    variant: "default",
                    title: "Resource Added",
                    description: `Resource "${data.name}" has been successfully added.`,
                });
                form.reset();
            } else {
                throw new Error(result.message || "Failed to add resource.");
            }
        } catch (error) {
            console.error("Error adding resource:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
            });
        } finally {
            setLoading(false); // Reset loading state after submission
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">New Request</h1>

            <Card className="shadow-none w-full max-w-sm p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="inventory name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., kg, liters" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="activityId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Associated Activity</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border rounded-md p-2 w-full">
                                            <option value="" disabled>Select activity</option>
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

                        {/* Submit Button with Loading State */}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Submitting..." : "submit"}
                        </Button>
                        
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default AddResourcePage;
