// app/map/page.tsx
"use client";

import { useState } from "react";
import Switch from "../../components/Switch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log(process.env);

interface Location {
	primary_rd: string;
	secondary_rd: string;
	distance: number;
	direction: string;
	intersection: string;
	city: string;
	county: string;
	point_x: number;
	point_y: number;
}

interface Severity {
	collision_severity: string;
	number_killed: number;
	number_injured: number;
	count_severe_inj: number;
	count_visible_inj: number;
	count_complaint_pain: number;
	count_ped_killed: number;
	count_ped_injured: number;
	count_bicyclist_killed: number;
	count_bicyclist_injured: number;
	count_mc_killed: number;
	count_mc_injured: number;
}

interface Environment {
	weather_1: string;
	weather_2: string;
	road_surface: string;
	road_cond_1: string;
	road_cond_2: string;
	lighting: string;
	state_hwy_ind: string;
}

interface Party {
	case_id: number;
	party_number: number;
	party_type: string;
	at_fault: string;
	party_age: number;
	party_sex: string;
	party_sobriety: string;
	party_drug_physical: string;
	dir_of_travel: string;
	party_safety_equip_1: string;
	party_safety_equip_2: string;
	finan_respons: string;
	vehicle_year: number;
	vehicle_make: string;
	stwd_vehicle_type: string;
	inattention: string;
	race: string;
	move_pre_acc: string;
}

interface Victim {
	case_id: number;
	victim_role: string;
	victim_sex: string;
	victim_age: number;
	victim_degree_of_injury: string;
	victim_seating_position: string;
	victim_safety_equip_1: string;
	victim_safety_equip_2: string;
	victim_ejected: string;
}

interface Accident {
	case_id: number;
	accident_year: number;
	collision_date: string;
	collision_time: string;
	location: Location;
	severity: Severity;
	environment: Environment;
	parties: Party[];
	victims: Victim[];
	hit_and_run: string;
	type_of_collision: string;
	pedestrian_accident: string;
	bicycle_accident: string;
	motorcycle_accident: string;
	truck_accident: string;
	alcohol_involved: string;
}

// List of Southern California counties
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

const citiesSanLuisObispo = [
	"Arroyo Grande",
	"Atascadero",
	"Grover Beach",
	"Morro Bay",
	"Paso Robles",
	"Pismo beach",
	"San Luis Obispo",
	"Unincorporated",
];

const citiesKern = [
	"Arvin",
	"Bakersfield",
	"Bear Valley",
	"California City",
	"Delano",
	"McFarland",
	"Ridgecrest",
	"Shafter",
	"Stallion Springs",
	"Taft",
	"Tehachapi",
	"Unincorporated",
];

const citiesSanBernardino = [
	"Adelanto",
	"Apple Valley",
	"Barstow",
	"Big Bear Lake",
	"Chino Hills",
	"Chino",
	"Colton",
	"Fontana",
	"Grand Terrace",
	"Hesperia",
	"Highland",
	"Loma Linda",
	"Montclair",
	"Needles",
	"Ontario",
	"Rancho Cucamonga",
	"Redlands",
	"Rialto",
	"San Bernandino",
	"Twentynine Palms",
	"Upland",
	"Victorville",
	"Yucaipa",
	"Yucca Valley",
	"Unincorporated",
];

const citiesVentura = [
	"Camarillo",
	"Fillmore",
	"Moorpark",
	"Ojai",
	"Oxnard",
	"Port Hueneme",
	"Santa Paula",
	"Simi Valley",
	"Thousand Oaks",
	"Ventura",
	"Unincorporated",
];

