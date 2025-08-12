"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Plus, X as XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { scriptsWebhookAction } from "@/app/actions";
import { supabase } from "@/utils/database";
import useUser from "@/utils/use-user";

type CommitHashHistory =
	| string
	| { [k: string]: string | { version: string; hash: string } };

type UserScript = {
	id: string;
	name: string;
	description: string;
	script_url: string;
	logo_url?: string;
	version: string;
	tags?: string;
	commit_hash: CommitHashHistory;
	author?: string;
	author_url?: string;
	pending_review?: boolean;
	status?: string | Record<string, string | [string, string]> | null;
	review_feedback?: string | null;
	created_at?: string;
	updated_at?: string;
};

type NewScriptInput = {
	name: string;
	description: string;
	script_url: string;
	logo_url: string;
	version: string;
	tags: "audio" | "image" | "video" | "chat" | "";
	commit_hash: string;
};

function validateCommitHash(hash: string) {
	return /^[0-9a-fA-F]{7,40}$/.test(hash);
}

function validateGitHubUrl(url: string) {
	return /^https:\/\/github\.com\/[^/]+\/[^/]+\/.*\.json$/i.test(url);
}

export default function ProfileScriptsTab() {
	const { user, loading: userLoading } = useUser();
	const [scripts, setScripts] = useState<UserScript[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedScript, setExpandedScript] = useState<string | null>(null);
	const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
	const [editedScript, setEditedScript] = useState<UserScript | null>(null);
	const [showNewModal, setShowNewModal] = useState(false);
	const [creating, setCreating] = useState(false);
	const [deleting, setDeleting] = useState<Record<string, boolean>>({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const itemsPerPage = 10;
	const [refreshTick, setRefreshTick] = useState(0);

	function getActiveVersionAndStatus(s: UserScript): {
		version?: string;
		status?: string;
		hash?: string;
	} {
		const statusMap: Record<string, string> | undefined =
			s.status && typeof s.status === "object" ? (s.status as any) : undefined;
		const ch: any = s.commit_hash as any;
		const pendingVersion: string | undefined =
			ch && typeof ch === "object" && ch.__pending?.version
				? (ch.__pending.version as string)
				: undefined;
		if (pendingVersion) {
			return {
				version: pendingVersion,
				status: "PENDING_REVIEW",
				hash: ch.__pending?.hash as string,
			};
		}
		const currentVersion = s.version as string | undefined;
		const activeVersion = currentVersion || undefined;
		const mappedRaw =
			activeVersion && statusMap
				? (statusMap as any)[activeVersion]
				: undefined;
		let mappedStatus: string | undefined;
		let hash: string | undefined;
		if (Array.isArray(mappedRaw)) {
			mappedStatus = mappedRaw[0];
			hash = mappedRaw[1];
		} else if (typeof mappedRaw === "string") {
			mappedStatus = mappedRaw;
		}
		const flatStatus =
			typeof s.status === "string" ? (s.status as string) : undefined;
		return { version: activeVersion, status: mappedStatus || flatStatus, hash };
	}

	function getStatusForVersion(
		s: UserScript,
		version?: string,
	): string | undefined {
		if (!version) return undefined;
		if (s.status && typeof s.status === "object") {
			const map = s.status as Record<string, string | [string, string]>;
			const raw = map[version];
			return Array.isArray(raw) ? raw[0] : raw;
		}
		if (typeof s.status === "string" && version === s.version) {
			return s.status as string;
		}
		return undefined;
	}

	function versionBadgeClasses(status?: string): string {
		switch (status) {
			case "ACCEPTED":
				return "bg-green-400/10 border border-green-400/30 text-green-200";
			case "DENIED":
				return "bg-red-400/10 border border-red-400/30 text-red-200";
			case "CHANGES_REQUESTED":
				return "bg-orange-400/10 border border-orange-400/30 text-orange-200";
			default:
				return "bg-white/5 border border-white/10 text-white/80";
		}
	}

	function buildCommitHistoryWithPending(
		existing: CommitHashHistory,
		version: string,
		hash: string,
	): CommitHashHistory {
		if (existing && typeof existing === "object") {
			const base: Record<string, string | { version: string; hash: string }> =
				{};
			Object.entries(existing as any).forEach(([k, v]) => {
				if (k === "__pending") return;
				if (typeof v === "string") base[k] = v;
			});
			base["__pending"] = { version, hash };
			return base;
		}
		return { __pending: { version, hash } } as any;
	}

	const [newScript, setNewScript] = useState<NewScriptInput>({
		name: "",
		description: "",
		script_url: "",
		logo_url: "",
		version: "",
		tags: "",
		commit_hash: "",
	});
	const [newErrors, setNewErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	useEffect(() => {
		if (userLoading) return;
		if (!user?.username) return;
		let cancelled = false;

		async function fetchMyScripts() {
			try {
				setLoading(true);
				setError(null);
				const countQuery = supabase
					.from("scripts")
					.select("*", { count: "exact", head: true })
					.eq("author", user.username);
				if (searchQuery) {
					(countQuery as any).or(
						`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.ilike.%${searchQuery}%,version.ilike.%${searchQuery}%`,
					);
				}
				const { count, error: countError } = (await countQuery) as any;
				if (countError) throw countError;
				if (!cancelled) setTotalCount(count || 0);

				const dataQuery = supabase
					.from("scripts")
					.select("*")
					.eq("author", user.username)
					.order("created_at", { ascending: false })
					.range(
						(currentPage - 1) * itemsPerPage,
						currentPage * itemsPerPage - 1,
					);
				if (searchQuery) {
					(dataQuery as any).or(
						`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.ilike.%${searchQuery}%,version.ilike.%${searchQuery}%`,
					);
				}
				const { data, error } = await dataQuery;
				if (error) throw error;
				if (!cancelled) setScripts(data || []);
			} catch (err) {
				if (!cancelled)
					setError(
						err instanceof Error ? err.message : "failed to load scripts",
					);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchMyScripts();
		return () => {
			cancelled = true;
		};
	}, [user, userLoading, currentPage, searchQuery, refreshTick]);

	const startEditing = (s: UserScript) => {
		const { version: activeVersion, status: activeStatus } =
			getActiveVersionAndStatus(s);
		if (activeStatus === "DENIED") {
			setError("Denied scripts cannot be edited. Please submit a new version.");
			return;
		}
		const baseHistory =
			s.commit_hash && typeof s.commit_hash === "object"
				? (Object.fromEntries(
						Object.entries(s.commit_hash as any).filter(
							([k]) => k !== "__pending",
						),
					) as CommitHashHistory)
				: ("" as CommitHashHistory);

		const editingVersion =
			activeStatus === "CHANGES_REQUESTED" && activeVersion
				? activeVersion
				: "";

		setEditingScriptId(s.id);
		setEditedScript({
			...s,
			version: editingVersion,
			commit_hash: baseHistory,
		});
		setExpandedScript(s.id);
	};

	const cancelEditing = () => {
		setEditingScriptId(null);
		setEditedScript(null);
	};

	const saveEdits = async () => {
		if (!editedScript) return;
		if (editedScript.status === "DENIED") {
			setError("Denied scripts cannot be edited. Please submit a new version.");
			return;
		}
		const errs: Record<string, string> = {};
		if (!editedScript.name?.trim()) errs.name = "required";
		if (!editedScript.description?.trim()) errs.description = "required";
		if (!editedScript.script_url?.trim()) errs.script_url = "required";
		if (!editedScript.version?.trim()) errs.version = "required";
		const nextPendingHash =
			typeof editedScript.commit_hash === "string"
				? editedScript.commit_hash
				: (editedScript.commit_hash as any)?.__pending?.hash || "";
		if (!nextPendingHash.trim()) errs.commit_hash = "required";
		if (nextPendingHash && !validateCommitHash(nextPendingHash)) {
			errs.commit_hash = "invalid hash";
		}

		if (Object.keys(errs).length) {
			setError("Please fill missing fields");
			return;
		}

		// prevent reusing an existing version unless changes were requested for that version
		{
			const original = scripts.find((s) => s.id === editedScript.id);
			const { version: activeVersion, status: activeStatus } = original
				? getActiveVersionAndStatus(original)
				: { version: undefined, status: undefined };
			const existingVersions = new Set<string>();
			if (original?.version) existingVersions.add(original.version);
			if (original?.commit_hash && typeof original.commit_hash === "object") {
				Object.keys(original.commit_hash as any)
					.filter((k) => k !== "__pending")
					.forEach((k) => existingVersions.add(k));
			}
			const isReusingActiveWithCR =
				activeStatus === "CHANGES_REQUESTED" &&
				editedScript.version === activeVersion;
			if (
				!isReusingActiveWithCR &&
				editedScript.version &&
				existingVersions.has(editedScript.version)
			) {
				setError(
					"This version already exists for this script. Please bump the version.",
				);
				return;
			}
		}

		// prevent reusing a commit hash already linked to any existing version
		{
			const original = scripts.find((s) => s.id === editedScript.id);
			const usedHashes = new Set<string>();
			if (typeof original?.commit_hash === "string") {
				usedHashes.add(original.commit_hash);
			} else if (
				original?.commit_hash &&
				typeof original.commit_hash === "object"
			) {
				Object.entries(original.commit_hash as any)
					.filter(([k]) => k !== "__pending")
					.forEach(([, v]) => {
						if (typeof v === "string") usedHashes.add(v);
					});
			}
			if (usedHashes.has(nextPendingHash)) {
				setError(
					"This commit hash is already used by another version. Please use a new commit hash.",
				);
				return;
			}
		}

		try {
			setError(null);
			const updateData: Partial<UserScript> = {
				name: editedScript.name,
				description: editedScript.description,
				script_url: editedScript.script_url,
				logo_url: editedScript.logo_url || undefined,
				version: editedScript.version,
				tags: editedScript.tags || undefined,
				commit_hash: buildCommitHistoryWithPending(
					editedScript.commit_hash,
					editedScript.version,
					nextPendingHash,
				),
				pending_review: true,
				status: {
					...(typeof editedScript.status === "object"
						? (editedScript.status as any)
						: {}),
					[editedScript.version]: ["PENDING_REVIEW", nextPendingHash],
				} as any,
			};

			const { error } = await supabase
				.from("scripts")
				.update(updateData)
				.eq("id", editedScript.id);
			if (error) throw error;

			setScripts((prev) =>
				prev.map((s) =>
					s.id === editedScript.id ? { ...s, ...updateData } : s,
				),
			);
			cancelEditing();

			try {
				const body = {
					embeds: [
						{
							title: "Script Re-Submitted for Review",
							color: 0xfee75c,
							fields: [
								{ name: "Name", value: editedScript.name, inline: true },
								{
									name: "Author",
									value: editedScript.author || "n/a",
									inline: true,
								},
								{
									name: "Version",
									value: editedScript.version || "n/a",
									inline: true,
								},
								{
									name: "Commit",
									value: nextPendingHash || "n/a",
									inline: true,
								},
								{ name: "ID", value: editedScript.id },
							],
							timestamp: new Date().toISOString(),
						},
					],
				};
				await scriptsWebhookAction(body);
			} catch {
				// ignore webhook errors
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "failed to save");
		}
	};

	const openNewModal = () => {
		setNewScript({
			name: "",
			description: "",
			script_url: "",
			logo_url: "",
			version: "1.0.0",
			tags: "",
			commit_hash: "",
		});
		setNewErrors({});
		setShowNewModal(true);
	};

	const deleteScript = async (s: UserScript) => {
		if (!s?.id) return;
		const confirmed = window.confirm(
			`Delete script "${s.name}"? This cannot be undone.`,
		);
		if (!confirmed) return;
		try {
			setDeleting((m) => ({ ...m, [s.id]: true }));
			const { error } = await supabase.from("scripts").delete().eq("id", s.id);
			if (error) throw error;
			setScripts((prev) => prev.filter((x) => x.id !== s.id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "failed to delete");
		} finally {
			setDeleting((m) => ({ ...m, [s.id]: false }));
		}
	};

	const submitNew = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		const errs: Record<string, string> = {};
		if (!newScript.name?.trim()) errs.name = "required";
		if (newScript.name && newScript.name.length > 50)
			errs.name = "max 50 characters";
		if (!newScript.description?.trim()) errs.description = "required";
		if (newScript.description && newScript.description.length > 200)
			errs.description = "max 200 characters";
		if (!newScript.script_url?.trim()) errs.script_url = "required";
		if (newScript.script_url && !validateGitHubUrl(newScript.script_url)) {
			errs.script_url = "must be a valid GitHub URL ending in .json";
		}
		if (!newScript.logo_url?.trim()) errs.logo_url = "required";
		if (!newScript.version?.trim()) errs.version = "required";
		if (!newScript.tags) errs.tags = "required";
		if (!newScript.commit_hash?.trim()) errs.commit_hash = "required";
		if (newScript.commit_hash && !validateCommitHash(newScript.commit_hash)) {
			errs.commit_hash = "invalid hash";
		}

		setNewErrors(errs);
		if (Object.keys(errs).length) return;

		// prevent multiple submissions while one is pending review
		const hasPending = scripts.some(
			(s) => s.pending_review || s.status === "PENDING_REVIEW",
		);
		if (hasPending) {
			setError(
				"You already have a submission pending review. Please wait until it is processed before submitting another update.",
			);
			return;
		}

		try {
			setCreating(true);
			const author = user.username || user.first_name || "anonymous";
			const authorUrl = `https://getdione.app/profile/${user.username}`;
			const generatedId = crypto.randomUUID();
			const { error } = await supabase.from("scripts").insert({
				id: generatedId,
				name: newScript.name,
				description: newScript.description,
				script_url: newScript.script_url,
				logo_url: newScript.logo_url,
				version: newScript.version,
				tags: newScript.tags,
				commit_hash: { [newScript.version]: newScript.commit_hash } as any,
				author,
				author_url: authorUrl,
				likes: 0,
				downloads: 0,
				featured: false,
				official: false,
				pending_review: true,
				status: {
					[newScript.version]: ["PENDING_REVIEW", newScript.commit_hash],
				} as any,
			});
			if (error) throw error;

			try {
				const body = {
					embeds: [
						{
							title: "New Script Submitted for Review",
							color: 0xfee75c,
							fields: [
								{ name: "Name", value: newScript.name, inline: true },
								{ name: "Author", value: author, inline: true },
								{
									name: "Version",
									value: newScript.version || "n/a",
									inline: true,
								},
								{
									name: "Commit",
									value: newScript.commit_hash || "n/a",
									inline: true,
								},
								{ name: "Script URL", value: newScript.script_url || "n/a" },
								{ name: "ID", value: generatedId },
							],
							timestamp: new Date().toISOString(),
						},
					],
				};
				await scriptsWebhookAction(body);
			} catch {
				// ignore webhook errors
			}

			setCurrentPage(1);
			setRefreshTick((t) => t + 1);
			setShowNewModal(false);
		} catch (err) {
			const e = err as any;
			console.error("submit script error:", e);
			const msg = e?.message?.toLowerCase?.() || "";
			if (msg.includes("row-level security") || e?.code === "42501") {
				setError("permission denied. please sign in or contact support");
			} else if (e?.code === "23505") {
				setError("duplicate. try again");
			} else if (e?.code === "23502") {
				setError("missing required field");
			} else {
				setError(
					e?.message || e?.hint || "submission failed. check fields and auth",
				);
			}
		} finally {
			setCreating(false);
		}
	};

	return (
		<div className="w-full">
			<div className="mb-6 flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<input
						type="text"
						placeholder="Search your scripts..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
					/>
					<button
						onClick={openNewModal}
						className="w-full sm:w-auto shrink-0 py-2 px-4 flex items-center justify-center gap-2 rounded-xl bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
					>
						<Plus className="w-4 h-4" />
						Submit Script
					</button>
				</div>
				{error && (
					<div className="text-sm text-red-400/90 bg-red-500/10 border border-red-400/30 rounded-lg px-4 py-2">
						{error}
					</div>
				)}
			</div>

			{loading ? (
				<div className="text-white/60">loading...</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="space-y-4"
				>
					{scripts.map((script: UserScript) => (
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
											<p className="text-white/60 text-sm line-clamp-1">
												{script.description}
											</p>
											<div className="text-xs text-white/50 mt-1 flex gap-2 flex-wrap">
												<span>v{script.version}</span>
												{script.tags && (
													<span>
														{script.tags.charAt(0).toUpperCase() +
															script.tags.slice(1)}
													</span>
												)}
												{(() => {
													const { status } = getActiveVersionAndStatus(script);
													if (status === "CHANGES_REQUESTED") {
														return (
															<span className="text-orange-300/80">
																Changes requested
															</span>
														);
													}
													if (status === "DENIED") {
														return (
															<span className="text-red-300/80">Denied</span>
														);
													}
													if (status === "ACCEPTED") {
														return (
															<span className="text-green-300/80">
																Accepted
															</span>
														);
													}
													if (
														script.pending_review ||
														status === "PENDING_REVIEW"
													) {
														return (
															<span className="text-yellow-300/80">
																Pending review
															</span>
														);
													}
													return null;
												})()}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{script.status !== "DENIED" ? (
											<button
												onClick={(e) => {
													e.stopPropagation();
													startEditing(script);
												}}
												className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer"
											>
												<Pencil className="w-4 h-4" />
												Edit
											</button>
										) : (
											<span className="px-3 py-1.5 text-xs text-red-300/80 bg-red-400/10 border border-red-400/20 rounded-lg">
												Denied
											</span>
										)}
										{/* <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteScript(script);
                                            }}
                                            disabled={!!deleting[script.id]}
                                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200 cursor-pointer border border-red-500/20"
                                            title="Delete script"
                                        >
                                            {deleting[script.id] ? "Deleting..." : "Delete"}
                                        </button>*/}
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
											{(() => {
												const { status } = getActiveVersionAndStatus(script);
												if (
													status === "CHANGES_REQUESTED" &&
													script.review_feedback
												) {
													return (
														<div className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg p-3">
															<span className="text-white/60">
																Changes requested:
															</span>{" "}
															{script.review_feedback}
														</div>
													);
												}
												return null;
											})()}

											{editingScriptId === script.id ? (
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Name
														</label>
														<input
															type="text"
															value={editedScript?.name || ""}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? { ...prev, name: e.target.value }
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
														/>
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Version
														</label>
														<input
															type="text"
															value={editedScript?.version || ""}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? { ...prev, version: e.target.value }
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															placeholder="e.g. 1.0.1"
														/>
													</div>
													<div className="sm:col-span-2">
														<label className="block text-sm text-white/60 mb-1">
															Description
														</label>
														<textarea
															rows={3}
															value={editedScript?.description || ""}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? { ...prev, description: e.target.value }
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
														/>
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Script URL
														</label>
														<input
															type="url"
															value={editedScript?.script_url || ""}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? { ...prev, script_url: e.target.value }
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
														/>
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Logo URL
														</label>
														<input
															type="url"
															value={editedScript?.logo_url || ""}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? { ...prev, logo_url: e.target.value }
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
														/>
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Tags
														</label>
														<input
															type="text"
															value={editedScript?.tags || ""}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? { ...prev, tags: e.target.value }
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
														/>
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Commit hash
														</label>
														<input
															type="text"
															value={
																typeof editedScript?.commit_hash === "string"
																	? (editedScript?.commit_hash as string)
																	: (editedScript?.commit_hash as any)
																			?.__pending?.hash || ""
															}
															onChange={(e) =>
																setEditedScript((prev) =>
																	prev
																		? {
																				...prev,
																				commit_hash:
																					typeof prev.commit_hash === "object"
																						? {
																								...(prev.commit_hash as Record<
																									string,
																									string
																								>),
																								__pending: {
																									version: prev.version,
																									hash: e.target.value,
																								},
																							}
																						: e.target.value,
																			}
																		: prev,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															placeholder="e.g. 7-40 hex chars"
														/>
													</div>
												</div>
											) : (
												<div className="text-white/70 text-sm">
													{typeof script.commit_hash === "string" ? (
														<>
															Commit:{" "}
															<span className="font-mono">
																{script.commit_hash}
															</span>
														</>
													) : (
														<div className="flex flex-wrap items-center gap-2">
															{(() => {
																const all = Object.entries(
																	script.commit_hash || {},
																).filter(([k]) => k !== "__pending");
																const visible = all.slice(-10);
																return (
																	<>
																		{visible.map(([ver, hash]) => {
																			const status = getStatusForVersion(
																				script,
																				String(ver),
																			);
																			return (
																				<span
																					key={`${ver}-${String(hash)}`}
																					className={`px-2 py-1 text-xs rounded-full ${versionBadgeClasses(status)}`}
																				>
																					v{ver} •{" "}
																					<span className="font-mono">
																						{String(hash)}
																					</span>
																				</span>
																			);
																		})}
																		{all.length > visible.length && (
																			<span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/60">
																				+{all.length - visible.length} more
																			</span>
																		)}
																	</>
																);
															})()}
															{Boolean(
																(script.commit_hash as any)?.__pending?.hash,
															) && (
																<span className="px-2 py-1 text-xs rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-200">
																	v
																	{
																		(script.commit_hash as any).__pending
																			?.version
																	}{" "}
																	•{" "}
																	<span className="font-mono">
																		{
																			(script.commit_hash as any).__pending
																				?.hash
																		}
																	</span>
																</span>
															)}
														</div>
													)}
												</div>
											)}

											<div className="mt-8 flex flex-col items-center gap-2">
												{editingScriptId === script.id ? (
													<>
														<button
															onClick={saveEdits}
															className="w-full sm:w-auto shrink-0 py-2 px-4 flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
														>
															<Check className="w-4 h-4" /> Save changes for
															review
														</button>
														<button
															onClick={cancelEditing}
															className="p-1 text-white hover:text-white/80 rounded-full cursor-pointer"
														>
															Cancel
														</button>
													</>
												) : (
													<div className="text-white/50 text-sm">
														Last updated:{" "}
														{script.updated_at?.slice(0, 10) ||
															script.created_at?.slice(0, 10) ||
															"n/a"}
													</div>
												)}
											</div>
										</div>
									</motion.div>
								)}

								{/* pagination */}
								{!loading && totalCount > itemsPerPage && (
									<div className="mt-6 flex items-center justify-between">
										<div className="text-white/60 text-sm">
											Showing {(currentPage - 1) * itemsPerPage + 1}–
											{Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
											{totalCount}
										</div>
										<div className="flex gap-2">
											<button
												onClick={() =>
													setCurrentPage((p) => Math.max(1, p - 1))
												}
												disabled={currentPage === 1}
												className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Prev
											</button>
											<button
												onClick={() =>
													setCurrentPage((p) =>
														Math.min(
															Math.ceil(totalCount / itemsPerPage),
															p + 1,
														),
													)
												}
												disabled={
													currentPage >= Math.ceil(totalCount / itemsPerPage)
												}
												className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Next
											</button>
										</div>
									</div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
					{!scripts.length && (
						<div className="text-white/60 text-sm">
							No scripts yet. Submit your first one.
						</div>
					)}
				</motion.div>
			)}

			{/* script modal */}
			{showNewModal && (
				<div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-[#0b0b0b]/90 border border-white/10 rounded-xl p-6 max-w-lg w-full mx-auto shadow-2xl">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-white text-xl font-semibold">
								Submit Script
							</h3>
							<button
								onClick={() => setShowNewModal(false)}
								className="p-2 text-white/70 hover:text-white cursor-pointer"
							>
								<XIcon className="w-5 h-5" />
							</button>
						</div>

						<form onSubmit={submitNew} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Name
								</label>
								<input
									type="text"
									value={newScript.name}
									onChange={(e) =>
										setNewScript((p) => ({ ...p, name: e.target.value }))
									}
									required
									maxLength={50}
									className={`w-full px-4 py-2 bg-white/10 border ${newErrors.name ? "border-red-500/50" : "border-white/20"} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50`}
									placeholder="Script name (max 50 chars)"
								/>
								<div className="text-xs text-white/40 mt-1">
									{newScript.name.length}/50
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Description
								</label>
								<textarea
									rows={3}
									value={newScript.description}
									onChange={(e) =>
										setNewScript((p) => ({ ...p, description: e.target.value }))
									}
									required
									maxLength={200}
									className={`w-full px-4 py-2 bg-white/10 border ${newErrors.description ? "border-red-500/50" : "border-white/20"} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50`}
									placeholder="Short description (max 200 chars)"
								/>
								<div className="text-xs text-white/40 mt-1">
									{newScript.description.length}/200
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Script URL
									</label>
									<input
										type="url"
										value={newScript.script_url}
										onChange={(e) =>
											setNewScript((p) => ({
												...p,
												script_url: e.target.value,
											}))
										}
										required
										className={`w-full px-4 py-2 bg-white/10 border ${newErrors.script_url ? "border-red-500/50" : "border-white/20"} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50`}
										placeholder="https://github.com/user/repo/blob/main/script.json"
									/>
									{newScript.script_url &&
										!validateGitHubUrl(newScript.script_url) && (
											<div className="text-red-400 text-xs mt-1">
												must be a valid GitHub URL ending in .json
											</div>
										)}
								</div>
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Logo URL
									</label>
									<input
										type="url"
										value={newScript.logo_url}
										onChange={(e) =>
											setNewScript((p) => ({ ...p, logo_url: e.target.value }))
										}
										required
										className={`w-full px-4 py-2 bg-white/10 border ${newErrors.logo_url ? "border-red-500/50" : "border-white/20"} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50`}
										placeholder="https://i.imgur.com/n2Djcw9.png"
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Version
									</label>
									<input
										type="text"
										value={newScript.version}
										readOnly
										disabled
										required
										title="Initial version is fixed to 1.0.0"
										className={`w-full px-4 py-2 bg-white/10 border ${newErrors.version ? "border-red-500/50" : "border-white/20"} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-not-allowed opacity-70`}
										placeholder="1.0.0"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Category
									</label>
									<select
										value={newScript.tags}
										onChange={(e) =>
											setNewScript((p) => ({
												...p,
												tags: e.target.value as NewScriptInput["tags"],
											}))
										}
										required
										className={`w-full px-4 py-2 bg-white/10 border ${newErrors.tags ? "border-red-500/50" : "border-white/20"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50`}
									>
										<option value="" className="bg-[#1a1a1a] text-white/80">
											Select one
										</option>
										<option value="audio" className="bg-[#1a1a1a] text-white">
											Audio
										</option>
										<option value="image" className="bg-[#1a1a1a] text-white">
											Image
										</option>
										<option value="video" className="bg-[#1a1a1a] text-white">
											Video
										</option>
										<option value="chat" className="bg-[#1a1a1a] text-white">
											Chat
										</option>
									</select>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Commit Hash
								</label>
								<input
									type="text"
									value={newScript.commit_hash}
									onChange={(e) =>
										setNewScript((p) => ({ ...p, commit_hash: e.target.value }))
									}
									required
									className={`w-full px-4 py-2 bg-white/10 border ${newErrors.commit_hash ? "border-red-500/50" : "border-white/20"} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50`}
									placeholder="7-40 char git commit"
								/>
								<div className="text-xs text-white/60 mt-1">
									This is the Git commit hash up to which we will verify your
									script. If you want to update your script later, you'll need
									to provide a new commit hash for us to verify.
								</div>
								{newScript.commit_hash &&
									!validateCommitHash(newScript.commit_hash) && (
										<div className="text-red-400 text-xs mt-1">
											invalid commit hash format
										</div>
									)}
							</div>

							<div className="flex items-center justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setShowNewModal(false)}
									className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 cursor-pointer"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={creating}
									className="shrink-0 py-2 px-4 flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10 disabled:opacity-60"
								>
									{creating ? "Submitting..." : "Submit for review"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
