"use client";

import { useState } from "react";
import { AreaSelector } from "../(components)/area-selector";
import { FilterCol } from "../(components)/filter-col";
import { DateSelector } from "../(components)/date-selector";
import { ConditionsSelector } from "../(components)/conditions-selector";
import { InfoCard } from "../(components)/info-card";

import locations from "../locations.json";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
    const [city, setCity] = useState("");
    const [county, setCounty] = useState("");
    const [start_date, setStartDate] = useState(new Date("2018-01-01"));
    const [end_date, setEndDate] = useState(new Date("2023-12-31"));

    const [accidents, setAccidents] = useState<Accident[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState<number | null>(null);
    const accidentsPerPage = 50;

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

        if (filters.fatal) params.append("collision_severity", "1");
        if (filters.hitAndRun) params.append("hit_and_run", "M,F");
        if (filters.alcohol) params.append("alcohol_involved", "Y");
        if (filters.motorcycle) params.append("motorcycle_accident", "Y");
        if (filters.bicycleAccident) params.append("bicycle_accident", "Y");
        if (filters.pedestrianAccident) params.append("pedestrian_accident", "Y");
        if (filters.truckAccident) params.append("truck_accident", "Y");
        if (filters.stateHighway) params.append("state_hwy_ind", "Y");

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

    const fetchAccidents = async () => {
        const params = getSearchParams();
        const url = `${API_BASE_URL}/api/accidents/?${params}`;
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

            setAccidents(data);
            setCurrentPage(1); // Reset pagination
        } catch (error) {
            console.error("Error fetching accidents:", error);
        }
    };

    const toggleExpand = (index: number) => {
        setExpanded(expanded === index ? null : index);
    };

    const indexOfLastAccident = currentPage * accidentsPerPage;
    const indexOfFirstAccident = indexOfLastAccident - accidentsPerPage;
    const currentAccidents = accidents.slice(indexOfFirstAccident, indexOfLastAccident);

    const totalPages = Math.ceil(accidents.length / accidentsPerPage);

    return (
        <div className="flex gap-2 px-2">
            <aside className="sticky top-10 size-fit">
                <FilterCol
                    filters={filters}
                    setFilters={setFilters}
                    clearFilters={() => {
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
                        fetchAccidents();
                    }}
                    updateFilters={fetchAccidents}
                />
                <InfoCard
                    num_datapoints={accidents.length}
                    start_date={start_date}
                    end_date={end_date}
                />
            </aside>

            <div className="flex grow flex-col space-y-4">
                <div className="flex h-fit shrink space-x-2">
                    <DateSelector
                        startDate={start_date}
                        setStartDate={(date) => setStartDate(date)}
                        endDate={end_date}
                        setEndDate={(date) => setEndDate(date)}
                    />
                    <AreaSelector
                        locations={Object.values(locations.counties) as County[]}
                        currentLocation={{ county, city }}
                        setCurrentLocation={(l) => {
                            setCity(l.city);
                            setCounty(l.county);
                        }}
                    />
                    <ConditionsSelector
                        conditions={conditions}
                        setConditions={setConditions}
                    />
                </div>

                <div className="flex flex-col gap-5">
                    <h2>Results:</h2>
                    {currentAccidents.length > 0 ? (
                        <ul className="list-none">
                            {currentAccidents.map((result, index) => (
                                <li
                                    key={index}
                                    className="mb-4 rounded-lg border bg-gray-800 p-4 shadow-md"
                                    onClick={() => toggleExpand(index)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <p>
                                        <strong>Date:</strong> {result.collision_date}
                                        <br />
                                        <strong>Location:</strong> {result.location.city},{" "}
                                        {result.location.county}
                                        <br />
                                        <strong>Severity:</strong>{" "}
                                        {result.severity.collision_severity == "1"
										? "Fatal"
										: result.severity.collision_severity == "2"
											? "Severe Injury"
											: result.severity.collision_severity == "3"
												? "Minor/Visible Injury"
												: result.severity.collision_severity == "4"
													? "Complaint of Pain"
													: "Property Damage Only"}
                                    </p>
                                    {expanded === index && (
                                        <div className="mt-3 border-l-4 border-slate-400 pl-3">
										<h3 className="mb-3 text-lg">Location Details</h3>
										<p className="mx-1">
											<strong>Primary Road:</strong>{" "}
											{result.location.primary_rd}
										</p>
										<p className="mx-1">
											<strong>Secondary Road:</strong>{" "}
											{result.location.secondary_rd}
										</p>
										<p className="mx-1">
											<strong>City:</strong> {result.location.city}
										</p>
										<p className="mx-1">
											<strong>County:</strong> {result.location.county}
										</p>
										<p className="mx-1">
											<strong>Point X:</strong> {result.location.point_x}
										</p>
										<p className="mx-1">
											<strong>Point Y:</strong> {result.location.point_y}
										</p>
										<h3 className="mb-3 text-lg">Severity Details</h3>
										<p className="mx-1">
											<strong>Collision Severity:</strong>{" "}
											{result.severity.collision_severity == "1"
												? "Fatal"
												: result.severity.collision_severity == "2"
													? "Severe Injury"
													: result.severity.collision_severity == "3"
														? "Minor/Visible Injury"
														: result.severity.collision_severity == "4"
															? "Complaint of Pain"
															: "Property Damage Only"}
										</p>
										<p className="mx-1">
											<strong>Number Killed:</strong>{" "}
											{result.severity.number_killed}
										</p>
										<p className="mx-1">
											<strong>Number Injured:</strong>{" "}
											{result.severity.number_injured}
										</p>
										<p className="mx-1">
											<strong>Severe Injuries:</strong>{" "}
											{result.severity.count_severe_inj}
										</p>
										<p className="mx-1">
											<strong>Visible Injuries:</strong>{" "}
											{result.severity.count_visible_inj}
										</p>
										<p className="mx-1">
											<strong>Complaint of Pain Injuries:</strong>{" "}
											{result.severity.count_complaint_pain}
										</p>
										<h3 className="mb-3 text-lg">Accident Details</h3>
										<p className="mx-1">
											<strong>Accident Year:</strong> {result.accident_year}
										</p>
										<p className="mx-1">
											<strong>Collision Time:</strong> {result.collision_time}
										</p>
										<p className="mx-1">
											<strong>Case Number:</strong> {result.case_id}
										</p>
										<p className="mx-1">
											<strong>Type of Collision:</strong>{" "}
											{result.type_of_collision === "A"
												? "Head-On"
												: result.type_of_collision === "B"
													? "Sideswipe"
													: result.type_of_collision === "C"
														? "Rear-End"
														: result.type_of_collision === "D"
															? "Broadside"
															: result.type_of_collision === "E"
																? "Hit Object"
																: result.type_of_collision === "F"
																	? "Roll-Over"
																	: result.type_of_collision === "G"
																		? "Vehicle/Pedestrian"
																		: "Other or Not Stated"}
										</p>
										<p className="mx-1">
											<strong>Hit and Run:</strong>{" "}
											{result.hit_and_run === "M"
												? "Misdemeanor"
												: result.hit_and_run === "F"
													? "Felony"
													: "No"}
										</p>
										<p className="mx-1">
											<strong>Pedestrian Involved:</strong>{" "}
											{result.pedestrian_accident === "Y" ? "Yes" : "No"}
										</p>
										<p className="mx-1">
											<strong>Bicycle Involved:</strong>{" "}
											{result.bicycle_accident === "Y" ? "Yes" : "No"}
										</p>
										<p className="mx-1">
											<strong>Motorcycle Involved:</strong>{" "}
											{result.motorcycle_accident === "Y" ? "Yes" : "No"}
										</p>
										<p className="mx-1">
											<strong>Truck Involved:</strong>{" "}
											{result.truck_accident === "Y" ? "Yes" : "No"}
										</p>
										<p className="mx-1"></p>
										<strong>Bicycle Involved:</strong>{" "}
										{result.bicycle_accident === "Y" ? "Yes" : "No"}
										<br />
										<p className="mx-1">
											<strong>Alcohol Involved:</strong>{" "}
											{result.alcohol_involved === "Y" ? "Yes" : "No"}
										</p>
										<h3 className="mb-3 text-lg">Environment Details</h3>
										<p className="mx-1">
											<strong>Weather:</strong>{" "}
											{result.environment.weather_1 == "A"
												? "Clear"
												: result.environment.weather_1 == "C"
													? "Raining"
													: result.environment.weather_1 == "E"
														? "Fog"
														: result.environment.weather_1 == "D"
															? "Snowing"
															: "Other"}
										</p>
										<p className="mx-1">
											<strong>Road Surface:</strong>{" "}
											{result.environment.road_surface == "A"
												? "Dry"
												: result.environment.road_surface == "B"
													? "Wet"
													: result.environment.road_surface == "C"
														? "Snowy or Icy"
														: result.environment.road_surface == "D"
															? "Slippery (Muddy, Oily, etc.)"
															: "Not Stated"}
										</p>
										<p className="mx-1"></p>
										<strong>Road Conditions:</strong>{" "}
										{result.environment.road_cond_1 == "A"
											? "Potholes"
											: result.environment.road_cond_1 == "B"
												? "Loose Materials on Road"
												: result.environment.road_cond_1 == "C"
													? "Obstruction on Road"
													: result.environment.road_cond_1 == "D"
														? "Construction Zone"
														: result.environment.road_cond_1 == "E"
															? "Reduced Width"
															: result.environment.road_cond_1 == "F"
																? "Flooded"
																: result.environment.road_cond_1 == "H"
																	? "No Unsual Conditions"
																	: "Other/Not Stated"}
										<br />
										<p className="mx-1">
											<strong>Lighting:</strong>{" "}
											{result.environment.lighting == "A"
												? "Daylight"
												: result.environment.lighting == "B"
													? "Dawn/Dusk"
													: result.environment.lighting == "C"
														? "Dark w/ Street Lamps"
														: result.environment.lighting == "D"
															? "Dark w/o Street Lamps"
															: result.environment.lighting == "E"
																? "Dark w/ Inoperable Lamps"
																: "Not Stated"}
										</p>
										<p className="mx-1">
											<strong>State Highway Indicator:</strong>{" "}
											{result.environment.state_hwy_ind}
										</p>
										<h3 className="mb-3 text-lg">Party Details</h3>
										{result.parties && result.parties.length > 0 ? (
											result.parties.map((party: Party, idx: number) => (
												<div
													key={idx}
													className="mt-3 border-l-4 border-slate-200 pl-3"
												>
													<p className="mx-1">
														<strong>Party Number:</strong> {party.party_number}
													</p>
													<p className="mx-1">
														<strong>Party Type:</strong> {party.party_type}
													</p>
													<p className="mx-1">
														<strong>At Fault:</strong>{" "}
														{party.at_fault === "Y" ? "Yes" : "No"}
													</p>
													<p className="mx-1">
														<strong>Party Age:</strong> {party.party_age}
													</p>
													<p className="mx-1">
														<strong>Party Sex:</strong> {party.party_sex}
													</p>
												</div>
											))
										) : (
											<p className="mx-1">
												No party data available for this accident.
											</p>
										)}
										<h3 className="mb-3 text-lg">Victim Details</h3>
										{result.victims && result.victims.length > 0 ? (
											result.victims.map((victim, idx: number) => (
												<div
													key={idx}
													className="mt-3 border-l-4 border-slate-200 pl-3"
												>
													<p className="mx-1">
														<strong>Victim Role:</strong> {victim.victim_role}
													</p>
													<p className="mx-1">
														<strong>Victim Age:</strong> {victim.victim_age}
													</p>
													<p className="mx-1">
														<strong>Victim Sex:</strong> {victim.victim_sex}
													</p>
													<p className="mx-1">
														<strong>Degree of Injury:</strong>{" "}
														{victim.victim_degree_of_injury}
													</p>
												</div>
											))
										) : (
											<p className="mx-1">
												No victim data available for this accident.
											</p>
										)}
									</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found for the specified query.</p>
                    )}

                    <div className="flex justify-between mt-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:bg-gray-500"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:bg-gray-500"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


