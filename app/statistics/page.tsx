// app/page.tsx
"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

interface CrashStatistics {
	total_crashes: number;
	total_injuries: number | null;
	total_fatalities: number | null;
	pedestrian_accidents: number;
	bicycle_accidents: number;
	motorcycle_accidents: number;
	truck_accidents: number;
	alcohol_related: number;
}

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

const StatisticsPage = () => {
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [statistics, setStatistics] = useState<CrashStatistics | null>(null);

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
		let queryUrl = `${API_BASE_URL}/api/statistics/?start_date=${startDate}&end_date=${endDate}&county=${county}`;
		if (city !== "") {
			queryUrl = `${queryUrl}&city=${city}`;
		}

		console.log("Query URL:", queryUrl);

		if (county === "") {
			setError("Please select a county...");
		} else {
			setLoading(true);
			try {
				const response = await fetch(queryUrl);

				// Handle 404 errors
				if (response.status === 404) {
					setError("No accident data found for the specified query.");
					setStatistics(null); // Clear previous statistics
					return;
				}

				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				const data: CrashStatistics = await response.json();
				setStatistics(data); // Set statistics with the retrieved data
			} catch (err) {
				setError("An error occurred while fetching the data.");
				console.error("Fetch error:", err);
			} finally {
				setLoading(false); // Stop loading spinner
			}
		}
	};

	return (
		<div>
			<div className="h-20 items-center justify-center">
				<h1 className="border-gray-300 text-center font-semibold">
					Calsafe Statistics
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
				{loading && <p>Loading...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}

				{statistics ? (
					<ul>
						<li>Total Crashes: {statistics.total_crashes}</li>
						<li>Total Injuries: {statistics.total_injuries}</li>
						<li>Total Fatalities: {statistics.total_fatalities}</li>
						<li>Pedestrian Accidents: {statistics.pedestrian_accidents}</li>
						<li>Bicycle Accidents: {statistics.bicycle_accidents}</li>
						<li>Motorcycle Accidents: {statistics.motorcycle_accidents}</li>
						<li>Truck Accidents: {statistics.truck_accidents}</li>
						<li>Alcohol-Related Accidents: {statistics.alcohol_related}</li>
					</ul>
				) : (
					!loading && <p>No statistics available for the specified query.</p>
				)}
			</div>
		</div>
	);
};

export default StatisticsPage;
