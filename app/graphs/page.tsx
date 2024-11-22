// app/summary/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { AccidentsByYear } from '../(components)/charts/AccidentsByYear';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface YearlyData {
    year: number;
    data: {
        total_crashes: number;
        total_injuries: number | null;
    };
}




const GraphsPage = () => {
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
            <h1 className="text-2xl font-bold mb-4">Yearly Statewide Accident Graph (2018 - 2023)</h1>
			
					<div className="w-1/2">
					<AccidentsByYear data={summaryData.map((yearData) =>{
						return{year:yearData.year, count:yearData.data.total_crashes}
					})}></AccidentsByYear>
					</div>
					
                </div>


    );
};

export default GraphsPage;
