'use client'

import {Session} from "next-auth";
import {SignIn, SignOut} from "@/components/steam-buttons/buttons";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Home, UnfoldLessOutlined, UnfoldMoreOutlined, VideogameAsset} from "@mui/icons-material";
import classNames from "classnames";

interface SideNavProps {
    session: Session | null
}

interface SideNavLink {
    label?: string;
    href: string;
    icon: React.ReactElement;
}

const links = [
    {label: "Home", href: "/", icon: <Home/>},
    {label: "Games", href: "/games", icon: <VideogameAsset/>},
]

const transitionStyle: string = "transition-all duration-700 ease-in-out";

function SideNavButton({link: {href, label, icon}, expanded}: { link: SideNavLink, expanded: boolean }) {
    return <Link href={href} className={"no-underline"}>
        <div
            className={classNames("bg-black text-white w-full text-center border-8 rounded-2xl hover:bg-gray-900 hover:italic",
                transitionStyle,
                {
                    "pl-8 pr-8 pt-4 pb-4 text-2xl": expanded,
                    "aspect-square flex flex-col h-full": !expanded
                })}>
            <div className={"m-auto"}>{icon}</div>
            {label ? <p className={classNames(transitionStyle, {
                "hidden": !expanded
            })}>{label}</p> : null}
        </div>
    </Link>
}

export function SideNav({session}: SideNavProps) {
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        setExpanded(window.innerWidth > 1000)
    }, [setExpanded])


    return <div
        className={classNames("flex grow flex-col h-full bg-amber-800 items-center justify-start gap-7",
            transitionStyle,
            {
                "p-8": expanded,
                "p-4": !expanded
            })}>
        <h1 className={classNames("font-bold",
            transitionStyle, {
                'text-4xl': expanded,
                'text-xs': !expanded
            })}>Achievemint</h1>
        <div className={"w-full flex grow flex-col gap-10"}>{
            links.map((link, index) => <SideNavButton
                key={index}
                expanded={expanded}
                link={link}/>)
        }</div>
        <div className={"rotate-90"} onClick={() => setExpanded(!expanded)}>{expanded ? <UnfoldLessOutlined/> :
            <UnfoldMoreOutlined/>}</div>
        <div>{session ? <SignOut/> : <SignIn/>}</div>
    </div>
}