import {
	AreaChart,
	Area,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

type AccidentData = {
	data: {
		year: number;
		total: number | null;
	}[];
};

export function AccidentsByYear({ data }: AccidentData) {
	return (
		<div>
			<ResponsiveContainer width="100%" minHeight={300}>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#3f77d1" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#3f77d1" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="year" />
					<YAxis
						type="number"
						domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
					/>
					<Tooltip cursor={false} />
					<Area
						dataKey="total"
						type="monotone"
						stroke="#3f77d1"
						fillOpacity={1}
						fill="url(#fill)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
