import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface YearlyData {
	year: number;
	data: {
		total_crashes: number;
		total_injuries: number | null;
		total_fatalities: number | null;
		pedestrian_accidents: number;
		bicycle_accidents: number;
		motorcycle_accidents: number;
		truck_accidents: number;
		alcohol_related: number;
	};
}

interface SummaryItemProps {
	yearData: YearlyData;
}

export const SummaryItem = ({ yearData }: SummaryItemProps) => {
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold">{yearData.year}</CardTitle>
				</CardHeader>
				<CardContent className="p-2">
					<div className="flex flex-col gap-3">
						<div className="flex w-full flex-row items-start justify-center gap-2">
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Summary</TableHead>
											<TableHead>Count</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableHead>Injuries</TableHead>
											<TableCell>
												{yearData.data.total_injuries ?? "N/A"}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableHead>Fatalities</TableHead>
											<TableCell>
												{yearData.data.total_fatalities ?? "N/A"}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Other</TableHead>
											<TableHead>Count</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableHead>Alcohol-Related</TableHead>
											<TableCell>{yearData.data.alcohol_related}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Accident Type</TableHead>
										<TableHead>Count</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableHead>Pedestrian</TableHead>
										<TableCell>{yearData.data.pedestrian_accidents}</TableCell>
									</TableRow>
									<TableRow>
										<TableHead>Bicycle</TableHead>
										<TableCell>{yearData.data.bicycle_accidents}</TableCell>
									</TableRow>
									<TableRow>
										<TableHead>Motorcycle</TableHead>
										<TableCell>{yearData.data.motorcycle_accidents}</TableCell>
									</TableRow>
									<TableRow>
										<TableHead>Truck</TableHead>
										<TableCell>{yearData.data.truck_accidents}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col">
					<Separator className="my-4" />
					<span>
						<strong className="mr-1">Total Crashes:</strong>
						{yearData.data.total_crashes}
					</span>
				</CardFooter>
			</Card>
		</>
	);
};
