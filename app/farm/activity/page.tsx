"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

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

type ActivityFormValues = z.infer<typeof activitySchema>;

const AddActivity = () => {
    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
    });

    const onSubmit = (data: ActivityFormValues) => {
        const parsedData = {
            ...data,
            amount: Number(data.amount), // Convert amount to a number
        };

        const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const isFutureDate = data.activityDate > currentDate;

        console.log("Parsed data:", parsedData);

        fetch("/api/activities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsedData),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    if (isFutureDate) {
                        alert(
                            `You have successfully scheduled a future activity: "${data.description}" for ${data.activityDate}.`
                        );
                    } else {
                        alert(
                            `You have successfully created a new activity: "${data.description}" on ${data.activityDate}.`
                        );
                    }
                    console.log("Activity created successfully!", result.activity);
                } else {
                    console.error("Error creating activity:", result.message);
                    alert("An error occurred while creating the activity. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Network or server error:", error);
                alert("Network error: Unable to reach the server. Please try again later.");
            });
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

                        <Button variant={"default"} type="submit">
                            Add Activity
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default AddActivity;
