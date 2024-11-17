// app/summary/page.tsx
"use client";

import React, { useState, useEffect } from 'react';

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
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Yearly Statewide Accident Summary (2018 - 2023)</h1>
            {summaryData.map((yearData) => (
                <div key={yearData.year} className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{yearData.year}</h2>
                    <ul>
                        <li>Total Crashes: {yearData.data.total_crashes}</li>
                        <li>Total Injuries: {yearData.data.total_injuries ?? "N/A"}</li>
                        <li>Total Fatalities: {yearData.data.total_fatalities ?? "N/A"}</li>
                        <li>Pedestrian Accidents: {yearData.data.pedestrian_accidents}</li>
                        <li>Bicycle Accidents: {yearData.data.bicycle_accidents}</li>
                        <li>Motorcycle Accidents: {yearData.data.motorcycle_accidents}</li>
                        <li>Truck Accidents: {yearData.data.truck_accidents}</li>
                        <li>Alcohol-Related Accidents: {yearData.data.alcohol_related}</li>
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SummaryPage;
