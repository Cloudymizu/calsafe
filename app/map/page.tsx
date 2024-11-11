// app/map/page.tsx

"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

const MapPage = () => {
	return (
		<div>
			<Map />
		</div>
	);
};

export default MapPage;
