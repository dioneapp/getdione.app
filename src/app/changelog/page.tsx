"use client";

import { useEffect, useState } from "react";
import { getReleases, Release } from "@/app/server/changelog";
import ChangelogLayout from "@/components/changelog/ChangelogLayout";
import ReleaseList from "@/components/changelog/ReleaseList";

export default function ChangelogPage() {
	const [releases, setReleases] = useState<Release[]>([]);

	useEffect(() => {
		async function fetchReleases() {
			const result = await getReleases();
			setReleases(result.data || []);
		}

		fetchReleases();
	}, []);

	return (
		<ChangelogLayout>
			<ReleaseList releases={releases} />
		</ChangelogLayout>
	);
}