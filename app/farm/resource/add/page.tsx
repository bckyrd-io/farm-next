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
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";

const activitySchema = z.object({
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    activityType: z.enum(["Revenue", "Expense", "Neutral"], {
        errorMap: () => ({ message: "Select a valid activity type." }),
    }),
    amount: z.number().min(0, {
        message: "Amount must be a positive number.",
    }),
    activityDate: z.string().min(1, {
        message: "Activity date is required.",
    }),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const AddInventory = () => {
    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
    });

    const onSubmit = (data: ActivityFormValues) => {
        console.log("Activity added:", data);
        // Handle the form submission (e.g., send data to an API)
    };

    return (
        <div className="flex justify-center items-center min-h-screen">

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
                                        <Input placeholder="Activity description" {...field} className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
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
                                        <select {...field} className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                                            <option value="" disabled>Select type</option>
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

                        <Button variant={"default"} type="submit" >
                            Add Activity
                        </Button>
                    </form>
                </Form>
            </Card>


        </div>
    );
};

export default AddInventory;
