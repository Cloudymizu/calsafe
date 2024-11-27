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
	road_cond_1: string | null;
}

interface Victim {
	victim_degree_of_injury: string | null;
	victim_ejected: string | null;
	victim_role: string | null;
	victim_safety_equip_1: string | null;
	victim_sex: string | null;
	victim_age: number | null;
  }
  
  interface Party {
	party_sobriety: string | null;
	party_drug_physical: string | null;
	party_safety_equip_1: string | null;
	party_sex: string | null;
	party_age: number | null;
	party_type: string | null;
	at_fault: string | null;
	finan_respons: string | null;
	stwd_vehicle_type: string | null;
	inattention: string | null;
	move_pre_acc: string | null;
	race: string | null;
	vehicle_year: number | null;
	vehicle_make: string | null;
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
	victims: Victim[];
	parties: Party[];
}

interface MapProps {
	accidents?: Accident[]; // Pass accidents as a prop
}

const victimDegreeMap: { [key: string]: string } = {
  "1": "Fatal",
  "2": "Severe Injury",
  "3": "Minor/Visible Injury",
  "4": "Complaint of Pain",
  "5": "Suspected Serious Injury",
  "6": "Suspected Minor Injury",
  "7": "Possible Injury",
  "0": "No Injury",
  "": "Unknown",
};

const safetyEquipMap: { [key: string]: string } = {
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

  const partySobrietyMap: { [key: string]: string } = {
    A: "Had Not Been Drinking",
    B: "Had Been Drinking, Under Influence",
    C: "Had Been Drinking, Not Under Influence",
    D: "Had Been Drinking, Impairment Unknown",
    G: "Impairment Unknown",
    H: "Not Applicable",
    "": "Unknown",
  }

  const partyDrugPhysicalMap: { [key: string]: string } = {
    E: "Under Drug Influence",
    F: "Impairment - Physical",
    G: "Impairment Unknown",
    H: "Not Applicable",
    I: "Sleepy/Fatigued",
    "": "Not Stated",
  }

  const finanResponsMap: { [key: string]: string } = {
    N: "No Proof of Insurance Obtained",
    Y: "Yes, Proof of Insurance Obtained",
    O: "Not Applicable",
    E: "Called Away Before Obtaining Insurance",
    "": "Not Stated",
  }

  const vehicleTypeMap: { [key: string]: string } = {
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

  const inattentionMap: { [key: string]: string } = {
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

  const movePreAccMap: { [key: string]: string } = {
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
										<div
											style={{
												maxWidth: "400px",
												maxHeight: "400px", 
												overflowY: "auto",
												backgroundColor: "rgba(255, 255, 255, 0.8)",
												padding: "10px",
												borderRadius: "8px",
												boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
											}}
										>
											{/* Accident */}
											<div>
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
												<strong>Road Surface:</strong>{" "}
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
												<strong>Road Conditions:</strong>{" "}
												{environment.road_cond_1 == "A"
													? "Potholes"
													: environment.road_cond_1 == "B"
														? "Loose Materials on Road"
														: environment.road_cond_1 == "C"
															? "Obstruction on Road"
															: environment.road_cond_1 == "D"
																? "Construction Zone"
																: environment.road_cond_1 == "E"
																	? "Reduced Width"
																	: environment.road_cond_1 == "F"
																		? "Flooded"
																		: environment.road_cond_1 == "H"
																			? "No Unsual Conditions"
																			: "Other/Not Stated"}
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
											</div>

											<hr style={{ margin: "10px 0", borderColor: "rgba(0, 0, 0, 0.2)" }} />

											{/* Victims and Parties */}
											<br />
											<br />
											{accident.victims && accident.victims.length > 0 && (
												<>
												<div>
													<strong>Victims:</strong>
													<ul>
														{accident.victims.map((victim, index) => (
														<li key={index}>
															<br />
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
															<br />
															<strong>Victim Age:</strong> {victim.victim_age}
															<br />
															<strong>Victim Sex:</strong> {victim.victim_sex}
															<br />
															<strong>Degree of Injury:</strong>{" "}
															{victim.victim_degree_of_injury ? victimDegreeMap[victim.victim_degree_of_injury] : "Unknown"}
															<br />
															<strong>Safety Equipment:</strong>{" "}
															{safetyEquipMap[victim.victim_safety_equip_1 ?? ""] || "Unknown"}
															<br />
															<strong>Victim Ejected:</strong>{" "} 
																{victim.victim_ejected === "0" 
																	? "Not Ejected"
																	: victim.victim_ejected === "1" 
																		? "Fully Ejected"
																		: victim.victim_ejected === "2" 
																			? "Partially Ejected"
																			:  "Unknown"}
															<br />
															
														</li>
														))}
													</ul>
												</div>

												<hr style={{ margin: "10px 0", borderColor: "rgba(0, 0, 0, 0.2)" }} />

												</>
											)}
											<br />
											{accident.parties && accident.parties.length > 0 && (
												<>
												<div>
													<strong>Parties:</strong>
													<ul>
														{accident.parties.map((party, index) => (
														<li key={index}>
															<br />
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
															<br />
															<strong>At Fault:</strong>{" "}
																{party.at_fault === "Y" ? "Yes" : "No"}
															<br />
															<strong>Party Age:</strong> {party.party_age}
															<br />
															<strong>Party Sex:</strong> {party.party_sex}
															<br />
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
															<br />
															<strong>Vehicle Year/Make:</strong> {party.vehicle_year} {party.vehicle_make}
															<br />
															<strong>Vehicle Type:</strong>{" "}
															{party.stwd_vehicle_type ? vehicleTypeMap[party.stwd_vehicle_type] : "Unknown"}
															<br />
															<strong>Sobriety:</strong>{" "}
															{party.party_sobriety ? partySobrietyMap[party.party_sobriety] : "Unknown"}
															<br />
															<strong>Drug/Physical Impairment:</strong>{" "}
															{party.party_drug_physical ? partyDrugPhysicalMap[party.party_drug_physical] : "Unknown"}
															<br />
															<strong>Safety Equipment:</strong>{" "}
															{party.party_safety_equip_1 ? safetyEquipMap[party.party_safety_equip_1] : "Unknown"}
															<br />
															<strong>Financial Responsibility:</strong>{" "}
															{party.finan_respons ? finanResponsMap[party.finan_respons] : "Unknown"}
															<br />
															<strong>Inattention:</strong>{" "}
															{party.inattention ? inattentionMap[party.inattention] : "Unknown"}
															<br />
															<strong>Movement Preceding Accident:</strong>{" "}
															{party.move_pre_acc ? movePreAccMap[party.move_pre_acc] : "Unknown"}
														</li>
														))}
													</ul>
												</div>
												</>
											)}
										</div>
									</Popup>
								</Marker>
							);
						})}
			</MarkerClusterGroup>
		</MapContainer>
	);
};

export default Map;
