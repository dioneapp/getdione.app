import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Pencil,
	X as XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/database";
import LoadingSkeleton from "./loading-skeleton";

// add type for script data
type Script = {
	id: string;
	name: string;
	author: string;
	description: string;
	logo_url?: string;
	created_at: string;
	updated_at?: string;
	script_url?: string;
	version?: string;
	tags?: string;
	pending_review?: boolean;
	status?: string | Record<string, string | [string, string]> | null;
	review_feedback?: string | null;
	commit_hash?: string | Record<string, string> | null;
};

export default function ScriptsTab() {
	const [scripts, setScripts] = useState<Script[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [expandedScript, setExpandedScript] = useState<string | null>(null);
	const [editingScript, setEditingScript] = useState<string | null>(null);
	const [editedScriptData, setEditedScriptData] = useState<Script | null>(null);
	const [sortField, setSortField] = useState("created_at");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const itemsPerPage = 10;
	const [moderationFeedback, setModerationFeedback] = useState<
		Record<string, string>
	>({});
	const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
		{},
	);
	const [deleting, setDeleting] = useState<Record<string, boolean>>({});

	// unified button style for moderation panel
	const buttonClass =
		"px-4 py-2 text-sm font-medium bg-white text-[#080808] hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-1.5 leading-none whitespace-nowrap rounded-full border border-black/10";

	// sort options for scripts
	const sortOptions = [
		{ value: "created_at", label: "Date Created", icon: "📅" },
		{ value: "name", label: "Name", icon: "📝" },
		{ value: "author", label: "Author", icon: "👤" },
		{ value: "downloads", label: "Downloads", icon: "⬇️" },
	];

	useEffect(() => {
		const fetchScripts = async () => {
			try {
				// get total count with search filter
				const { count, error: countError } = await supabase
					.from("scripts")
					.select("*", { count: "exact", head: true })
					.or(
						`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`,
					);

				if (countError) throw countError;
				setTotalCount(count || 0);

				// get paginated data with sorting and search
				const { data, error } = await supabase
					.from("scripts")
					.select("*")
					.or(
						`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`,
					)
					.order(sortField, { ascending: sortDirection === "asc" })
					.range(
						(currentPage - 1) * itemsPerPage,
						currentPage * itemsPerPage - 1,
					);

				if (error) throw error;
				setScripts(data || []);
			} catch (error) {
				console.error("Error fetching scripts:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchScripts();
	}, [currentPage, sortField, sortDirection, searchQuery]);

	// remove the local filtering since we're now filtering at the database level
	const filteredScripts = scripts;

	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const handleSaveScript = async (updatedScript: Script) => {
		try {
			const { error } = await supabase
				.from("scripts")
				.update(updatedScript)
				.eq("id", updatedScript.id);

			if (error) throw error;

			// update local state
			setScripts(
				scripts.map((script) =>
					script.id === updatedScript.id ? updatedScript : script,
				),
			);
			setEditingScript(null);
			setEditedScriptData(null);
		} catch (error) {
			console.error("Error updating script:", error);
			throw error;
		}
	};

	const takeModerationAction = async (
		pending_review: boolean,
		script: Script,
		action: "ACCEPTED" | "CHANGES_REQUESTED" | "DENIED",
	) => {
		setActionLoading((p) => ({ ...p, [script.id]: true }));
		try {
			// always refetch latest for safety (commit history / pending data)
			const { data: fresh, error: fetchErr } = await supabase
				.from("scripts")
				.select("*")
				.eq("id", script.id)
				.single();
			if (fetchErr) throw fetchErr;

			const nextUpdate: Partial<Script> = {
				pending_review,
				review_feedback: moderationFeedback[script.id] || null,
			};

			// determine version under review (pending if present, else current)
			const currentCommit = fresh.commit_hash as
				| string
				| Record<string, string>
				| null;
			let pendingVersion: string | undefined;
			let pendingHash: string | undefined;
			if (currentCommit && typeof currentCommit === "object") {
				const pending = (currentCommit as any)["__pending"] as
					| { version?: string; hash?: string }
					| undefined;
				if (pending?.version && pending?.hash) {
					pendingVersion = pending.version;
					pendingHash = pending.hash;
				}
			} else if (typeof currentCommit === "string") {
				pendingVersion = fresh.version as string | undefined;
				pendingHash = currentCommit;
			}
			const versionUnderReview =
				pendingVersion || (fresh.version as string | undefined);

			// update per-version status JSON stored in `status` column (jsonb)
			const existingStatusMap: Record<string, string | [string, string]> =
				fresh.status && typeof fresh.status === "object"
					? { ...(fresh.status as any) }
					: {};

			// get the existing hash for this version if we don't have pendingHash
			let hashToUse = pendingHash;
			if (!hashToUse && versionUnderReview) {
				const existing = existingStatusMap[versionUnderReview];
				if (Array.isArray(existing)) {
					hashToUse = existing[1];
				} else if (typeof currentCommit === "object" && currentCommit) {
					hashToUse = (currentCommit as any)[versionUnderReview];
				}
			}

			if (versionUnderReview) {
				existingStatusMap[versionUnderReview] = [action, hashToUse || ""];
			}
			(nextUpdate as any).status = existingStatusMap as any;

			if (action === "ACCEPTED") {
				if (pendingVersion && pendingHash) {
					const baseHistory: Record<string, string> =
						currentCommit && typeof currentCommit === "object"
							? Object.fromEntries(
									Object.entries(
										currentCommit as Record<string, string>,
									).filter(([k]) => k !== "__pending"),
								)
							: {};

					const newHistory: Record<string, string> = {
						...baseHistory,
						[pendingVersion]: pendingHash,
					};

					nextUpdate.commit_hash = newHistory as any;
				}
			}

			if (action === "DENIED") {
				// clean pending candidate if present
				if (currentCommit && typeof currentCommit === "object") {
					const baseHistory = Object.fromEntries(
						Object.entries(currentCommit as Record<string, string>).filter(
							([k]) => k !== "__pending",
						),
					);
					nextUpdate.commit_hash = baseHistory as any;
				}
			}

			// try to update with JSONB status; if column differs, fallback unchanged
			let updateErr = null as any;
			try {
				const { error } = await supabase
					.from("scripts")
					.update(nextUpdate)
					.eq("id", script.id);
				if (error) updateErr = error;
			} catch (e: any) {
				updateErr = e;
			}
			if (updateErr) {
				const fallbackUpdate = { ...nextUpdate } as any;
				// no-op fallback, but ensure we don't include incompatible shapes
				const { error: fbErr } = await supabase
					.from("scripts")
					.update(fallbackUpdate)
					.eq("id", script.id);
				if (fbErr) throw fbErr;
			}

			setScripts((prev) =>
				prev.map((s) => (s.id === script.id ? { ...s, ...nextUpdate } : s)),
			);

			// fire discord webhook (best-effort)
			try {
				const color =
					action === "ACCEPTED"
						? 0x57f287
						: action === "DENIED"
							? 0xed4245
							: 0xfee75c;
				const pending =
					typeof fresh.commit_hash === "object"
						? (fresh.commit_hash as any)["__pending"]
						: undefined;
				const commitForMsg =
					typeof fresh.commit_hash === "string"
						? fresh.commit_hash
						: pending?.hash || "n/a";
				const body = {
					embeds: [
						{
							title:
								action === "ACCEPTED"
									? "Script Accepted"
									: action === "DENIED"
										? "Script Denied"
										: "Changes Requested",
							color,
							fields: [
								{ name: "Name", value: fresh.name, inline: true },
								{ name: "Author", value: fresh.author || "n/a", inline: true },
								{
									name: "Version",
									value: fresh.version || "n/a",
									inline: true,
								},
								{ name: "Commit", value: commitForMsg || "n/a", inline: true },
								{ name: "Status", value: action, inline: true },
								{
									name: "Feedback",
									value: moderationFeedback[script.id] || "—",
								},
								{ name: "ID", value: script.id },
							],
							timestamp: new Date().toISOString(),
						},
					],
				};
				await fetch("/api/scripts-webhook", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});
			} catch (e) {
				console.warn("discord webhook failed", e);
			}
		} catch (err) {
			console.error("Error moderating script:", err);
			alert("Failed to update status. Try again.");
		} finally {
			setActionLoading((p) => ({ ...p, [script.id]: false }));
		}
	};

	const startEditing = (script: Script) => {
		setEditingScript(script.id);
		setEditedScriptData(script);
	};

	const cancelEditing = () => {
		setEditingScript(null);
		setEditedScriptData(null);
	};

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<input
						type="text"
						placeholder="Search scripts..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
					/>
					<div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 w-full sm:w-auto">
						<select
							value={sortField}
							onChange={(e) => setSortField(e.target.value)}
							className="px-3 py-2 bg-transparent border-none text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer w-full sm:w-auto"
							style={{ backgroundImage: "none" }}
						>
							{sortOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
									className="bg-[#1a1a1a]"
								>
									{option.icon} {option.label}
								</option>
							))}
						</select>
						<div className="w-px h-6 bg-white/10"></div>
						<button
							onClick={() =>
								setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
							}
							className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
							title={`Sort ${sortDirection === "asc" ? "ascending" : "descending"}`}
						>
							{sortDirection === "asc" ? (
								<ChevronDown className="h-5 w-5 text-white/80" />
							) : (
								<ChevronUp className="h-5 w-5 text-white/80" />
							)}
						</button>
					</div>
				</div>
				<div className="text-sm text-white/40 truncate">
					Sorting by {sortOptions.find((opt) => opt.value === sortField)?.label}{" "}
					({sortDirection === "asc" ? "ascending" : "descending"})
				</div>
			</div>

			{loading ? (
				<LoadingSkeleton />
			) : (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-4"
					>
						{filteredScripts.map((script) => (
							<motion.div
								key={script.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
							>
								<div
									className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
									onClick={() =>
										setExpandedScript(
											expandedScript === script.id ? null : script.id,
										)
									}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 flex-shrink-0">
												{script?.logo_url ? (
													<img
														src={script.logo_url}
														alt={script.name}
														className="object-cover h-full w-full"
													/>
												) : (
													<div className="w-full h-full bg-white/10 flex items-center justify-center">
														<span className="text-white/50 text-xl">
															{script?.name?.[0]?.toUpperCase() || "?"}
														</span>
													</div>
												)}
											</div>
											<div>
												<h3 className="text-lg font-medium text-white truncate">
													{script.name}
												</h3>
												<p className="text-white/60 truncate">
													by {script.author}
												</p>
												<p className="text-white/60 text-sm line-clamp-1">
													{script.description}
												</p>
												<div className="mt-1 flex gap-2 flex-wrap items-center">
													{(() => {
														const statusMap = (
															script.status && typeof script.status === "object"
																? (script.status as Record<
																		string,
																		string | [string, string]
																	>)
																: undefined
														) as Record<string, string> | undefined;
														const ch: any = script.commit_hash as any;
														const pendingVersion =
															ch &&
															typeof ch === "object" &&
															ch.__pending?.version
																? (ch.__pending.version as string)
																: undefined;
														const currentVersion = script.version as
															| string
															| undefined;
														const activeVersion =
															pendingVersion || currentVersion || "";
														const raw = statusMap?.[activeVersion] as any;
														const activeStatus = Array.isArray(raw)
															? raw[0]
															: raw ||
																(typeof script.status === "string"
																	? script.status
																	: undefined);

														const badges: any[] = [];
														if (
															script.pending_review &&
															script.status === "PENDING_REVIEW"
														) {
															badges.push(
																<span
																	key="needs"
																	className="text-[10px] px-2 py-0.5 rounded-full border border-yellow-400/30 text-yellow-300/90 bg-yellow-400/10"
																>
																	Requires review
																</span>,
															);
														}
														if (activeStatus === "CHANGES_REQUESTED") {
															badges.push(
																<span
																	key="cr"
																	className="text-[10px] px-2 py-0.5 rounded-full border border-orange-400/30 text-orange-300/90 bg-orange-400/10"
																>
																	Changes requested
																</span>,
															);
														}
														if (activeStatus === "DENIED") {
															badges.push(
																<span
																	key="denied"
																	className="text-[10px] px-2 py-0.5 rounded-full border border-red-400/30 text-red-300/90 bg-red-400/10"
																>
																	Denied
																</span>,
															);
														}
														return badges;
													})()}
												</div>
											</div>
										</div>
									</div>
								</div>

								<AnimatePresence>
									{expandedScript === script.id && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="border-t border-white/10"
										>
											<div className="p-4 space-y-4">
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Name
														</label>
														{editingScript === script.id ? (
															<input
																type="text"
																value={editedScriptData?.name || ""}
																onChange={(e) =>
																	setEditedScriptData((prev: Script | null) =>
																		prev
																			? { ...prev, name: e.target.value }
																			: null,
																	)
																}
																className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															/>
														) : (
															<p className="text-white">{script.name}</p>
														)}
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Author
														</label>
														{editingScript === script.id ? (
															<input
																type="text"
																value={editedScriptData?.author || ""}
																onChange={(e) =>
																	setEditedScriptData((prev: Script | null) =>
																		prev
																			? { ...prev, author: e.target.value }
																			: null,
																	)
																}
																className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															/>
														) : (
															<p className="text-white">{script.author}</p>
														)}
													</div>
												</div>
												<div>
													<label className="block text-sm text-white/60 mb-1">
														Description
													</label>
													{editingScript === script.id ? (
														<textarea
															value={editedScriptData?.description || ""}
															onChange={(e) =>
																setEditedScriptData((prev: Script | null) =>
																	prev
																		? { ...prev, description: e.target.value }
																		: null,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															rows={3}
														/>
													) : (
														<p className="text-white">{script.description}</p>
													)}
												</div>

												{/* version, commit history and link */}
												<div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-2">
													<div className="text-sm text-white/70">
														<span className="text-white/60">Script link:</span>{" "}
														{script.script_url ? (
															<a
																href={script.script_url}
																target="_blank"
																rel="noopener noreferrer"
																className="underline decoration-white/30 hover:decoration-white text-white"
															>
																Open
															</a>
														) : (
															<span className="text-white/50">n/a</span>
														)}
													</div>
													<div className="text-sm text-white/70">
														{(() => {
															const ch: any = script.commit_hash as any;
															const pendingV =
																ch &&
																typeof ch === "object" &&
																ch.__pending?.version
																	? ch.__pending.version
																	: undefined;
															const v = pendingV || script.version || "n/a";
															return (
																<>
																	<span className="text-white/60">
																		Version to review:
																	</span>{" "}
																	<span className="text-white">{v}</span>
																</>
															);
														})()}
													</div>
													<div className="flex flex-wrap items-center gap-2">
														{(() => {
															const ch: any = script.commit_hash as any;
															if (!ch) return null;
															if (typeof ch === "string") {
																return (
																	<span className="px-2 py-1 text-xs rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
																		v{script.version || "n/a"} •{" "}
																		<span className="font-mono">{ch}</span>
																	</span>
																);
															}
															const all = Object.entries(ch).filter(
																([k]) => k !== "__pending",
															);
															const visible = all.slice(-10);
															return (
																<>
																	{visible.map(([ver, hash]) => (
																		<span
																			key={`${ver}-${String(hash)}`}
																			className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/80"
																		>
																			v{ver} •{" "}
																			<span className="font-mono">
																				{String(hash)}
																			</span>
																		</span>
																	))}
																	{all.length > visible.length && (
																		<span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/60">
																			+{all.length - visible.length} more
																		</span>
																	)}
																	{ch?.__pending?.hash && (
																		<span className="px-2 py-1 text-xs rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
																			v{ch.__pending?.version} •{" "}
																			<span className="font-mono">
																				{ch.__pending?.hash}
																			</span>
																		</span>
																	)}
																</>
															);
														})()}
													</div>
												</div>

												{/* moderation status & actions */}
												{script.pending_review && (
													<div className="rounded-lg bg-white/5 border border-white/10 p-3 mt-3 space-y-3">
														<textarea
															rows={3}
															value={moderationFeedback[script.id] || ""}
															onChange={(e) =>
																setModerationFeedback((p) => ({
																	...p,
																	[script.id]: e.target.value,
																}))
															}
															placeholder="Optional feedback to the author..."
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
														/>
														<div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
															<div className="flex w-full sm:w-auto items-center gap-1">
																<button
																	onClick={() =>
																		takeModerationAction(
																			false,
																			script,
																			"DENIED",
																		)
																	}
																	disabled={!!actionLoading[script.id]}
																	className={buttonClass}
																>
																	<XIcon className="w-3.5 h-3.5" />
																	Deny
																</button>
																<button
																	onClick={() =>
																		takeModerationAction(
																			true,
																			script,
																			"CHANGES_REQUESTED",
																		)
																	}
																	disabled={!!actionLoading[script.id]}
																	className={buttonClass}
																>
																	<Pencil className="w-3.5 h-3.5" />
																	Request changes
																</button>
																<button
																	onClick={() =>
																		takeModerationAction(
																			false,
																			script,
																			"ACCEPTED",
																		)
																	}
																	disabled={!!actionLoading[script.id]}
																	className={buttonClass}
																>
																	<Check className="w-3.5 h-3.5" />
																	{actionLoading[script.id]
																		? "Updating..."
																		: "Accept"}
																</button>
															</div>
														</div>
													</div>
												)}

												<div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
													{editingScript === script.id ? (
														<>
															<button
																onClick={cancelEditing}
																className={`${buttonClass} w-full sm:w-auto`}
															>
																Cancel
															</button>
															<button
																onClick={() =>
																	editedScriptData &&
																	handleSaveScript(editedScriptData)
																}
																className={`${buttonClass} w-full sm:w-auto`}
															>
																<Check className="w-4 h-4" />
																Save Changes
															</button>
														</>
													) : (
														<div className="flex items-center gap-2">
															<button
																onClick={() => startEditing(script)}
																className={buttonClass}
															>
																<Pencil className="w-4 h-4" />
																Edit Details
															</button>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	const confirmed = window.confirm(
																		`Delete script "${script.name}"? This cannot be undone.`,
																	);
																	if (!confirmed) return;
																	(async () => {
																		try {
																			setDeleting((m) => ({
																				...m,
																				[script.id]: true,
																			}));
																			const { error } = await supabase
																				.from("scripts")
																				.delete()
																				.eq("id", script.id);
																			if (error) throw error;
																			setScripts((prev) =>
																				prev.filter((s) => s.id !== script.id),
																			);
																		} catch (err) {
																			alert(
																				err instanceof Error
																					? err.message
																					: "failed to delete",
																			);
																		} finally {
																			setDeleting((m) => ({
																				...m,
																				[script.id]: false,
																			}));
																		}
																	})();
																}}
																disabled={!!deleting[script.id]}
																className={buttonClass}
																title="Delete script"
															>
																{deleting[script.id] ? "Deleting..." : "Delete"}
															</button>
														</div>
													)}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</motion.div>

					{/* pagination */}
					<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="text-white/60 text-center sm:text-left truncate">
							Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
							{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
							scripts
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="p-2 bg-white/10 hover:bg-white/20 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
								title="Previous Page"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								onClick={() =>
									setCurrentPage((p) => Math.min(totalPages, p + 1))
								}
								disabled={currentPage === totalPages}
								className="p-2 bg-white/10 hover:bg-white/20 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
								title="Next Page"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
