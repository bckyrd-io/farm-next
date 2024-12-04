"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

// Define the type for the branch data
interface Branch {
	id: number;
	name: string;
	location: string;
	userCount: number; // Add userCount to the interface
}

const Branch = () => {
	const router = useRouter();
	const [branches, setBranches] = useState<Branch[]>([]);

	// Fetch branch data on component mount
	useEffect(() => {
		const fetchBranches = async () => {
			try {
				const response = await fetch("/api/branches");
				const data = await response.json();

				if (response.ok) {
					setBranches(data.branches); // Set branch data with user count
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

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-6">Branches</h1>

			<Button
				className="mt-4"
				onClick={() => {
					router.push("branch/add"); // Navigate to branch creation page
				}}
			>
				Create Branch
			</Button>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
				{branches.length === 0 ? (
					<Card className="p-4 shadow-none">
						<h2 className="text-lg font-semibold">No branches available</h2>
					</Card>
				) : (
					branches.map((branch) => (
						<Card key={branch.id} className="p-4 shadow-none">
							<h2 className="text-lg font-semibold">{branch.name} </h2>
							<p className="text-xl text-gray-600">{branch.location} -
								{branch.userCount} users
							</p>
						</Card>
					))
				)}
			</div>
		</div>
	);
};

export default Branch;
