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
import { Popover, PopoverTrigger, PopoverContent } from "../../../components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../../../components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Validation schema
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

interface Activity {
    id: number;
    description: string;
}

const AddActivity = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [farmActivities, setFarmActivities] = useState<string[]>([]);

    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            description: "",
            activityType: "Neutral",
            amount: 0,
            activityDate: "",
        },
    });

    // Fetch farm activities from API
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch("/api/activities");
                if (!response.ok) throw new Error("Failed to fetch activities");

                const result = await response.json();
                if (result.success && Array.isArray(result.activities)) {
                    const descriptions = result.activities.map((act: Activity) => act.description);
                    setFarmActivities(descriptions);
                }
            } catch (error) {
                console.error("Error fetching farm activities:", error);
            }
        };

        fetchActivities();
    }, []);

    const onSubmit = async (data: ActivityFormValues) => {
        setLoading(true);
        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                toast({
                    variant: "default",
                    title: "New Activity",
                    description: "The activity has been created successfully.",
                });
                setTimeout(() => router.push("/farm/dashboard"), 2000);
            } else {
                throw new Error(result.message || "Failed to create activity.");
            }
        } catch (error) {
            console.error("Error creating activity:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create activity. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Create A Farm Activity</h1>
            <Card className="shadow-none w-full max-w-sm p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                        {/* Description Field with Combobox */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="border rounded-md p-2 w-full text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                >
                                                    {field.value || "Select or type a description"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 " />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-none">

                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search farm activities..."
                                                        onValueChange={field.onChange}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No results found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {farmActivities.map((activity, index) => (
                                                                <CommandItem
                                                                    key={index}
                                                                    value={activity}
                                                                    onSelect={() =>
                                                                        field.onChange(activity)
                                                                    }
                                                                >
                                                                    <Check
                                                                        className={` h-4 ${field.value === activity
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                            }`}
                                                                    />
                                                                    {activity}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Activity Type */}
                        <FormField
                            control={form.control}
                            name="activityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border rounded-md p-2 w-full">
                                            <option value="Revenue">Revenue</option>
                                            <option value="Expense">Expense</option>
                                            <option value="Neutral">Neutral</option>
                                        </select>
                                    </FormControl>


                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Amount */}
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

                        {/* Activity Date */}
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

                        <Button variant="default" type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Add Activity"}
                        </Button>
                    </form>
                </Form>
            </Card>

            {/* {showDialog && (
                <AlertDialog open={showDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Notification</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="text-sm text-muted-foreground">
                            <ol className="space-y-2">
                                {notifications.map((notification, index) => (
                                    <li key={index}> ➞ {notification.notificationMessage}</li>
                                ))}
                            </ol>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleDialogClose}>CLOSE</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )} */}
        </div>
    );
};

export default AddActivity;
