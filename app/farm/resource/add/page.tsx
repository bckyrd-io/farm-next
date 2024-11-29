"use client";

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
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useState, useEffect } from "react";

const resourceSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    quantity: z.preprocess((val) => parseFloat(val as string), z.number().min(0, { message: "Quantity must be a positive number." })),
    unit: z.string().optional(), // Unit is optional for Human resources
    resourceType: z.enum(["Human", "Inventory"], {
        errorMap: () => ({ message: "Select a valid resource type." }),
    }),
    activityId: z.string().optional(), // Activities are optional
    allocatedQuantity: z
        .preprocess((val) => (val !== "" ? parseFloat(val as string) : undefined), z.number().optional()),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const AddResourcePage: React.FC = () => {

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
    });

    const [activities, setActivities] = useState<{ id: string; description: string }[]>([]);

    useEffect(() => {
        // Fetch the activities list from the API
        fetch("/api/activities")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.activities)) {
                    setActivities(data.activities);
                }
            })
            .catch((err) => console.error("Error fetching activities:", err));
    }, []);

    const onSubmit = (data: ResourceFormValues) => {
        console.log("submited");
        fetch("/api/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log("Resource successfully added:", result);
                alert("Resource added successfully!");
            })
            .catch((error) => console.error("Error adding resource:", error));
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Add a New Resource</h1>
            <Card className="shadow-none w-1/3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Resource name"
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Resource Type Field */}
                        <FormField
                            control={form.control}
                            name="resourceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resource Type</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="" disabled>
                                                Select type
                                            </option>
                                            <option value="Human">Human</option>
                                            <option value="Inventory">Inventory</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Quantity Field */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Conditional Unit Field for Inventory */}
                        {form.watch("resourceType") === "Inventory" && (
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., kg, liters"
                                                {...field}
                                                className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Activity and Allocated Quantity for Inventory */}
                        {form.watch("resourceType") === "Inventory" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="activityId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Associated Activity</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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

                                <FormField
                                    control={form.control}
                                    name="allocatedQuantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Allocated Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Submit Button */}
                        <Button type="submit">Add Resource</Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default AddResourcePage;
