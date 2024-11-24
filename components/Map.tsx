/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

// Import MarkerClusterGroup for clustering functionality
import MarkerClusterGroup from "react-leaflet-markercluster";

// Configure Leaflet's default marker icons
L.Icon.Default.mergeOptions({
	iconUrl: "/images/leaflet/marker-icon.png",
	iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
	shadowUrl: "/images/leaflet/marker-shadow.png",
});

// Define TypeScript interfaces for Accident, Location, Severity, and Environment
interface Location {
	point_x: number | null;
	point_y: number | null;
	primary_rd: string | null;
	secondary_rd: string | null;
	city: string | null;
}

interface Severity {
	collision_severity: string | null;
	number_killed: number | null;
	number_injured: number | null;
}

interface Environment {
	weather_1: string | null;
	road_surface: string | null;
	lighting: string | null;
}

interface Accident {
	case_id: number;
	collision_date: string;
	collision_time: string | null;
	location: Location;
	severity: Severity;
	environment: Environment;
	hit_and_run: string | null;
	type_of_collision: string | null;
	pedestrian_accident: string | null;
	bicycle_accident: string | null;
	motorcycle_accident: string | null;
	truck_accident: string | null;
	alcohol_involved: string | null;
}

interface MapProps {
	accidents?: Accident[]; // Pass accidents as a prop
}

const Map: React.FC<MapProps> = ({ accidents }) => {
	const defaultCenter: [number, number] = [34.055, -118.24];
	const defaultZoom = 10;

	return (
		<MapContainer
			center={defaultCenter}
			zoom={defaultZoom}
			style={{ height: "75vh", width: "100%" }}
		>
			{/* Tile Layer */}
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{/* Marker Clusters */}
			<MarkerClusterGroup {...(undefined as any)}>
				{accidents &&
					accidents
						.filter(
							(accident) =>
								accident.location.point_x &&
								accident.location.point_y &&
								!isNaN(accident.location.point_x) &&
								!isNaN(accident.location.point_y) &&
								accident.location.point_y >= -90 &&
								accident.location.point_y <= 90 &&
								accident.location.point_x >= -180 &&
								accident.location.point_x <= 180,
						)
						.map((accident) => {
							const {
								case_id,
								collision_date,
								collision_time,
								location,
								severity,
								environment,
								hit_and_run,
								type_of_collision,
								pedestrian_accident,
								bicycle_accident,
								motorcycle_accident,
								truck_accident,
								alcohol_involved,
							} = accident;

							const { point_x, point_y, primary_rd, secondary_rd, city } =
								location;

							return (
								<Marker
									key={case_id}
									position={[point_y as number, point_x as number]}
								>
									<Popup>
										<strong>Date:</strong>{" "}
										{new Date(collision_date).toLocaleDateString()}
										<br />
										<strong>Time:</strong> {collision_time || "Unknown"}
										<br />
										<strong>Severity:</strong>{" "}
										{severity.collision_severity === "1"
											? "Fatal"
											: severity.collision_severity === "2"
												? "Severe Injury"
												: severity.collision_severity === "3"
													? "Minor/Visible Injury"
													: severity.collision_severity === "4"
														? "Complaint of Pain"
														: "Property Damage Only"}
										<br />
										<strong>Number Killed:</strong>{" "}
										{severity.number_killed || 0}
										<br />
										<strong>Number Injured:</strong>{" "}
										{severity.number_injured || 0}
										<br />
										<strong>Weather Conditions:</strong>{" "}
										{environment.weather_1 === "A"
											? "Clear"
											: environment.weather_1 === "C"
												? "Raining"
												: environment.weather_1 === "E"
													? "Fog"
													: environment.weather_1 === "D"
														? "Snowing"
														: "Other"}
										<br />
										<strong>Road Conditions:</strong>{" "}
										{environment.road_surface === "A"
											? "Dry"
											: environment.road_surface === "B"
												? "Wet"
												: environment.road_surface === "C"
													? "Snowy or Icy"
													: environment.road_surface === "D"
														? "Slippery (Muddy, Oily, etc.)"
														: "Not Stated"}
										<br />
										<strong>Road Lighting:</strong>{" "}
										{environment.lighting === "A"
											? "Daylight"
											: environment.lighting === "B"
												? "Dawn/Dusk"
												: environment.lighting === "C"
													? "Dark w/ Street Lamps"
													: environment.lighting === "D"
														? "Dark w/o Street Lamps"
														: environment.lighting === "E"
															? "Dark w/ Inoperable Lamps"
															: "Not Stated"}
										<br />
										<strong>Location:</strong> {primary_rd || "Unknown"} and{" "}
										{secondary_rd || "Unknown"}
										<br />
										<strong>City:</strong> {city || "Unknown"}
										<br />
										<strong>Hit and Run:</strong>{" "}
										{hit_and_run === "M"
											? "Misdemeanor"
											: hit_and_run === "F"
												? "Felony"
												: "No"}
										<br />
										<strong>Type of Collision:</strong>{" "}
										{type_of_collision === "A"
											? "Head-On"
											: type_of_collision === "B"
												? "Sideswipe"
												: type_of_collision === "C"
													? "Rear-End"
													: type_of_collision === "D"
														? "Broadside"
														: type_of_collision === "E"
															? "Hit Object"
															: type_of_collision === "F"
																? "Roll-Over"
																: type_of_collision === "G"
																	? "Vehicle/Pedestrian"
																	: "Other or Not Stated"}
										<br />
										<strong>Alcohol Involved:</strong>{" "}
										{alcohol_involved === "Y" ? "Yes" : "No"}
										<br />
										<strong>Pedestrian Involved:</strong>{" "}
										{pedestrian_accident === "Y" ? "Yes" : "No"}
										<br />
										<strong>Motorcycle Involved:</strong>{" "}
										{motorcycle_accident === "Y" ? "Yes" : "No"}
										<br />
										<strong>Bicycle Involved:</strong>{" "}
										{bicycle_accident === "Y" ? "Yes" : "No"}
										<br />
										<strong>Truck Involved:</strong>{" "}
										{truck_accident === "Y" ? "Yes" : "No"}
									</Popup>
								</Marker>
							);
						})}
			</MarkerClusterGroup>
		</MapContainer>
	);
};

export default Map;
