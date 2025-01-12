'use client'
import React from "react";
import dynamic from "next/dynamic";


const ClientSideLanding =
    dynamic(() => import("../components/welcome-landing/welcome-landing"), {ssr: false});

export default function Home() {
    return <ClientSideLanding />
}
