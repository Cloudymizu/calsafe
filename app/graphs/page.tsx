// app/graphs/page.tsx
"use client";

import React, { useState } from "react";
import { AccidentsByYear } from "../(components)/charts/AccidentsByYear";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface YearlyData {
	year: number;
	data: {
		total_crashes: number;
		total_injuries: number | null;
		pedestrian_accidents: number;
		bicycle_accidents: number;
		motorcycle_accidents: number;
		truck_accidents: number;
		alcohol_related: number;
	};
}

const southernCaliforniaCounties = [
	"San Luis Obispo",
	"Kern",
	"San Bernardino",
	"Ventura",
	"Los Angeles",
	"Orange",
	"Riverside",
	"San Diego",
	"Imperial",
];

const GraphsPage = () => {
	//states for county and yearly data
	const [county, setCounty] = useState("");
	const [countyByYearData, setCountyByYearData] = useState<YearlyData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const countySubmit = async (e: React.FormEvent) => {
		setCountyByYearData([]);
		e.preventDefault();
		setError(""); // Reset error

		// Construct the base query URL
		let queryUrl = `${API_BASE_URL}/api/summaryByCounty/?county=${county}`;
		console.log("Query URL:", queryUrl);

		if (county === "") {
			queryUrl = `${API_BASE_URL}/api/summary/`;
		}
		setLoading(true);
		try {
			const response = await fetch(queryUrl);

			// Handle 404 errors
			if (response.status === 404) {
				setError("No accident data found for the specified query.");
				setCountyByYearData([]);
				return;
			}

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();
			setCountyByYearData(data);
		} catch (err) {
			setError("An error occurred while fetching the data.");
			console.error("Fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;

	return (
		<div className="container mx-auto">
			<div className="flex items-center font-mono">
				<form onSubmit={countySubmit} className="w-1/2">
					<label className="w-20">County:</label>
					<select
						className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						value={county}
						onChange={(e) => {
							setCounty(e.target.value);
						}}
					>
						<option value="">All</option>
						{southernCaliforniaCounties.map((countyName) => (
							<option key={countyName} value={countyName}>
								{countyName}
							</option>
						))}
					</select>
					<button
						className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						type="submit"
					>
						Submit
					</button>
				</form>
			</div>
			<br />
			<div className="columns-2">
				<div>
					<h1 className="mb-2 flex justify-center text-2xl font-bold">
						Accidents by Year
					</h1>
					{countyByYearData.length > 0 ? (
						<AccidentsByYear
							data={countyByYearData.map((data) => {
								return { year: data.year, total: data.data.total_crashes };
							})}
						></AccidentsByYear>
					) : (
						!loading && <p>No statistics available for the specified query.</p>
					)}
				</div>
				<div>
					<h1 className="mb-2 flex justify-center text-2xl font-bold">
						Motorcycle Accidents
					</h1>

					{countyByYearData.length > 0 ? (
						<AccidentsByYear
							data={countyByYearData.map((data) => {
								return {
									year: data.year,
									total: data.data.motorcycle_accidents,
								};
							})}
						></AccidentsByYear>
					) : (
						!loading && <p>No statistics available for the specified query.</p>
					)}
				</div>

				<div>
					<h1 className="mb-2 flex justify-center text-2xl font-bold">
						Traffic Injuries
					</h1>
					{countyByYearData.length > 0 ? (
						<AccidentsByYear
							data={countyByYearData.map((data) => {
								return { year: data.year, total: data.data.total_injuries };
							})}
						></AccidentsByYear>
					) : (
						!loading && <p>No statistics available for the specified query.</p>
					)}
				</div>
				<div>
					<h1 className="mb-2 flex justify-center text-2xl font-bold">
						Pedestrians Involved
					</h1>

					{countyByYearData.length > 0 ? (
						<AccidentsByYear
							data={countyByYearData.map((data) => {
								return {
									year: data.year,
									total: data.data.pedestrian_accidents,
								};
							})}
						></AccidentsByYear>
					) : (
						!loading && <p>No statistics available for the specified query.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default GraphsPage;
