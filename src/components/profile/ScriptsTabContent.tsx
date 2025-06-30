import type React from "react";

interface ScriptsTabContentProps {
	setShowScriptModal: (v: boolean | any) => void;
	scriptSuccess: string;
	scriptError: string;
	scriptsLoading: boolean;
	userScripts: any[];
	setDeleteId: (id: string | null) => void;
	deleteId: string | null;
	handleDeleteScript: (id: string) => void;
}

const ScriptsTabContent: React.FC<ScriptsTabContentProps> = ({
	setShowScriptModal,
	scriptSuccess,
	scriptError,
	scriptsLoading,
	userScripts,
	setDeleteId,
	deleteId,
	handleDeleteScript,
}) => (
	<section className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
		<header>
			<h2 className="text-2xl font-bold text-white mb-1">Your Scripts</h2>
			<p className="text-white/70 text-base">
				Submit and manage your scripts for review and approval.
			</p>
		</header>
		<section className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-2 shadow-lg">
			<h3 className="text-lg font-semibold text-white">List of Scripts</h3>
			{scriptSuccess && (
				<div className="text-green-500 text-sm text-center">
					{scriptSuccess}
				</div>
			)}
			{scriptError && (
				<div className="text-red-500 text-sm text-center">{scriptError}</div>
			)}
			{scriptsLoading ? (
				<div className="text-white/70 text-sm text-center">
					Loading your scripts...
				</div>
			) : userScripts.length === 0 ? (
				<div className="text-white/70 text-sm text-left">
					You haven't submitted any scripts yet. Click below to submit your
					first one.
				</div>
			) : (
				<ul className="flex flex-col gap-2">
					{userScripts.map((s) => (
						<li
							key={s.id}
							className="flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-2"
						>
							<div className="flex flex-col">
								<span className="text-white font-semibold">
									{s.name}{" "}
									<span className="text-xs text-white/50">v{s.version}</span>
								</span>
								{s.status === "pending" && (
									<span className="text-xs text-yellow-500">
										Pending Review
									</span>
								)}
								{s.status === "approved" && (
									<span className="text-xs text-green-500">Approved</span>
								)}
								{s.status === "denied" && (
									<span className="text-xs text-red-500">Denied</span>
								)}
								{s.status === "denied" && s.review_feedback && (
									<span className="text-xs text-red-400">
										Feedback: {s.review_feedback}
									</span>
								)}
							</div>
							<div className="flex gap-2">
								<button
									className="text-xs text-blue-400 hover:text-blue-200 px-2 py-1 rounded transition"
									onClick={() => setShowScriptModal(s)}
								>
									Edit
								</button>
								<button
									className="text-xs text-red-400 hover:text-red-200 px-2 py-1 rounded transition"
									onClick={() => setDeleteId(s.id)}
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
		<button
			onClick={() => setShowScriptModal(true)}
			className="w-full font-semibold shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow border border-black/10 cursor-pointer"
		>
			Submit Script
		</button>
	</section>
);

export default ScriptsTabContent;
