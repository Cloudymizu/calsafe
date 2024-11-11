"use client";

import { AreaSelector } from "./(components)/area-selector";
import { FilterCol } from "./(components)/filter-col";
import { DateSelector } from "./(components)/date-selector";
import { ConditionsSelector } from "./(components)/conditions-selector";
import { InfoCard } from "./(components)/info-card";
import { useState } from "react";

import locations from "./locations.json";
import dynamic from "next/dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Page() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [city, setCity] = useState("");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [county, setCounty] = useState("");
	const [start_date, setStartDate] = useState(new Date("2018-01-01"));
	const [end_date, setEndDate] = useState(new Date("2023-12-31"));

	const [accidents, setAccidents] = useState<Accident[] | undefined>();

	const [filters, setFilters] = useState({
		alcohol: false,
		motorcycle: false,
		hitAndRun: false,
		fatal: false,
		bicycleAccident: false,
		pedestrianAccident: false,
		truckAccident: false,
		stateHighway: false,
	});

	const [conditions, setConditions] = useState({
		weather: "",
		lighting: "",
		collisionType: "",
	});

	const getSearchParams = () => {
		const params = new URLSearchParams();
		params.append("city", city);
		params.append("county", county);
		params.append("start_date", start_date.toISOString().slice(0, 10));
		params.append("end_date", end_date.toISOString().slice(0, 10));

		// filters
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

		if (conditions.weather && conditions.weather !== "all") {
			params.append("weather_1", conditions.weather);
		}
		if (conditions.collisionType && conditions.collisionType !== "all") {
			params.append("type_of_collision", conditions.collisionType);
		}
		if (conditions.lighting && conditions.lighting !== "all") {
			params.append("lighting", conditions.lighting);
		}

		return params.toString();
	};

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
		});
	};

	const fetchAccidents = async () => {
		const params = getSearchParams();
		const url = `${API_BASE_URL}/api/accidents/?${params}`;

		const res = await fetch(url);
		const data = await res.json();

		setAccidents(data);

		//return data;
	};

	const setCurrentLocation = (location: CountyAndCity) => {
		setCity(location.city);
		setCounty(location.county);
	};

	return (
		<>
			<div className="flex gap-2 px-2">
				<aside className="w-fit">
					<FilterCol
						filters={filters}
						setFilters={setFilters}
						clearFilters={clearFilters}
						updateFilters={fetchAccidents}
					/>
				</aside>

				<div className="flex grow flex-col space-y-1">
					<div className="h-full grow rounded-sm border-2"> <Map /> </div>
					<div className="flex h-fit shrink space-x-2">
						<div className="flex flex-col space-y-1">
							<DateSelector
								startDate={start_date}
								setStartDate={setStartDate}
								endDate={end_date}
								setEndDate={setEndDate}
							/>
							<InfoCard
								num_datapoints={accidents?.length || 0}
								start_date={new Date()}
								end_date={new Date()}
							/>
						</div>
						<AreaSelector
							locations={Object.values(locations.counties) as County[]}
							currentLocation={{ county: county, city: city }}
							setCurrentLocation={(l) => {
								setCurrentLocation(l);
							}}
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
