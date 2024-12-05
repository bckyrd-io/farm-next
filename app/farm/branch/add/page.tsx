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
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useToast } from "../../../../hooks/use-toast"; // Ensure the path is correct

// Define schema for validation
const branchSchema = z.object({
  name: z.string().min(1, { message: "Branch name is required." }),
  location: z.string().min(1, { message: "Branch location is required." }),
});

// Infer types from schema
type BranchFormValues = z.infer<typeof branchSchema>;

const AddBranch = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Hook for showing toasts

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "", // Default value for branch name
      location: "", // Default value for branch location
    },
  });

  const onSubmit = async (data: BranchFormValues) => {
    setLoading(true);

    try {
      const response = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          variant: "default",
          title: "Branch Created Successfully",
          description: `The branch "${data.name}" has been created successfully.`,
        });
        form.reset(); // Reset the form after successful submission
      } else {
        throw new Error(result.message || "Failed to create branch.");
      }
    } catch (error) {
      console.error("Failed to create branch:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="shadow-none w-full max-w-sm p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Branch Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter branch name"
                      {...field}
                      className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Branch Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter branch location"
                      {...field}
                      className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <Button variant={"default"} type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Add Branch"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddBranch;
