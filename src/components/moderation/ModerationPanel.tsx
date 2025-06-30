"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSession from "@/utils/supabase/use-session";
import UsersTab from "./UsersTab";
import ScriptsTab from "./ScriptsTab";

const TABS = [
	{ id: "users", label: "Users" },
	{ id: "scripts", label: "Scripts" },
] as const;

export default function ModerationPanel() {
	const router = useRouter();
	const { session, profile, isLoading, error: sessionError } = useSession();
	const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("users");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isLoading) return;
		if (!session?.user) {
			router.push("/auth/login");
			return;
		}
		if (!profile?.moderator) {
			router.push("/404");
			return;
		}
	}, [session, profile, isLoading, router]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
				<div className="h-fit w-full flex max-w-xl">
					<div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
						<h1 className="text-white text-3xl font-semibold">Loading...</h1>
					</div>
				</div>
			</div>
		);
	}

	if (error || sessionError) {
		return (
			<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
				<div className="h-fit w-full flex max-w-xl">
					<div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
						<h1 className="text-white text-3xl font-semibold">Error</h1>
						<p className="mt-2 text-red-400">{error || sessionError?.message}</p>
						<button
							onClick={() => router.push("/")}
							className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
						>
							Return Home
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!profile?.moderator) return null;

	return (
		<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-4 sm:p-12 pt-32 sm:pt-36 relative">
			<div className="h-fit w-full flex max-w-7xl">
				<div className="w-full h-full group p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg shadow-black/10">
					<div className="mb-6 sm:mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-white">Moderation Panel</h1>
						<p className="text-white/60 mt-2 text-sm sm:text-base">Manage users, scripts, and track actions</p>
					</div>
					<div className="flex gap-4 border-b border-white/10 mb-8">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-4 py-2 -mb-px cursor-pointer ${activeTab === tab.id ? "border-b-2 border-white text-white" : "text-white/60 hover:text-white"}`}
							>
								{tab.label}
							</button>
						))}
					</div>
					<div className="bg-white/5 rounded-lg p-6">
						{activeTab === "users" && <UsersTab />}
						{activeTab === "scripts" && <ScriptsTab />}
					</div>
				</div>
			</div>
		</div>
	);
} 