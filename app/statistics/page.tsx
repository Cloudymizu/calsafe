/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AreaSelector } from "../(components)/area-selector";
import { DateSelector } from "../(components)/date-selector";
import { AccidentsByYear } from "../(components)/charts/AccidentsByYear";
import { SummaryItem } from "../(components)/summary-item";
import { nanoid } from "nanoid";

import locations from "../locations.json";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader, LoaderCircle } from "lucide-react";
import { format } from "date-fns";

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


// util
// Function to convert numeric day index to text
const getDayName = (dayIndex: number) => {
	// Create a date object with the specified day index
	const date = new Date(1970, 0, 4 + dayIndex); // Jan 4, 1970 is a Sunday
	return format(date, "EEEE"); // Full day name (e.g., "Sunday")
};



const StatisticsPage = () => {
	// State for selected date range
	const [startDate, setStartDate] = useState(new Date("2018-01-01"));
	const [endDate, setEndDate] = useState(new Date("2023-12-31"));
	const [yearRange, setYearRange] = useState<number[]>([]);

	// State for location (county & city)
	const [county, setCounty] = useState("");
	const [city, setCity] = useState("");
	const [countyByYearData, setCountyByYearData] = useState<YearlyData[]>([]);
	const [summaryData, setSummaryData] = useState<YearlyData[]>([]);

	// State for API response, loading, and errors
	const [statistics, setStatistics] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [loadingGraphs, setGraphsLoading] = useState(false);

	
	// Fetch statistics from the API
	const fetchStatistics = async () => {
		if (!county) {
			setError("Please select a county.");
			return;
		}

		setError("");
		setLoading(true);

		const queryUrl = `${API_BASE_URL}/api/statistics/?start_date=${startDate.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}&county=${county}${city ? `&city=${city}` : ""}`;

		console.log("Fetching statistics with URL:", queryUrl);

		try {
			const response = await fetch(queryUrl);

			if (!response.ok) {
				if (response.status === 404) {
					setError("No accident data found for the specified query.");
				} else {
					setError(`Error: ${response.statusText}`);
				}
				setStatistics(null);
				return;
			}

			const data = await response.json();
			setStatistics(data);
		} catch (err) {
			setError("An error occurred while fetching the data.");
			console.error("Fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	//fetch County graphs
	const countySubmit = async () => {
		setCountyByYearData([]);
		setError(""); // Reset error
		// Construct the base query URL
		let queryUrl = `${API_BASE_URL}/api/summaryByCounty/?county=${county}`;
		console.log("Query URL:", queryUrl);
		if (county === "") {
			queryUrl = `${API_BASE_URL}/api/summary/`;
		}
		setGraphsLoading(true);
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
			setGraphsLoading(false);
		}
	};

	//fetch summary data
	const fetchSummaryData = async () => {
		setLoading(true);
		try {
			const queryUrl = `${API_BASE_URL}/api/summary/`;
			const response = await fetch(queryUrl);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			const data: YearlyData[] = await response.json();
			setSummaryData(data);

			// Extract min and max year from the data
			const minYear = Math.min(...data.map((yearData) => yearData.year));
			const maxYear = Math.max(...data.map((yearData) => yearData.year));

			setYearRange([minYear, maxYear]);
		} catch (err) {
			setError("An error occurred while fetching the summary data.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	//fed to submit button
	const runAllQueries= async () =>{
		await fetchStatistics();
		await countySubmit();
		await fetchSummaryData();
	}

	return (
		<div className="p-6">
			<header className="mb-6 text-center">
				<h1 className="text-3xl font-semibold">CalSafe Statistics</h1>
				<p className="text-gray-500">Enter details below to get started</p>
			</header>

			{/* Date Range and Location */}
			<div className="mx-auto flex w-fit flex-col gap-2">
				<div className="flex flex-row gap-2">
					<DateSelector
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
					/>

					<AreaSelector
						locations={Object.values(locations.counties) as County[]}
						currentLocation={{ county, city }}
						setCurrentLocation={({ city, county }) => {
							setCity(city);
							setCounty(county);
						}}
					/>
				</div>
				<Button onClick={runAllQueries}>
				<Loader /> Fetch Statistics
				</Button>
			</div>
			<div>
				<div>
					<Separator className="my-4" />

					{/* Loading, Error, and Results */}
					<div className="mx-auto w-fit">
						{loading && (
							<div className="text-blue-500">
								<div className="flex flex-row items-center gap-2">
									<LoaderCircle className="animate-spin" />
									<h3 className="text-2xl">Loading statistics...</h3>
								</div>
							</div>
						)}
						{error && <p className="text-red-500">{error}</p>}

						{statistics && (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Total Crashes</h3>
									<p>{statistics.total_crashes}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Total Injuries</h3>
									<p>{statistics.total_injuries}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Total Fatalities</h3>
									<p>{statistics.total_fatalities}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Pedestrian Accidents</h3>
									<p>{statistics.pedestrian_accidents}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Bicycle Accidents</h3>
									<p>{statistics.bicycle_accidents}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Motorcycle Accidents</h3>
									<p>{statistics.motorcycle_accidents}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Truck Accidents</h3>
									<p>{statistics.truck_accidents}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Alcohol-Related Accidents</h3>
									<p>{statistics.alcohol_related}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Hit and Run Accidents</h3>
									<p>{statistics.hit_and_run}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Head On Accidents</h3>
									<p>{statistics.head_on}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Sideswipe Accidents</h3>
									<p>{statistics.sideswipe}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Rear End Accidents</h3>
									<p>{statistics.rear_end}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Object Hit Accidents</h3>
									<p>{statistics.hit_object}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Roll-over Accidents</h3>
									<p>{statistics.roll_over}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">City with Most Accidents</h3>
									<p>{statistics.most_accidents_city.city}</p>
									<p>
										Accident Count: {statistics.most_accidents_city.accident_count}
									</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">
										Intersection with Most Accidents
									</h3>
									<p>Primary Road: {statistics.most_common_road_pair.primary_rd}</p>
									<p>
										Secondary Road: {statistics.most_common_road_pair.secondary_rd}
									</p>
									<p>Accidents: {statistics.most_common_road_pair.count}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Road with Most Accidents</h3>
									<p>{statistics.most_common_primary_road.primary_rd}</p>
									<p>Accidents: {statistics.most_common_primary_road.count}</p>
								</div>
								<div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
									<h3 className="font-semibold">Most Common Day for Accidents</h3>
									<p>
										Day:{" "}
										{getDayName(Number.parseInt(statistics.most_common_day.day))}
									</p>
									<p>Count: {statistics.most_common_day.count}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<h1 className="mb-2 flex justify-center text-4xl font-bold m-5">Year to Date Graphs</h1>
			<p className="text-gray-500 flex justify-center">For the specified county</p>
			<div className="container mx-auto">
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
							!loading && <p className="flex justify-center">No statistics available for the specified query.</p>
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
							!loading && <p className="flex justify-center">No statistics available for the specified query.</p>
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
							!loading && <p className="flex justify-center">No statistics available for the specified query.</p>
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
							!loading && <p className="flex justify-center">No statistics available for the specified query.</p>
						)}
					</div>
				</div>
			</div>

			<h1 className="mb-2 flex justify-center text-4xl font-bold m-5">Southern California Statistics</h1>
			<p className="mb-2 text-gray-500 flex justify-center">From 2018-2013</p>
			<div className="container mx-auto">
				<div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{summaryData.map((yearData) => (
						<SummaryItem key={nanoid()} yearData={yearData} />
					))}
				</div>
			</div>
		</div>
	);
};

export default StatisticsPage;
