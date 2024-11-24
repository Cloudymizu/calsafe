import { Card, CardContent } from "@/components/ui/card";

interface InfoCardProps {
	start_date: Date;
	end_date: Date;
	num_datapoints: number;
}

export const InfoCard = ({
	start_date,
	end_date,
	num_datapoints,
}: InfoCardProps) => {
	return (
		<Card className="h-fit">
			<CardContent className="m-0 p-4">
				<div className="whitespace-nowrap break-keep">
					Displaying <span className="font-mono">{num_datapoints}</span> data
					points from:
				</div>

				<div className="my-1 flex flex-col items-center">
					<pre>
						<code>{start_date.toDateString()}</code>
					</pre>
					<span>to</span>
					<pre>
						<code>{end_date.toDateString()}</code>
					</pre>
				</div>
			</CardContent>
		</Card>
	);
};
