// app/summary/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { SummaryItem } from "../(components)/summary-item";
import { nanoid } from "nanoid";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface YearlyData {
	year: number;
	data: {
		total_crashes: number;
		total_injuries: number | null;
		total_fatalities: number | null;
		pedestrian_accidents: number;
		bicycle_accidents: number;
		motorcycle_accidents: number;
		truck_accidents: number;
		alcohol_related: number;
	};
}

const SummaryPage = () => {
	const [summaryData, setSummaryData] = useState<YearlyData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const queryUrl = `${API_BASE_URL}/api/summary/`;

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(queryUrl);
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const data: YearlyData[] = await response.json();
				setSummaryData(data);
			} catch (err) {
				setError("An error occurred while fetching the summary data.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [queryUrl]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;

	return (
		<div className="container mx-auto">
			<h1 className="mb-4 text-2xl font-bold">
				Yearly Statewide Accident Summary (2018 - 2023)
			</h1>
			<div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{summaryData.map((yearData) => (
					<SummaryItem key={nanoid()} yearData={yearData} />
				))}
			</div>
		</div>
	);
};

export default SummaryPage;