const citiesLosAngeles = [
	"Agoura Hills",
	"Alhambra",
	"Arcadia",
	"Artesia",
	"Avalon",
	"Azusa",
	"Baldwin Park",
	"Bell",
	"Bell Gardens",
	"Bellflower",
	"Beverly Hills",
	"Bradbury",
	"Burbank",
	"Calabasas",
	"Carson",
	"Cerritos",
	"Claremont",
	"Commerce",
	"Compton",
	"Covina",
	"Cudahy",
	"Culver City",
	"Diamond Bar",
	"Downey",
	"Duarte",
	"El Monte",
	"El Segundo",
	"Gardena",
	"Glendale",
	"Glendora",
	"Hawaiian Gardens",
	"Hawthorne",
	"Hermosa Beach",
	"Hidden Hills",
	"Huntington Park",
	"Industry",
	"Inglewood",
	"Irwindale",
	"La Canada Flintridge",
	"La Habra Heights",
	"La Mirada",
	"La Puente",
	"La Verne",
	"Lakewood",
	"Lancater",
	"Lawndale",
	"Lomita",
	"Long Beach",
	"Los Angeles",
	"Lynwood",
	"Malibu",
	"Manhattan Beach",
	"Maywood",
	"Monrovia",
	"Montebello",
	"Monterey Park",
	"Norwalk",
	"Palmdale",
	"Palos Verdes Estates",
	"Paramount",
	"Pasadena",
	"Pico Rivera",
	"Pomona",
	"Rancho Palos Verdes",
	"Redondo Beach",
	"Rolling Hills",
	"Rolling Hills Estates",
	"Rosemead",
	"San Dimas",
	"San Fernando",
	"San Gabriel",
	"San Marino",
	"Santa Clarita",
	"Santa Fe Springs",
	"Santa Monica",
	"Sierra Madre",
	"Signal Hill",
	"South El Monte",
	"South Gate",
	"South Pasadena",
	"Temple City",
	"Torrance",
	"Vernon",
	"Walnut",
	"West Covina",
	"West Hollywood",
	"Westlake Village",
	"Whittier",
	"Unincorporated",
];

const citiesOrange = [
	"Aliso Viejo",
	"Anaheim",
	"Brea",
	"Buena Park",
	"Costa Mesa",
	"Cypress",
	"Dana Point",
	"Fountain Valley",
	"Fullerton",
	"Garden Grove",
	"Huntington Beach",
	"Irvine",
	"La Habra",
	"La Palma",
	"Laguna Beach",
	"Laguna Hills",
	"laguna Niguel",
	"Laguna Woods",
	"Lake Forest",
	"Los Alamitos",
	"Mission Viejo",
	"Newport Beach",
	"Orange",
	"Placentia",
	"Rancho Santa Margarita",
	"San Clemente",
	"San Juan Capistrano",
	"Santa Ana",
	"Seal Beach",
	"Stanton",
	"Tustin",
	"Villa Park",
	"Westminster",
	"Yorba Linda",
	"Unincorporated",
];

const citiesRiverside = [
	"Banning",
	"Beaumont",
	"Blythe",
	"Calimesa",
	"Canyon Lake",
	"Cathedral City",
	"Coachella",
	"Corona",
	"Desert Hot Springs",
	"Eastvale",
	"Hemet",
	"Indian Wells",
	"Indio",
	"Jurupa Valley",
	"La Quinta",
	"Lake Elsinore",
	"Menifee",
	"Moreno Valley",
	"Murrieta",
	"Norco",
	"Palm Dessert",
	"Palm Springs",
	"Perris",
	"Rancho Mirage",
	"Riverside",
	"San Jacinto",
	"Temecula",
	"Wildomar",
	"Unincorporated",
];

const citiesSanDiego = [
	"Carlsbad",
	"Chula Vista",
	"Coronado",
	"Del Mar",
	"El Cajon",
	"Encinitas",
	"Escondido",
	"Imperial Beach",
	"La Mesa",
	"Lemon Grove",
	"National City",
	"Oceanside",
	"Poway",
	"San Diego",
	"San Marcos",
	"Santee",
	"Solana Beach",
	"Vista",
	"Unincorporated",
];

const citiesImperial = [
	"Brawley",
	"Calexico",
	"Calipatria",
	"El Centro",
	"Holtville",
	"Imperial",
	"Westmorland",
	"Unincorporated",
];

