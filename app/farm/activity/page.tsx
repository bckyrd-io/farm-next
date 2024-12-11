"use client";

import { useState, useEffect } from "react";
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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface Notification {
    notificationMessage: string;
}

const AddActivity = () => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDialog, setShowDialog] = useState(false);

    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            description: "",
            activityType: "Neutral",
            amount: 0,
            activityDate: "",
        },
    });

    // Fetch notifications on component mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/dashboard");
                if (!response.ok) {
                    throw new Error("Failed to fetch notifications");
                }
                const result = await response.json();
                setNotifications(result.notifications || []);
                setShowDialog(result.notifications.length > 0);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const onSubmit = async (data: ActivityFormValues) => {
        setLoading(true);
        const parsedData = {
            ...data,
            amount: Number(data.amount),
        };

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            });
            const result = await response.json();

            if (response.ok && result.success) {
                console.log("Activity created successfully!", result.activity);
            } else {
                throw new Error(result.message || "Failed to create activity.");
            }
        } catch (error) {
            console.error("Error creating activity:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Create An Activity</h1>
            <Card className="shadow-none w-full max-w-sm p-4">
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
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
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

            {showDialog && (
                <AlertDialog open={showDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Notification</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <ol className="space-y-2">
                                {notifications.map((notification, index) => (
                                    <li key={index}> ➼ {notification.notificationMessage}</li>
                                ))}
                            </ol>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleDialogClose}>CLOSE</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

        </div>
    );
};

export default AddActivity;
