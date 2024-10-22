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
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";



const loginSchema = z.object({
	username: z.string().min(1, {
		message: "Username is required.",
	}),
	password: z.string().min(1, {
		message: "Password is required.",
	}),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const [step, setStep] = useState(1);
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onNext = () => {
		setStep(2);
	};

	const onSubmit = (data: LoginFormValues) => {
		console.log("Login submitted:", data);
		// Handle the login logic (e.g., send data to an API)
	};

	return (
		<div className="flex justify-center items-center min-h-screen ">
			<Card className="shadow-none w-1/3">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
						{step === 1 && (
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
						)}

						{step === 2 && (
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your password"
												{...field}
												className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
											/>
										</FormControl>
										<FormMessage className="text-red-500 mt-1" />
									</FormItem>
								)}
							/>
						)}

						{step === 1 && (
							<Button variant={"default"} type="button" onClick={onNext} className="w-full">
								Next
							</Button>
						)}

						{step === 2 && (
							<>
								<Button variant={"secondary"} type="button" onClick={() => setStep(1)} className="w-full ">
									Back
								</Button>
								<Button variant={"default"} type="submit" className="w-full">
									Login
								</Button>
							</>
						)}
					</form>
				</Form>
			</Card>

		</div>
	);
};

export default LoginPage;
