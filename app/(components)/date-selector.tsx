import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface DateSelectorProps {
    startDate: Date;
    endDate: Date;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
}

export const DateSelector = ({ startDate, endDate, setStartDate, setEndDate }: DateSelectorProps) => {
    const validateDateRange = (start: Date, end: Date): boolean => {
        return start <= end; // Ensure start date is before or equal to the end date
    };

    const handleStartDateChange = (date: Date) => {
        if (validateDateRange(date, endDate)) {
            setStartDate(date); // Update only if valid
        } else {
            console.error("Start date cannot be after the end date.");
        }
    };

    const handleEndDateChange = (date: Date) => {
        if (validateDateRange(startDate, date)) {
            setEndDate(date); // Update only if valid
        } else {
            console.error("End date cannot be before the start date.");
        }
    };

    return (
        <Card className="w-fit">
            <CardHeader>
                <h1 className="m-0 text-2xl font-bold">Date Range</h1>
            </CardHeader>

            <CardContent
                className="grid gap-3"
                style={{ gridTemplateColumns: "min-content 1fr" }}
            >
                <Label className="my-auto h-fit">From</Label>
                <DatePicker date={startDate} setDate={handleStartDateChange} />

                <Label className="my-auto h-fit">To</Label>
                <DatePicker date={endDate} setDate={handleEndDateChange} />
            </CardContent>
        </Card>
    );
};
