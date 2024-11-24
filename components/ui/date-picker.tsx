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

interface DatePickerProps {
	date: Date;
	setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
	const [_date, _setDate] = React.useState<Date | undefined>(date);

	React.useEffect(() => {
		if (_date) {
			setDate(_date);
		}
	}, [_date]);

	const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMonth = parseInt(e.target.value, 10);
		if (_date) {
			const updatedDate = new Date(_date);
			updatedDate.setMonth(newMonth);
			if (isDateInRange(updatedDate)) {
				_setDate(updatedDate);
			}
		}
	};

	const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newDay = parseInt(e.target.value, 10);
		if (_date) {
			const updatedDate = new Date(_date);
			updatedDate.setDate(newDay);
			if (isDateInRange(updatedDate)) {
				_setDate(updatedDate);
			}
		}
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newYear = parseInt(e.target.value, 10);
		if (_date) {
			const updatedDate = new Date(_date);
			updatedDate.setFullYear(newYear);
			if (isDateInRange(updatedDate)) {
				_setDate(updatedDate);
			}
		}
	};

	const isDateInRange = (date: Date): boolean => {
		const minDate = new Date(2018, 0, 1); // January 1, 2018
		const maxDate = new Date(2023, 11, 31); // December 31, 2023
		return date >= minDate && date <= maxDate;
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!_date && "text-muted-foreground"
					)}
				>
					{_date ? format(_date, "MMMM dd, yyyy") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-4">
				<div className="flex gap-4">
					{/* Month Dropdown */}
					<select
						value={_date ? _date.getMonth() : 0}
						onChange={handleMonthChange}
						className="border rounded px-3 py-2 w-1/3"
					>
						{Array.from({ length: 12 }, (_, index) => (
							<option key={index} value={index}>
								{format(new Date(2000, index), "MMMM")}
							</option>
						))}
					</select>

					{/* Day Dropdown */}
					<select
						value={_date ? _date.getDate() : 1}
						onChange={handleDayChange}
						className="border rounded px-3 py-2 w-1/3"
					>
						{_date &&
							Array.from(
								{ length: new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate() },
								(_, index) => index + 1
							).map((day) => (
								<option key={day} value={day}>
									{day}
								</option>
							))}
					</select>

					{/* Year Dropdown */}
					<select
						value={_date ? _date.getFullYear() : 2018}
						onChange={handleYearChange}
						className="border rounded px-3 py-2 w-1/3"
					>
						{Array.from({ length: 6 }, (_, index) => 2018 + index).map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>
			</PopoverContent>
		</Popover>
	);
}
