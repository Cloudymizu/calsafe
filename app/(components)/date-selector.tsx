import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface DateSelectorProps {
	startDate: Date;
	endDate: Date;
	setStartDate: (date: Date) => void;
	setEndDate: (date: Date) => void;
}
export const DateSelector = ({ ...props }: DateSelectorProps) => {
	return (
		<>
			<Card className="w-fit">
				<CardHeader>
					<h1 className="m-0 text-2xl font-bold">Date Range</h1>
				</CardHeader>

				<CardContent
					className="grid gap-3"
					style={{ gridTemplateColumns: "min-content 1fr" }}
				>
					<Label className="my-auto h-fit">From</Label>
					<DatePicker date={props.startDate} setDate={props.setStartDate} />

					<Label className="my-auto h-fit">To</Label>
					<DatePicker date={props.endDate} setDate={props.setEndDate} />
				</CardContent>
			</Card>
		</>
	);
};
