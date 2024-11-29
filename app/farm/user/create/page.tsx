"use client";

import { useEffect, useState } from 'react';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '../../../../components/ui/form';


// Define the schema using zod
const userSchema = z.object({
    username: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Invalid password"),
    branchId: z.number().min(1, "Branch is required"),
});


type UserFormValues = z.infer<typeof userSchema>;

const UserAddPage = () => {
    const [branches, setBranches] = useState<{ id: number, name: string, location: string }[]>([]);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();

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
            try {
                const response = await fetch('/api/branches');
                const data = await response.json();

                if (response.ok) {
                    setBranches(data.branches); // Set branch data
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Failed to fetch branches:", error);
                alert("An unexpected error occurred.");
            }
        };

        fetchBranches();
    }, []);

    // Handle the form submission
    const onSubmit = async (data: UserFormValues) => {
        console.log("Form Data Submitted:", data);

        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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


            // Redirect after successful user creation
            // router.push('/users');
        } catch (error: any) {
            console.error("Error creating user:", error);
            alert("Failed to create user. Please try again.");
        }
    };

    // Function to handle file upload
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
                                            onChange={(e) => field.onChange(Number(e.target.value))} // Ensure number type
                                        >
                                            <option value="" disabled>Select type</option>
                                            {branches.map((branch) => (
                                                <option key={branch.id} value={branch.id}> {branch.name} - {branch.location}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

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

                        {/* Drag-and-Drop Area */}
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

                        <Button type="submit" className="mt-4">
                            Add User
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default UserAddPage;
