/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AreaSelector } from "../(components)/area-selector";
import { DateSelector } from "../(components)/date-selector";

import locations from "../locations.json";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const StatisticsPage = () => {
    // State for selected date range
    const [startDate, setStartDate] = useState(new Date("2018-01-01"));
    const [endDate, setEndDate] = useState(new Date("2023-12-31"));

    // State for location (county & city)
    const [county, setCounty] = useState("");
    const [city, setCity] = useState("");

    // State for API response, loading, and errors
    const [statistics, setStatistics] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    return (
        <div className="p-6">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-semibold">Calsafe Statistics</h1>
                <p className="text-gray-500">Enter details below to get started</p>
            </header>

			{/* Date Range and Location */}
			<div className="flex flex-wrap gap-4 mb-6">
				<div className="flex-1 min-w-[300px]">
					<DateSelector
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
					/>
				</div>
				<div className="flex-1 min-w-[300px]">
					<AreaSelector
						locations={Object.values(locations.counties) as County[]}
						currentLocation={{ county, city }}
						setCurrentLocation={({ city, county }) => {
							setCity(city);
							setCounty(county);
						}}
					/>
				</div>
			</div>

            <div className="flex justify-end">
                <button
                    onClick={fetchStatistics}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Fetch Statistics
                </button>
            </div>

            {/* Loading, Error, and Results */}
            <div className="mt-6">
                {loading && (
                    <div className="text-blue-500">
                        <h3>Loading statistics...</h3>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}

                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <p>Accident Count: {statistics.most_accidents_city.accident_count}</p>
                        </div>
                        <div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Intersection with Most Accidents</h3>
                            <p>Primary Road: {statistics.most_common_road_pair.primary_rd}</p>
                            <p>Secondary Road: {statistics.most_common_road_pair.secondary_rd}</p>
                            <p>Accidents: {statistics.most_common_road_pair.count}</p>
                        </div>
                        <div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Road with Most Accidents</h3>
                            <p>{statistics.most_common_primary_road.primary_rd}</p>
                            <p>Accidents: {statistics.most_common_primary_road.count}</p>
                        </div>
                        <div className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Most Common Day for Accidents</h3>
                            <p>Day: {statistics.most_common_day.day == "1" ? "Sunday"
                                        : statistics.most_common_day.day == "2" ? "Monday"
                                        : statistics.most_common_day.day == "3" ? "Tuesday"
                                        : statistics.most_common_day.day == "4" ? "Wednesday"
                                        : statistics.most_common_day.day == "5" ? "Thursday"
                                        : statistics.most_common_day.day == "6" ? "Friday"
                                        : statistics.most_common_day.day == "7" ? "Saturday"
                                        : "Unknown" }</p>
                            <p>Count: {statistics.most_common_day.count}</p>
                        </div>
                    </div>
					 )}
            </div>
        </div>
    );
};

export default StatisticsPage;
