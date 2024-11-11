"use server";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const Footer = () => {
	return (
		<>
			<footer className="p-4">
				<Separator className="my-3" />
				<div className="flex flex-col items-center justify-center gap-3">
					<ThemeSwitcher />

					<div className="flex justify-center gap-3">
						<Link href="" className="hover:underline">
							About
						</Link>
						<Link
							href="https://github.com/Cloudymizu/calsafe"
							rel="noopener noreferrer"
							target="_blank"
							className="hover:underline"
						>
							Source Code
						</Link>
					</div>
				</div>
			</footer>
		</>
	);
};
