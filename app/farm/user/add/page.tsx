"use client";

import { useState } from 'react';
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
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserAddPage = () => {
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            role: '',
        },
    });

    const onSubmit = (data: UserFormValues) => {
        console.log("User added:", { ...data, profilePicture });
        // Implement the add user logic here
        router.push('/users'); // Redirect back to User Management page after adding
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
                        <FormField
                            control={form.control}
                            name="name"
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
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Role (e.g., Admin, User)" {...field} />
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
