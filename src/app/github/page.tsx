"use client";

import { useEffect } from "react";

export default function GitHubPage() {
	useEffect(() => {
		window.location.href = "https://github.com/dioneapp";
	}, []);

	return null;
}
