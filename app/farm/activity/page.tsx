"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useToast } from "../../../hooks/use-toast"; // Ensure this path is correct

// Define schema for validation
const activitySchema = z.object({
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    activityType: z.enum(["Revenue", "Expense", "Neutral"], {
        errorMap: () => ({ message: "Select a valid activity type." }),
    }),
    amount: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
            message: "Amount must be a positive number.",
        }),
    activityDate: z.string().min(1, {
        message: "Activity date is required.",
    }),
});

// Infer types from schema
type ActivityFormValues = z.infer<typeof activitySchema>;

const AddActivity = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast(); // Hook for showing toasts

    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            description: "", // Default value for description
            activityType: "Neutral", // Default value for activity type
            amount: 0, // Default value for amount as a number
            activityDate: "", // Default value for activity date
        },
    });

    const onSubmit = async (data: ActivityFormValues) => {
        setLoading(true);
        const parsedData = {
            ...data,
            amount: Number(data.amount), // Convert amount to a number
        };

        const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const isFutureDate = data.activityDate > currentDate;

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            });
            const result = await response.json();

            if (response.ok && result.success) {
                toast({
                    variant: "default",
                    title: "Activity Created Successfully",
                    description: isFutureDate
                        ? `You have successfully scheduled a future activity: "${data.description}" for ${data.activityDate}.`
                        : `You have successfully created a new activity: "${data.description}" on ${data.activityDate}.`,
                });
                console.log("Activity created successfully!", result.activity);
            } else {
                throw new Error(result.message || "Failed to create activity.");
            }
        } catch (error) {
            console.error("Error creating activity:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while creating the activity. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Create An Activity</h1>
            <Card className="shadow-none w-1/3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Activity description"
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="activityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Type</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="" disabled>
                                                Select type
                                            </option>
                                            <option value="Revenue">Revenue</option>
                                            <option value="Expense">Expense</option>
                                            <option value="Neutral">Neutral</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="activityDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            value={field.value} // Ensure field.value is a string in YYYY-MM-DD format
                                            onChange={(e) => field.onChange(e.target.value)} // Handle the change
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <Button variant={"default"} type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Add Activity"}
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default AddActivity;
