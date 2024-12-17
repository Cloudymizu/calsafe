"use server";

import { NavLink } from "@/components/nav-link";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Header = () => {
	return (
		<header className="flex flex-col gap-2 px-6 py-4">
			<div className="flex justify-between">
				<h1 className="self-end text-5xl font-extrabold">CalSafe</h1>

				<div className="flex flex-col gap-5">
					<div className="flex gap-3">
						<Button size="icon">
							<CircleHelp size={36} />
						</Button>
					</div>
				</div>
			</div>

			<Separator className="mt-3" />

			<NavigationMenu className="mx-auto my-3 w-fit rounded-md border-2">
				<NavigationMenuList className="flex justify-between">
					<NavLink href="/">
						<span className="text-2xl">Map</span>
					</NavLink>
					<NavLink href="/query">
						<span className="text-2xl">Query</span>
					</NavLink>
					<NavLink href="/statistics">
						<span className="text-2xl">Statistics</span>
					</NavLink>
					<NavLink href="/predictions">
						<span className="text-2xl">Prediction</span>
					</NavLink>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
};
