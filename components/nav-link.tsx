"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import {
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import clsx from "clsx";

interface NavLinkProps extends PropsWithChildren {
	href: string;
}
export const NavLink = ({ href, children }: NavLinkProps) => {
	const pathname = usePathname();

	return (
		<NavigationMenuItem>
			<Link href={href} legacyBehavior passHref>
				<NavigationMenuLink
					className={clsx([
						navigationMenuTriggerStyle(),

						{
							"font-extrabold": pathname === href,
						},
					])}
				>
					{children}
				</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	);
};
