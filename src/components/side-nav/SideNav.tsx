import {Session} from "next-auth";
import {SignIn, SignOut} from "@/components/steam-buttons/buttons";
import Link from "next/link";
import React from "react";
import {Home} from "@mui/icons-material";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

interface SideNavProps {
    session: Session | null
}

interface SideNavLink {
    label: string;
    href: string;
    icon: React.ReactElement;
}

const links = [
    {label: "Home", href: "/", icon: <Home/>},
    {label: "Games", href: "/games", icon: <VideogameAssetIcon/>},
]

function SideNavButton({link: {href, label, icon}}: { link: SideNavLink }) {
    return <Link href={href} className={"no-underline"}>
        <div
            className={"bg-black text-white w-full text-center border-8 pl-8 pr-8 pt-4 pb-4 rounded-2xl text-2xl hover:bg-gray-900 hover:italic"}>
            {icon}
            <p>{label}</p>
        </div>
    </Link>
}

export function SideNav({session}: SideNavProps) {
    return <div className={"flex grow flex-col h-full bg-amber-800 items-center justify-start p-8 gap-7"}>
        <h1 className={"text-4xl font-bold"}>Achievemint</h1>
        <div className={"w-full flex grow flex-col gap-10"}>{
            links.map((link, index) => <SideNavButton
                key={index}
                link={link}/>)
        }</div>
        <div>{session ? <SignOut/> : <SignIn/>}</div>
    </div>
}