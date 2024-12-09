import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";

interface AreaSelectorProps {
	locations: County[];
	currentLocation: CountyAndCity;
	setCurrentLocation: (location: CountyAndCity) => void;
}
export const AreaSelector = (props: AreaSelectorProps) => {
	return (
		<>
			<Card className="w-fit">
				<CardHeader>
					<h1 className="m-0 text-2xl font-bold">Location</h1>
				</CardHeader>

				<CardContent>
					<Label htmlFor="county-select">County</Label>
					<Select
						value={props.currentLocation.county}
						onValueChange={(c) =>
							props.setCurrentLocation({ ...props.currentLocation, county: c, city: "" })
						}
					>
						<SelectTrigger id="county-select">
							<SelectValue placeholder="Select a county" />
						</SelectTrigger>
						<SelectContent className="max-h-60 overflow-y-auto">
							{props.locations.map((location) => (
								<SelectItem key={nanoid()} value={location.name}>
									{location.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Label htmlFor="city-select">City</Label>
					<Select
						value={props.currentLocation.city}
						onValueChange={(c) =>
							props.setCurrentLocation({ ...props.currentLocation, city: c })
						}
					>
						<SelectTrigger id="city-select">
							<SelectValue placeholder="Select a city" />
						</SelectTrigger>
						<SelectContent>
							{props.currentLocation.county &&
								props.locations
									.find((l) => l.name === props.currentLocation.county)
									?.cities.map((city) => (
										<SelectItem key={nanoid()} value={city}>
											{city}
										</SelectItem>
									))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>
		</>
	);
};
