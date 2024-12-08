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

interface County {
	name: string;
	cities: string[];
}

interface CountyAndCity {
	county: string;
	city: string;
}

interface Predictions{
	lat: number | null;
	lon: number | null;
	rad: number | null;
}
