"use client";

import { useEffect } from "react";

export default function DocsPage() {
    useEffect(() => {
        window.location.href = "https://docs.getdione.app";
    }, []);

    return (
        <div className="h-screen w-screen">

        </div>
    );
}
