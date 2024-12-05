/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AreaSelector } from "../(components)/area-selector";
import { FilterCol } from "../(components)/filter-col";
import { DateSelector } from "../(components)/date-selector";
import { ConditionsSelector } from "../(components)/conditions-selector";
import { InfoCard } from "../(components)/info-card";
import { AccidentsByYear } from "../(components)/charts/AccidentsByYear";

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
    const accidentsPerPage = 30;
    const [loadingAccidents, setLoadingAccidents] = useState(false);
    const [accidentsError, setAccidentsError] = useState("");

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
		roadSurface: "",
		roadCondition: "",
    });

	const safetyEquipMap = {
		A: "None in Vehicle",
		B: "Unknown",
		C: "Lap Belt Used",
		D: "Lap Belt Not Used",
		E: "Shoulder Harness Used",
		F: "Shoulder Harness Not Used",
		G: "Lap/Shoulder Harness Used",
		H: "Lap/Shoulder Harness Not Used",
		J: "Passive Restraint Used",
		K: "Passive Restraint Not Used",
		L: "Air Bag Deployed",
		M: "Air Bag Not Deployed",
		N: "Other",
		P: "Not Required",
		Q: "Child Restraint in Vehicle Used",
		R: "Child Restraint in Vehicle Not Used",
		S: "Child Restraint in Vehicle, Use Unknown",
		T: "Child Restraint in Vehicle, Improper Use",
		U: "No Child Restraint in Vehicle",
		V: "Driver, Motorcycle Helmet Not Used",
		W: "Driver, Motorcycle Helmet Used",
		X: "Passenger, Motorcycle Helmet Not Used",
		Y: "Passenger, Motorcycle Helmet Used",
		"": "Not Stated",
	  }

	  const finanResponsMap = {
		N: "No Proof of Insurance Obtained",
		Y: "Yes, Proof of Insurance Obtained",
		O: "Not Applicable",
		E: "Called Away Before Obtaining Insurance",
		"": "Not Stated", 
	  }

	  const partySobrietyMap = {
		A: "Had Not Been Drinking",
		B: "Had Been Drinking, Under Influence",
		C: "Had Been Drinking, Not Under Influence",
		D: "Had Been Drinking, Impairment Unknown",
		G: "Impairment Unknown",
		H: "Not Applicable",
	  }

	  const partyDrugPhysicalMap = {
		E: "Under Drug Influence",
		F: "Impairment - Physical",
		G: "Impairment Unknown",
		H: "Not Applicable",
		I: "Sleepy/Fatigued",
		"": "Not Stated", 
	  }

	  const vehicleTypeMap = {
		A: "Passenger Car/Station Wagon",
		B: "Passenger Car with Trailer",
		C: "Motorcycle/Scooter",
		D: "Pickup or Panel Truck",
		E: "Pickup or Panel Truck with Trailer",
		F: "Truck or Truck Tractor",
		G: "Truck or Truck Tractor with Trailer",
		H: "Schoolbus",
		I: "Other Bus",
		J: "Emergency Vehicle",
		K: "Highway Construction Equipment",
		L: "Bicycle",
		M: "Other Vehicle",
		N: "Pedestrian",
		O: "Moped",
		"": "Not Stated",
	  }

	  const inattentionMap = {
		A: "Cell Phone Handheld (7/1/03)",
		B: "Cell Phone Handsfree (7/1/03)",
		C: "Electronic Equipment (1/1/01)",
		D: "Radio/CD (1/1/01)",
		E: "Smoking (1/1/01)",
		F: "Eating (1/1/01)",
		G: "Children (1/1/01)",
		H: "Animal (1/1/01)",
		I: "Personal Hygiene (1/1/01)",
		J: "Reading (1/1/01)",
		K: "Other (1/1/01)",
		P: "Cell Phone (1/1/01, value prior to 7/03 form revision)",
		"": "Not Stated",
	  }

	  const movePreAccMap = {
		A: "Stopped",
		B: "Proceeding Straight",
		C: "Ran Off Road",
		D: "Making Right Turn",
		E: "Making Left Turn",
		F: "Making U-Turn",
		G: "Backing",
		H: "Slowing/Stopping",
		I: "Passing Other Vehicle",
		J: "Changing Lanes",
		K: "Parking Maneuver",
		L: "Entering Traffic",
		M: "Other Unsafe Turning",
		N: "Crossed Into Opposing Lane",
		O: "Parked",
		P: "Merging",
		Q: "Traveling Wrong Way",
		R: "Other",
		S: "Lane Splitting",
		"": "Not Stated", 
	  }


	//Info and function for graph data
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

	const [countyByYearData, setCountyByYearData] = useState<YearlyData[]>([]);
    const [loadingCountyByYear, setCountyByYearLoading] = useState(false);
    const [countyByYearError, setCountyByYearError] = useState("");


	const countySubmit = async () => {
		setCountyByYearData([]);

		// Construct the base query URL
		let queryUrl = `${API_BASE_URL}/api/summaryByCounty/?county=${county}`;
		console.log("Query URL:", queryUrl);
		setCountyByYearLoading(true);
		setCountyByYearError("");
		if (county === "") {
			queryUrl = `${API_BASE_URL}/api/summary/`;
		}
		try {
			const response = await fetch(queryUrl);

			// Handle 404 errors
			

			if (!response.ok) {
				if (response.status === 404) {
					setCountyByYearError("No Available Data")
					setCountyByYearData([]);
					return;
				}else{
				setCountyByYearError(`Error: ${response.statusText}`)
				setCountyByYearData([]);
			}
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();
			setCountyByYearData(data);
		} catch (err) {
			setCountyByYearError("An error occurred while fetching the data.")
			console.error("Fetch error:", err);
		}finally{
			setCountyByYearLoading(false);
		}
	};


	//Info and function for Statistics Page
    const [statistics, setStatistics] = useState<any | null>(null);
    const [loadingStatistics, setStatisticsLoading] = useState(false);
    const [statisticsError, setStatisticsError] = useState("");


	const fetchStatistics = async () => {
        if (!county) {
			setStatisticsError("Please select a county...")
            return;
        }
		setStatisticsError("");
		setStatisticsLoading(true);
        const queryUrl = `${API_BASE_URL}/api/statistics/?start_date=${start_date.toISOString().slice(0, 10)}&end_date=${end_date.toISOString().slice(0, 10)}&county=${county}${city ? `&city=${city}` : ""}`;

        console.log("Fetching statistics with URL:", queryUrl);

        try {
            const response = await fetch(queryUrl);

            if (!response.ok) {
				if (response.status === 404) {
                    setStatisticsError("No accident data found for the specified query.");
                } else {
                    setStatisticsError(`Error: ${response.statusText}`);
                }
                setStatistics(null);
                return;
            }

            const data = await response.json();
            setStatistics(data);
        } catch (err) {
			setStatisticsError("An error occurred while fetching the data.");
            console.error("Fetch error:", err);
        }finally{
			setStatisticsLoading(false)
		}
    };

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
		if (conditions.roadSurface && conditions.roadSurface !== "all") {
			params.append("road_surface", conditions.roadSurface);
		}
		if (conditions.roadCondition && conditions.roadCondition !== "all") {
			params.append("road_cond_1", conditions.roadCondition);
		}

        return params.toString();
    };

	//When update is clicked, this function is used
	const runAllQueries = async () => {
		await fetchAccidents();
		await countySubmit();
		await fetchStatistics();
	}

    const fetchAccidents = async () => {
        const params = getSearchParams();
        const url = `${API_BASE_URL}/api/accidents/?${params}`;
        setAccidentsError("")
		setLoadingAccidents(true)
		try {
            const res = await fetch(url);
            if (!res.ok) {
				if (res.status === 404) {
                    setAccidentsError("No accident data found for the specified query.");
                } else {
                    setAccidentsError(`Error: ${res.statusText}`);
                }
                console.error("Failed to fetch accidents:", res.statusText);
                return;
            }

            const data = await res.json();
            if (!Array.isArray(data)) {
				setAccidentsError("Undexpected Format")
                console.error("Unexpected response format:", data);
                return;
            }

            setAccidents(data);
            setCurrentPage(1); // Reset pagination
        } catch (error) {
            console.error("Error fetching accidents:", error);
        }
		finally{
			setLoadingAccidents(false);
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
        <div className="flex  gap-2 px-2">
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
                        runAllQueries();
                    }}
                    updateFilters={runAllQueries}
					
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
					{loadingAccidents && (
                    <div className="text-blue-500">
                        <h3>Loading accidents...</h3>
                    </div>
                )}
                {accidentsError && <p className="text-red-500">{accidentsError}</p>}

                    {currentAccidents.length > 0 ? (
                        <ul className="list-none">
                            {currentAccidents.map((result, index) => (
                                <li
                                    key={index}
                                    className="mb-4 rounded-lg border bg-gray-200 p-4 shadow-md dark:bg-gray-700"
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
											<strong>Lattitude:</strong> {result.location.point_x}
										</p>
										<p className="mx-1">
											<strong>Longitude:</strong> {result.location.point_y}
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
														<strong>Party Type:</strong>{" "}
														{party.party_type === "1" 
															? "Driver (including Hit and Run)"
															: party.party_type === "2" 
																? "Pedestrian"
																: party.party_type === "3" 
																	? "Parked Vehicle"
																	: party.party_type === "4" 
																		? "Bicyclist"
																		: party.party_type === "5" 
																			? "Other"
																			: party.party_type === "6" 
																				? "Operator"
																				: "Unknown"}
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
													<p className="mx-1">
														<strong>Party Race:</strong> {""}
														{party.race == "A"
															? "Asian"
															: party.race == "B"
																? "Black"
																: party.race == "H"
																	? "Hispanic"
																	: party.race == "W"
																		? "White"
																		: "Other"}
													</p>
													<p className="mx-1">
														<strong>Vehicle Year:</strong> {party.vehicle_year}
													</p>
													<p className="mx-1">
														<strong>Vehicle Make:</strong> {party.vehicle_make}
													</p>
													<p className="mx-1">
														<strong>Vehicle Type:</strong>{" "}
														{vehicleTypeMap[party.stwd_vehicle_type as keyof typeof vehicleTypeMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Party Sobriety:</strong>{" "}
														{partySobrietyMap[party.party_sobriety as keyof typeof partySobrietyMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Drug/Physical Condition:</strong>{" "}
														{partyDrugPhysicalMap[party.party_drug_physical as keyof typeof partyDrugPhysicalMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Safety Equipment:</strong>{" "}
														{safetyEquipMap[party.party_safety_equip_1 as keyof typeof safetyEquipMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Financial Responsibility:</strong>{" "}
														{finanResponsMap[party.finan_respons as keyof typeof finanResponsMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Inattention Type:</strong>{" "}
														{inattentionMap[party.inattention as keyof typeof inattentionMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Movement Preceding Accident:</strong>{" "}
														{movePreAccMap[party.move_pre_acc as keyof typeof movePreAccMap] || "Unknown"}
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
														<strong>Victim Role:</strong>{" "} 
														{victim.victim_role === "1" 
															? "Driver"
															: victim.victim_role === "2" 
																? "Passenger"
																: victim.victim_role === "3" 
																	? "Pedestrian"
																	: victim.victim_role === "4" 
																		? "Bicyclist"
																		: victim.victim_role === "5" 
																			? "Other (single victim on/in non-motor vehicle; e.g. ridden animal, horse-drawn carriage, train, or building)"
																			: victim.victim_role === "6" 
																				? "Non-Injured Party"
																				: "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Victim Age:</strong> {victim.victim_age}
													</p>
													<p className="mx-1">
														<strong>Victim Sex:</strong> {victim.victim_sex}
													</p>
													<p className="mx-1">
														<strong>Degree of Injury:</strong>{" "}
														{victim.victim_degree_of_injury === "1"
															? "Killed"
															: victim.victim_degree_of_injury === "2" 
																? "Severe Injury"
																: victim.victim_degree_of_injury === "3" 
																	? "Other Visible Injury"
																	: victim.victim_degree_of_injury === "4" 
																		? "Complaint of Pain"
																		: victim.victim_degree_of_injury === "5" 
																			? "Suspected Serious Injury"
																			: victim.victim_degree_of_injury === "6" 
																				? "Suspected Minor Injury"
																				: victim.victim_degree_of_injury === "7" 
																					? "Possible Injury"
																					: victim.victim_degree_of_injury === "0" 
																						? "No Injury"
																						: "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Victim Seating Position:</strong>{" "}
														{victim.victim_seating_position === "1"
															? "Driver"
															: (["2", "3", "4", "5", "6"].includes(victim.victim_seating_position)) ? "Passenger" 
																: victim.victim_seating_position === "7" 
																	? "Station Wagon Rear"
																	: victim.victim_seating_position === "8" 
																		? "Rear Occupant of Truck or Van"
																		: victim.victim_seating_position === "9" 
																			? "Position Unknown"
																			: victim.victim_seating_position === "0" 
																				? "Other Occupants"
																				: (victim.victim_seating_position >= "A" && victim.victim_seating_position <= "Z") ? "Bus Occupants" 
																					: "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Safety Equipment:</strong>{" "}
														{safetyEquipMap[victim.victim_safety_equip_1 as keyof typeof safetyEquipMap] || "Unknown"}
													</p>
													<p className="mx-1">
														<strong>Victim Ejected:</strong>{" "} 
														{victim.victim_ejected === "0" 
															? "Not Ejected"
															: victim.victim_ejected === "1" 
																? "Fully Ejected"
																: victim.victim_ejected === "2" 
																	? "Partially Ejected"
																	:  "Unknown"}
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

			<div className="container mx-auto">
			<div className="container mx-auto">
			{loadingCountyByYear && (
                    <div className="text-blue-500">
                        <h3>Loading Graphs...</h3>
                    </div>
                )}
                {countyByYearError && <p className="text-red-500">{statisticsError}</p>}

			<br />
			<header className="text-center mb-6">
                <h1 className="text-3xl font-semibold">Calsafe Graphs</h1>
				<p className="text-gray-500">Accidents By Year</p>
				<p className="text-gray-500">{county}</p>
            </header>
			
			<div className="columns-2">
				<div>
					<h1 className="mb2 flex justify-center text-2xl font-bold">
						Total Accidents
					</h1>
					{countyByYearData.length > 0 ? (
						<AccidentsByYear
							data={countyByYearData.map((data) => {
								return { year: data.year, total: data.data.total_crashes };
							})}
						></AccidentsByYear>
					) : (
						<p className="flex justify-center">No statistics available for the specified query.</p>
					)}
				</div>
				<div>
					<h1 className="mb2 flex justify-center text-2xl font-bold">
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
						<p  className="flex justify-center">No statistics available for the specified query.</p>
					)}
				</div>

				<div>
					<h1 className="mb2 flex justify-center text-2xl font-bold">
						Traffic Injuries
					</h1>
					{countyByYearData.length > 0 ? (
						<AccidentsByYear
							data={countyByYearData.map((data) => {
								return { year: data.year, total: data.data.total_injuries };
							})}
						></AccidentsByYear>
					) : (
						<p  className="flex justify-center">No statistics available for the specified query.</p>
					)}
				</div>
				<div>
					<h1 className="mb2 flex justify-center text-2xl font-bold">
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
						<p  className="flex justify-center">No statistics available for the specified query.</p>
					)}
				</div>
			</div>
		</div>

		<div className="p-6">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-semibold">Calsafe Statistics</h1>
				<p className="text-gray-500">{city} {county}</p>
				<p className="text-gray-500">{start_date.toISOString().slice(0, 10)} to {end_date.toISOString().slice(0, 10)}</p>
            </header>


            {/* Loading, Error, and Results */}
            <div className="mt-6">
				{loadingStatistics && (
                    <div className="text-blue-500">
                        <h3>Loading statistics...</h3>
                    </div>
                )}
                {statisticsError && <p className="text-red-500">{statisticsError}</p>}

                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Total Crashes</h3>
                            <p>{statistics.total_crashes}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Total Injuries</h3>
                            <p>{statistics.total_injuries}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Total Fatalities</h3>
                            <p>{statistics.total_fatalities}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Pedestrian Accidents</h3>
                            <p>{statistics.pedestrian_accidents}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Bicycle Accidents</h3>
                            <p>{statistics.bicycle_accidents}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Motorcycle Accidents</h3>
                            <p>{statistics.motorcycle_accidents}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Truck Accidents</h3>
                            <p>{statistics.truck_accidents}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Alcohol-Related Accidents</h3>
                            <p>{statistics.alcohol_related}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Hit and Run Accidents</h3>
                            <p>{statistics.hit_and_run}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Head On Accidents</h3>
                            <p>{statistics.head_on}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Sideswipe Accidents</h3>
                            <p>{statistics.sideswipe}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Rear End Accidents</h3>
                            <p>{statistics.rear_end}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Object Hit Accidents</h3>
                            <p>{statistics.hit_object}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Roll-over Accidents</h3>
                            <p>{statistics.roll_over}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">City with Most Accidents</h3>
                            <p>{statistics.most_accidents_city.city}</p>
                            <p>Accident Count: {statistics.most_accidents_city.accident_count}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Intersection with Most Accidents</h3>
                            <p>Primary Road: {statistics.most_common_road_pair.primary_rd}</p>
                            <p>Secondary Road: {statistics.most_common_road_pair.secondary_rd}</p>
                            <p>Accidents: {statistics.most_common_road_pair.count}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
                            <h3 className="font-semibold">Road with Most Accidents</h3>
                            <p>{statistics.most_common_primary_road.primary_rd}</p>
                            <p>Accidents: {statistics.most_common_primary_road.count}</p>
                        </div>
                        <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
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


		
		</div>
        </div>

		
    );
}


