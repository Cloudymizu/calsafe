"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { nanoid } from "nanoid";

// util
const getAllMonths = () => {
	return Array.from({ length: 12 }, (_, i) => {
		const date = new Date(1970, i, 1); // Create a date for the first day of each month
		return format(date, "MMMM"); // Full month name (e.g., "January")
	});
};

interface DatePickerProps {
	date: Date;
	setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
	const [_date, _setDate] = React.useState<Date>(date);

	useEffect(() => {
		// Ensure the default date is within the valid range
		if (!isDateInRange(date)) {
			const validDate = validateDate(date);
			_setDate(validDate);
			setDate(validDate);
		} else {
			_setDate(date);
		}
	}, [date, setDate]);

	const handleDateChange = (type: "month" | "day" | "year", value: number) => {
		if (_date) {
			const updatedDate = new Date(_date);

			if (type === "month") updatedDate.setMonth(value);
			if (type === "day") updatedDate.setDate(value);
			if (type === "year") updatedDate.setFullYear(value);

			const validDate = validateDate(updatedDate);
			_setDate(validDate);
			setDate(validDate);
		}
	};

	const isDateInRange = (date: Date): boolean => {
		const minDate = new Date(2018, 0, 1); // January 1, 2018
		const maxDate = new Date(2023, 11, 31); // December 31, 2023
		return date >= minDate && date <= maxDate;
	};

	const validateDate = (date: Date): Date => {
		const minDate = new Date(2018, 0, 1);
		const maxDate = new Date(2023, 11, 31);

		if (date < minDate) return minDate;
		if (date > maxDate) return maxDate;
		return date;
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!_date && "text-muted-foreground",
					)}
				>
					{_date ? format(_date, "MMMM dd, yyyy") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-4">
				<div className="flex gap-4">
					{/* Month Dropdown */}
					<select
						value={_date.getMonth()}
						onChange={(e) =>
							handleDateChange("month", Number.parseInt(e.target.value, 10))
						}
						className="w-1/3 rounded border px-3 py-2"
					>
						{Array.from({ length: 12 }, (_, index) => (
							<option key={nanoid()} value={index}>
								{format(new Date(2000, index), "MMMM")}
							</option>
						))}
					</select>

					{/* Day Dropdown */}
					<select
						value={_date.getDate()}
						onChange={(e) =>
							handleDateChange("day", Number.parseInt(e.target.value, 10))
						}
						className="w-1/3 rounded border px-3 py-2"
					>
						{Array.from(
							{
								length: new Date(
									_date.getFullYear(),
									_date.getMonth() + 1,
									0,
								).getDate(),
							},
							(_, index) => index + 1,
						).map((day) => (
							<option key={day} value={day}>
								{day}
							</option>
						))}
					</select>

					{/* Year Dropdown */}
					<select
						value={_date.getFullYear()}
						onChange={(e) =>
							handleDateChange("year", Number.parseInt(e.target.value, 10))
						}
						className="w-1/3 rounded border px-3 py-2"
					>
						{Array.from({ length: 6 }, (_, index) => 2018 + index).map(
							(year) => (
								<option key={year} value={year}>
									{year}
								</option>
							),
						)}
					</select>
				</div>
			</PopoverContent>
		</Popover>
	);
}
