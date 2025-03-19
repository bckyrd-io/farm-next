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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Command } from '@/components/ui/command';

// Define resource interface
interface Resource {
    id: string;
    name: string;
}

interface Activity {
    id: string;
    description: string;
}

// Schema for form validation using Zod
const resourceSchema = z.object({
    inventory: z.string().min(1, { message: "Inventory name is required." }),
    quantity: z.preprocess((val) => parseFloat(val as string), z.number().min(0, { message: "Quantity must be a positive number." })).optional(),
    unit: z.string().optional(), // Unit is optional for Human resources
    resourceType: z.enum(["Human", "Inventory"], {
        errorMap: () => ({ message: "Select a valid resource type." }),
    }),
    activityId: z.string().optional(), // Activities are optional
    allocatedQuantity: z.preprocess((val) => parseFloat(val as string), z.number().min(0)).optional(),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const AddResourcePage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const { toast } = useToast(); // Custom hook for toast notifications
    const [loading, setLoading] = useState(false); // State for loading status
    const [farmResources, setFarmResources] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [popoverOpen, setPopoverOpen] = useState(false);

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            inventory: '',
            quantity: 0,
            unit: '',
            resourceType: "Human", // Default set to "Human"
            activityId: '',
            allocatedQuantity: 0,
        },
    });

    // Fetch resources and activities for the dropdowns
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch("/api/resources");
                if (!response.ok) throw new Error("Failed to fetch resources");

                const result = await response.json();
                if (result.success && Array.isArray(result.resources)) {
                    const names = result.resources.map((res: Resource) => res.name);
                    setFarmResources(names);
                }
            } catch (error) {
                console.error("Error fetching farm resources:", error);
            }
        };

        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/activities');
                const data = await response.json();
                if (data.success && Array.isArray(data.activities)) {
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

        fetchResources();
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
                body: JSON.stringify({
                    name: data.inventory, // Send inventory as name to the API
                    quantity: data.quantity,
                    unit: data.unit,
                    activityId: data.activityId,
                    allocatedQuantity: data.allocatedQuantity
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    variant: "default",
                    title: "Resource Added",
                    description: `Resource "${data.inventory}" has been successfully added.`,
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

    // Handle input change in the command input
    const handleCommandInputChange = (value: string) => {
        setSearchValue(value);
        form.setValue("inventory", value);
    };

    // Handle selection from command list
    const handleCommandSelect = (value: string) => {
        form.setValue("inventory", value);
        setPopoverOpen(false);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">New Resource</h1>

            <Card className="shadow-none w-full max-w-sm p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Inventory Field with Combobox */}
                        <FormField
                            control={form.control}
                            name="inventory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventory Name</FormLabel>
                                    <FormControl>
                                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="border rounded-md p-2 w-full text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                >
                                                    {field.value || "Select or type inventory name"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-none">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search or add new inventory..."
                                                        value={searchValue}
                                                        onValueChange={handleCommandInputChange}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No matching inventory found. 
                                                            Press Enter to add "{searchValue}" as new inventory.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {farmResources
                                                                .filter(name => name.toLowerCase().includes(searchValue.toLowerCase()))
                                                                .map((resource, index) => (
                                                                    <CommandItem
                                                                        key={index}
                                                                        value={resource}
                                                                        onSelect={handleCommandSelect}
                                                                    >
                                                                        <Check
                                                                            className={`h-4 mr-2 ${field.value === resource
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        {resource}
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

                        {/* Resource Type Field */}
                        <FormField
                            control={form.control}
                            name="resourceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resource Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border rounded-md p-2 w-full">
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
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Unit Field */}
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

                        {/* Associated Activity Field */}
                        <FormField
                            control={form.control}
                            name="activityId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Associated Activity</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border rounded-md p-2 w-full">
                                            <option value="">None</option>
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

                        {/* Allocated Quantity Field - only shown if activity is selected */}
                        {form.watch("activityId") && (
                            <FormField
                                control={form.control}
                                name="allocatedQuantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Allocated Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Submit Button with Loading State */}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Submitting..." : "Submit"}
                        </Button>

                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default AddResourcePage;