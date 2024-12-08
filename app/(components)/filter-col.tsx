import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Filters {
	alcohol: boolean;
	motorcycle: boolean;
	hitAndRun: boolean;
	fatal: boolean;
	bicycleAccident: boolean;
	pedestrianAccident: boolean;
	truckAccident: boolean;
	stateHighway: boolean;
	usePredictions: boolean;
}
interface FilterColProps {
	filters: Filters;
	setFilters: (filters: Filters) => void;
	updateFilters: () => void;
	clearFilters: () => void;
}
export const FilterCol = (props: FilterColProps) => {
	return (
		<>
			<Card>
				<CardHeader className="mb-0 border-b-2 px-2 py-1">
					<h1 className="m-0 text-2xl font-bold">Filters</h1>
				</CardHeader>

				<CardContent className="p-0">
					<ScrollArea className="h-96">
						<div
							className="grid h-full gap-2 px-5 py-2"
							style={{
								gridTemplateColumns: "1fr min-content",
							}}
						>
							<Label htmlFor="alcohol-toggle">Alcohol</Label>
							<Switch
								id="alcohol-toggle"
								checked={props.filters.alcohol}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, alcohol: e })
								}
							></Switch>

							<Label htmlFor="motorcycle-toggle">Motorcycle</Label>
							<Switch
								id="motorcycle-toggle"
								checked={props.filters.motorcycle}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, motorcycle: e })
								}
							></Switch>

							<Label htmlFor="hit-and-run-toggle">Hit and Run</Label>
							<Switch
								id="hit-and-run-toggle"
								checked={props.filters.hitAndRun}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, hitAndRun: e })
								}
							></Switch>

							<Label htmlFor="fatal-toggle">Fatal</Label>
							<Switch
								id="fatal-toggle"
								checked={props.filters.fatal}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, fatal: e })
								}
							></Switch>

							<Label htmlFor="bicycle-accident-toggle">Bicycle Accident</Label>
							<Switch
								id="bicycle-accident-toggle"
								checked={props.filters.bicycleAccident}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, bicycleAccident: e })
								}
							></Switch>

							<Label htmlFor="pedestrian-accident-toggle">
								Pedestrian Accident
							</Label>
							<Switch
								id="pedestrian-accident-toggle"
								checked={props.filters.pedestrianAccident}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, pedestrianAccident: e })
								}
							></Switch>

							<Label htmlFor="truck-accident-toggle">Truck Accident</Label>
							<Switch
								id="truck-accident-toggle"
								checked={props.filters.truckAccident}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, truckAccident: e })
								}
							></Switch>

							<Label htmlFor="state-highway-toggle">State Highway</Label>
							<Switch
								id="state-highway-toggle"
								checked={props.filters.stateHighway}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, stateHighway: e })
								}
							></Switch>

							<Label htmlFor="use-predictions-toggle">Use Predictions</Label>
							<Switch
								id="use-predictions-toggle"
								checked={props.filters.usePredictions}
								onCheckedChange={(e) =>
									props.setFilters({ ...props.filters, usePredictions: e })
								}
							></Switch>
						</div>
					</ScrollArea>
				</CardContent>

				<CardFooter className="flex flex-row justify-end gap-2 border-t-2 p-2">
					<Button variant="destructive" onClick={props.updateFilters}>
						Clear
					</Button>
					<Button onClick={() => props.updateFilters()}>Update</Button>
				</CardFooter>
			</Card>
		</>
	);
};
