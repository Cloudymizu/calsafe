// app/graphs/page.tsx
"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const GraphsPage = () => {

	return (
		<div>
			<div className="h-20 items-center justify-center">
				<h1 className="border-gray-300 text-center font-semibold">
					Calsafe Graphs (Placeholder)
				</h1>
				<h4 className="text-center text-base font-normal text-gray-500">
					Enter details below to get started (Placeholder)
				</h4>
			</div>
		</div>
	);
};

export default GraphsPage;
