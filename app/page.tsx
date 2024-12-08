/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AreaSelector } from "./(components)/area-selector";
import { FilterCol } from "./(components)/filter-col";
import { DateSelector } from "./(components)/date-selector";
import { ConditionsSelector } from "./(components)/conditions-selector";
import { InfoCard } from "./(components)/info-card";
import { useState } from "react";

import locations from "./locations.json";
import centroidData from "./centroidData.json";
import dynamic from "next/dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Page() {
	const [city, setCity] = useState("");
	const [county, setCounty] = useState("");
	const [start_date, setStartDate] = useState(new Date("2018-01-01"));
	const [end_date, setEndDate] = useState(new Date("2023-12-31"));

	const [accidents, setAccidents] = useState<Accident[] | undefined>();
	const [predictions, setPredictions] = useState<Predictions[] | undefined>();
	const [filters, setFilters] = useState({
		alcohol: false,
		motorcycle: false,
		hitAndRun: false,
		fatal: false,
		bicycleAccident: false,
		pedestrianAccident: false,
		truckAccident: false,
		stateHighway: false,
		usePredictions: false
	});

	const [conditions, setConditions] = useState({
		weather: "",
		lighting: "",
		collisionType: "",
		roadSurface: "",
		roadCondition: "",
	});
	const getSearchParams = () => {
		setPredictions(undefined)
		const params = new URLSearchParams();
		params.append("city", city);
		params.append("county", county);
		params.append("start_date", start_date.toISOString().slice(0, 10));
		params.append("end_date", end_date.toISOString().slice(0, 10));

		if (filters.fatal) {
			params.append("collision_severity", "1");
		}
		if (filters.hitAndRun) {
			params.append("hit_and_run", "M,F");
		}
		if (filters.alcohol) {
			params.append("alcohol_involved", "Y");
		}
		if (filters.motorcycle) {
			params.append("motorcycle_accident", "Y");
		}
		if (filters.bicycleAccident) {
			params.append("bicycle_accident", "Y");
		}
		if (filters.pedestrianAccident) {
			params.append("pedestrian_accident", "Y");
		}
		if (filters.truckAccident) {
			params.append("truck_accident", "Y");
		}
		if (filters.stateHighway) {
			params.append("state_hwy_ind", "Y");
		}
		if(filters.usePredictions && county != ""){
			predictCounty(county)
		}

		if (conditions.weather && conditions.weather !== "all") {
			params.append("weather_1", conditions.weather);
		}
		if (conditions.collisionType && conditions.collisionType !== "all") {
			params.append("type_of_collision", conditions.collisionType);
		}
		if (conditions.lighting && conditions.lighting !== "all") {
			params.append("lighting", conditions.lighting);
		}
		if (conditions.roadSurface && conditions.roadSurface !== "all") {
			params.append("road_surface", conditions.roadSurface);
		}

		return params.toString();
	};

	const predictCounty = (county: any) =>{
		let kind: keyof typeof centroidData = county
			//Precision hard coded to 4
			setPredictions(centroidData[kind].Precision[4])
	}



	const clearFilters = () => {
		setFilters({
			alcohol: false,
			motorcycle: false,
			hitAndRun: false,
			fatal: false,
			bicycleAccident: false,
			pedestrianAccident: false,
			truckAccident: false,
			stateHighway: false,
			usePredictions: false
		});
	};

	const fetchAccidents = async () => {
		const params = getSearchParams();
		const url = `${API_BASE_URL}/api/accidents/?${params}`;
	
		console.log("Fetching accidents with URL:", url); // Debugging log
	
		try {
			const res = await fetch(url);
	
			if (!res.ok) {
				console.error("Failed to fetch accidents:", res.statusText);
				return;
			}
	
			const data = await res.json();
	
			if (!Array.isArray(data)) {
				console.error("Unexpected response format:", data);
				return;
			}
	
			console.log("Fetched accidents:", data.length, "records"); // Debugging log
			setAccidents(data);
		} catch (error) {
			console.error("Error fetching accidents:", error);
		}
	};

	const setCurrentLocation = (location: CountyAndCity) => {
		setCity(location.city);
		setCounty(location.county);
	};

	return (
		<>
			<div className="flex gap-2 px-2">
				<aside className="sticky top-10 size-fit">
					<FilterCol
						filters={filters}
						setFilters={setFilters}
						clearFilters={clearFilters}
						updateFilters={fetchAccidents}
					/>
					<InfoCard
						num_datapoints={accidents?.length || 0}
						start_date={start_date} // Fixed
						end_date={end_date} // Fixed
					/>
				</aside>

				<div className="flex grow flex-col space-y-1">
					<div className="h-full grow rounded-sm border-2">
						<Map accidents={accidents} predictions={predictions} />
					</div>
					<div className="flex h-fit shrink space-x-2">
						<div className="flex flex-col space-y-1">
							<DateSelector
								startDate={start_date}
								setStartDate={(date) => setStartDate(date)}
								endDate={end_date}
								setEndDate={(date) => setEndDate(date)}
							/>
						</div>
						<AreaSelector
							locations={Object.values(locations.counties) as County[]}
							currentLocation={{ county: county, city: city }}
							setCurrentLocation={(l) => setCurrentLocation(l)}
						/>
						<ConditionsSelector
							conditions={conditions}
							setConditions={setConditions}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
