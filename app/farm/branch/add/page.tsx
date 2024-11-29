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

const branchSchema = z.object({
  name: z.string().min(1, { message: "Branch name is required." }),
  location: z.string().min(1, { message: "Branch location is required." }),
});

type BranchFormValues = z.infer<typeof branchSchema>;

const AddBranch = () => {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
  });

  const onSubmit = async (data: BranchFormValues) => {
    try {
      const response = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Branch created successfully!");
        form.reset(); // Reset the form
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to create branch:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="shadow-none w-1/3">
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

            <Button variant={"default"} type="submit">
              Add Branch
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddBranch;
