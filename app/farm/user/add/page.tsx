"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { useToast } from '../../../../hooks/use-toast'; // Make sure this hook exists

// Schema for form validation using Zod
const userSchema = z.object({
    username: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
    branchId: z.number().min(1, "Branch is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserAddPage = () => {
    const [branches, setBranches] = useState<{ id: number, name: string, location: string }[]>([]);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            branchId: 0,
        },
    });

    // Fetch branches for the select dropdown
    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/branches');
                const data = await response.json();

                if (response.ok) {
                    setBranches(data.branches);
                } else {
                    throw new Error(data.message || "Failed to fetch branches.");
                }
            } catch (error) {
                console.error("Failed to fetch branches:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An error occurred while fetching branches. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, [toast]);

    // Handle form submission
    const onSubmit = async (data: UserFormValues) => {
        setLoading(true);

        try {
            const response = await fetch('/api/users', {
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
                    title: "User Created",
                    description: `User "${data.username}" has been successfully added.`,
                });
                form.reset();
            } else {
                throw new Error(result.message || "Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1,
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">Add New User</h1>

            <Card className="w-full max-w-md p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        {/* Branch Select */}
                        <FormField
                            control={form.control}
                            name="branchId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Select</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            disabled={loading}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        >
                                            <option value="" disabled>Select branch</option>
                                            {branches.map((branch) => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.name} - {branch.location}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Full Name */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Drag-and-Drop Area for Profile Picture */}
                        <div
                            {...getRootProps()}
                            className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center cursor-pointer"
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <img src={preview} alt="Profile Preview" className="mx-auto mb-4 w-24 h-24 rounded-full object-cover" />
                            ) : (
                                <p>Drag & drop a photo here, or click to select a file</p>
                            )}
                        </div>

                        <Button type="submit" className="mt-4" disabled={loading}>
                            {loading ? "Submitting..." : "Add User"}
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default UserAddPage;
