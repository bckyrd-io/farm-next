"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import useUserStore from './store/zustand';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useToast } from "../hooks/use-toast"; // Ensure this is the correct path
import { Eye, EyeOff } from "lucide-react"; // Import icons for show/hide toggle

// Define schema for validation
const loginSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

// Infer types from schema
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const router = useRouter();
    const { toast } = useToast(); // Hook for showing toasts
    const setUser = useUserStore((state: any) => state.setUser); // Zustand setUser function

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);
        console.log("Login attempt:", data);

        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            console.log("API Response:", result);

            if (!response.ok) {
                setError(result.message || "Failed to login");
                toast({
                    variant: "default",
                    title: "Failed to login",
                    description: `${result.message}`,
                });
            } else {
                // Save the logged-in user to Zustand state
                setUser(result.user);
                console.log("User saved to Zustand store:", result.user);

                toast({
                    variant: "default",
                    title: `Welcome, ${result.user.username}!`,
                    description: "You have successfully logged in.",
                });

                // Redirect based on user role
                const redirectPath =
                    result.user.role === "admin" ? "/farm/dashboard" : "/farm/activity";
                router.push(redirectPath);
            }
        } catch (err) {
            console.error("Error logging in:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="shadow-none w-1/3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                {...field}
                                                className="border rounded-md p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                            <button
                                                type="button"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-600" />
                                                )}
                                            </button>

                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <Button
                            variant={"default"}
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "Loading ..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