// Helper functions to generate year, month, and day options
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateYears = () => {
	const years = [];
	for (let i = 2018; i <= 2023; i++) {
		years.push(i);
	}
	return years;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateMonths = () => {
	return [
		{ value: "01", label: "January" },
		{ value: "02", label: "February" },
		{ value: "03", label: "March" },
		{ value: "04", label: "April" },
		{ value: "05", label: "May" },
		{ value: "06", label: "June" },
		{ value: "07", label: "July" },
		{ value: "08", label: "August" },
		{ value: "09", label: "September" },
		{ value: "10", label: "October" },
		{ value: "11", label: "November" },
		{ value: "12", label: "December" },
	];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateDays = () => {
	const days = [];
	for (let i = 1; i <= 31; i++) {
		days.push(i < 10 ? `0${i}` : `${i}`); // Add leading zero for single digits
	}
	return days;
};

const MapPage = () => {
	// State for Switches
	const [isAlcoholToggled, setAlcoholIsToggled] = useState(false);
	const [isMotorcycleToggled, setMotorcycleIsToggled] = useState(false);
	const [isHitnRunToggled, setHitnRunIsToggled] = useState(false);
	const [isFatalToggled, setFatalIsToggled] = useState(false);
	const [isBicycleToggled, setBicycleIsToggled] = useState(false);
	const [isPedestrianToggled, setPedestrianIsToggled] = useState(false);
	const [isTruckToggled, setTruckIsToggled] = useState(false);
	const [isHighwayToggled, setHighwayIsToggled] = useState(false);

	// State for date selections
	const [startYear, setStartYear] = useState("2018");
	const [startMonth, setStartMonth] = useState("01");
	const [startDay, setStartDay] = useState("01");

	const [endYear, setEndYear] = useState("2023");
	const [endMonth, setEndMonth] = useState("12");
	const [endDay, setEndDay] = useState("31");

	// State for county & city
	const [county, setCounty] = useState("");
	const [city, setCity] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [weather, setWeather] = useState("");
	const [collisionType, setCollisionType] = useState("");
	const [lighting, setLighting] = useState("");

	// Track the expanded item
	const [expanded, setExpanded] = useState<number | null>(null);

	// Combine the dropdown values into a single date string (YYYY-MM-DD)
	const buildDate = (year: string, month: string, day: string) =>
		`${year}-${month}-${day}`;

	// Function to handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(""); // Reset error

		const startDate = buildDate(startYear, startMonth, startDay);
		const endDate = buildDate(endYear, endMonth, endDay);

		// Construct the base query URL
		let queryUrl = `${API_BASE_URL}/api/accidents/?start_date=${startDate}&end_date=${endDate}&county=${county}`;
		if (city != "") {
			queryUrl = queryUrl.concat("&city=");
			queryUrl = queryUrl.concat(city);
		}

		if (isFatalToggled) {
			queryUrl = queryUrl.concat("&collision_severity=1");
		}

		if (isHitnRunToggled) {
			queryUrl = queryUrl.concat("&hit_and_run=M,F");
		}

		if (isAlcoholToggled) {
			queryUrl = queryUrl.concat("&alcohol_involved=Y");
		}

		if (isMotorcycleToggled) {
			queryUrl = queryUrl.concat("&motorcycle_accident=Y");
		}

		if (isBicycleToggled) {
			queryUrl = queryUrl.concat("&bicycle_accident=Y");
		}

		if (isPedestrianToggled) {
			queryUrl = queryUrl.concat("&pedestrian_accident=Y");
		}

		if (isTruckToggled) {
			queryUrl = queryUrl.concat("&truck_accident=Y");
		}

		if (isHighwayToggled) {
			queryUrl = queryUrl.concat("&state_hwy_ind=Y");
		}

		if (weather !== "") queryUrl += `&weather_1=${weather}`;
		if (collisionType !== "") queryUrl += `&type_of_collision=${collisionType}`;
		if (lighting !== "") queryUrl += `&lighting=${lighting}`;

		console.log("Query URL:", queryUrl);
		if (county == "") {
			setError("Please Select a county...");
		} else {
			setLoading(true);
			try {
				const response = await fetch(queryUrl);

				// Handle 404 errors
				if (response.status === 404) {
					setError("No accident data found for the specified query.");
					setResults([]);
					return;
				}

				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				const data = await response.json();
				setResults(data);
			} catch (err) {
				setError("An error occurred while fetching the data.");
				console.error("Fetch error:", err);
			} finally {
				setLoading(false); // Stop loading spinner
			}
		}
	};

	// Function to toggle expansion of a specific data point
	const toggleExpand = (index: number) => {
		setExpanded(expanded === index ? null : index); // Collapse if already expanded
	};

	return (
		<div>
			<div className="h-20 items-center justify-center">
				<h1 className="border-gray-300 text-center font-semibold">
					Welcome to Calsafe!
				</h1>
				<h4 className="text-center text-base font-normal text-gray-500">
					Enter details below to get started
				</h4>
			</div>
			<div className="flex">
				<form onSubmit={handleSubmit} className="w-1/2">
					{/* Start Date */}
					<p className="mx-10 font-mono font-semibold">Accident Date Range</p>
					<div className="flex items-center font-mono">
						<label className="w-20">Start Date:</label>
						<select
							className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={startYear}
							onChange={(e) => setStartYear(e.target.value)}
						>
							{[2018, 2019, 2020, 2021, 2022, 2023].map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
						<select
							className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={startMonth}
							onChange={(e) => setStartMonth(e.target.value)}
						>
							{[
								"01",
								"02",
								"03",
								"04",
								"05",
								"06",
								"07",
								"08",
								"09",
								"10",
								"11",
								"12",
							].map((month) => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
						<select
							className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={startDay}
							onChange={(e) => setStartDay(e.target.value)}
						>
							{[...Array(31)].map((_, i) => (
								<option key={i + 1} value={String(i + 1).padStart(2, "0")}>
									{i + 1}
								</option>
							))}
						</select>
					</div>

					{/* End Date */}
					<div className="flex items-center font-mono">
						<label className="w-20">End Date:</label>
						<select
							className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={endYear}
							onChange={(e) => setEndYear(e.target.value)}
						>
							{[2018, 2019, 2020, 2021, 2022, 2023].map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
						<select
							className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={endMonth}
							onChange={(e) => setEndMonth(e.target.value)}
						>
							{[
								"01",
								"02",
								"03",
								"04",
								"05",
								"06",
								"07",
								"08",
								"09",
								"10",
								"11",
								"12",
							].map((month) => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
						<select
							className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={endDay}
							onChange={(e) => setEndDay(e.target.value)}
						>
							{[...Array(31)].map((_, i) => (
								<option key={i + 1} value={String(i + 1).padStart(2, "0")}>
									{i + 1}
								</option>
							))}
						</select>
					</div>

					{/* County */}
					<div className="flex items-center font-mono">
						<label className="w-20">County:</label>
						<select
							className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={county}
							onChange={(e) => {
								setCounty(e.target.value);
								setCity("");
							}}
						>
							<option value="">Select a county</option>
							{southernCaliforniaCounties.map((countyName) => (
								<option key={countyName} value={countyName}>
									{countyName}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center font-mono">
						<label className="w-20">City:</label>
						<select
							className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						>
							<option value="">All</option>
							{county == ""
								? "No County Selected..."
								: county == "San Luis Obispo"
									? citiesSanLuisObispo.map((cityName) => (
											<option key={cityName} value={cityName}>
												{cityName}
											</option>
										))
									: county == "Kern"
										? citiesKern.map((cityName) => (
												<option key={cityName} value={cityName}>
													{cityName}
												</option>
											))
										: county == "San Bernardino"
											? citiesSanBernardino.map((cityName) => (
													<option key={cityName} value={cityName}>
														{cityName}
													</option>
												))
											: county == "Ventura"
												? citiesVentura.map((cityName) => (
														<option key={cityName} value={cityName}>
															{cityName}
														</option>
													))
												: county == "Los Angeles"
													? citiesLosAngeles.map((cityName) => (
															<option key={cityName} value={cityName}>
																{cityName}
															</option>
														))
													: county == "Orange"
														? citiesOrange.map((cityName) => (
																<option key={cityName} value={cityName}>
																	{cityName}
																</option>
															))
														: county == "Riverside"
															? citiesRiverside.map((cityName) => (
																	<option key={cityName} value={cityName}>
																		{cityName}
																	</option>
																))
															: county == "San Diego"
																? citiesSanDiego.map((cityName) => (
																		<option key={cityName} value={cityName}>
																			{cityName}
																		</option>
																	))
																: county == "Imperial"
																	? citiesImperial.map((cityName) => (
																			<option key={cityName} value={cityName}>
																				{cityName}
																			</option>
																		))
																	: ""}
						</select>
					</div>
					{/* Weather Selector */}
					<div className="flex items-center font-mono">
						<label className="w-20">Weather:</label>
						<select
							className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={weather}
							onChange={(e) => setWeather(e.target.value)}
						>
							<option value="">All</option>
							<option value="A">Clear</option>
							<option value="B">Cloudy</option>
							<option value="C">Raining</option>
							<option value="D">Snowing</option>
							<option value="E">Fog</option>
							<option value="F">Other</option>
							<option value="G">Wind</option>
						</select>
					</div>
					{/* Lighting Selector */}
					<div className="flex items-center font-mono">
						<label className="w-20">Lighting:</label>
						<select
							className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={lighting}
							onChange={(e) => setLighting(e.target.value)}
						>
							<option value="">All</option>
							<option value="A">Daylight</option>
							<option value="B">Dusk/Dawn</option>
							<option value="C">Dark w/ Street Lights)</option>
							<option value="D">Dark w/o Steet Lights</option>
							<option value="E">Dark w/ Malfunctioning Lights</option>
						</select>
					</div>
					{/* Collision Type Selector */}
					<div className="flex items-center font-mono">
						<label className="w-20">Collision Type:</label>
						<select
							className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							value={collisionType}
							onChange={(e) => setCollisionType(e.target.value)}
						>
							<option value="">All</option>
							<option value="A">Head-On</option>
							<option value="B">Sideswipe</option>
							<option value="C">Rear End</option>
							<option value="D">Broadside</option>
							<option value="E">Hit Object</option>
							<option value="F">Overturned</option>
							<option value="G">Vehicle/Pedestrian</option>
							<option value="H">Other</option>
						</select>
					</div>
					<div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isAlcoholToggled}
								onToggle={() => setAlcoholIsToggled(!isAlcoholToggled)}
							></Switch>
							<h2>Alcohol Involved</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isMotorcycleToggled}
								onToggle={() => setMotorcycleIsToggled(!isMotorcycleToggled)}
							></Switch>
							<h2>Motorcycle Accident</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isHitnRunToggled}
								onToggle={() => setHitnRunIsToggled(!isHitnRunToggled)}
							></Switch>
							<h2>Hit and Run</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isFatalToggled}
								onToggle={() => setFatalIsToggled(!isFatalToggled)}
							></Switch>
							<h2>Fatalities</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isBicycleToggled}
								onToggle={() => setBicycleIsToggled(!isBicycleToggled)}
							></Switch>
							<h2>Bicycle Accident</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isPedestrianToggled}
								onToggle={() => setPedestrianIsToggled(!isPedestrianToggled)}
							></Switch>
							<h2>Pedestrian Accident</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isTruckToggled}
								onToggle={() => setTruckIsToggled(!isTruckToggled)}
							></Switch>
							<h2>Truck Accident</h2>
						</div>
						<div className="flex space-x-4">
							<Switch
								isToggled={isHighwayToggled}
								onToggle={() => setHighwayIsToggled(!isHighwayToggled)}
							></Switch>
							<h2>State Highway</h2>
						</div>
					</div>

					<button
						className="block w-96 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						type="submit"
					>
						Search
					</button>
				</form>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}

			<div className="flex flex-col gap-5">
				<h2>Results:</h2>
				{results.length > 0 ? (
					<ul className="list-none">
						{results.map((result: Accident, index) => (
							<li
								key={index}
								className="mb-4 rounded-lg border bg-gray-800 p-4 shadow-md"
								onClick={() => toggleExpand(index)}
								style={{ cursor: "pointer" }}
							>
								<p className="mx-1">
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

								{/* Conditionally render more details if this item is expanded */}
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
					!loading && (
						<p className="mx-1">No results found for the specified query.</p>
					)
				)}
			</div>
		</div>
	);
};

export default MapPage;
