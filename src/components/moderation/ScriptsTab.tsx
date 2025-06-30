"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Pencil,
	X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

type Script = {
	id: string;
	name: string;
	author: string;
	description: string;
	logo_url?: string;
	created_at: string;
	status: string;
	pending_review: boolean;
	review_feedback: string | null;
};

function LoadingSkeleton() {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, i) => (
				<motion.div
					key={i}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3, delay: i * 0.1 }}
					className="bg-white/5 p-4 rounded-lg border border-white/10"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
								<div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
							</div>
						</div>
						<div className="flex gap-2">
							<div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
							<div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
}

export default function ScriptsTab() {
	const supabase = createSupabaseBrowserClient();
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
	const [denyFeedbackScriptId, setDenyFeedbackScriptId] = useState<
		string | null
	>(null);
	const [feedbackText, setFeedbackText] = useState("");

	const sortOptions = [
		{ value: "created_at", label: "Date Created", icon: "📅" },
		{ value: "name", label: "Name", icon: "📝" },
		{ value: "author", label: "Author", icon: "👤" },
		{ value: "downloads", label: "Downloads", icon: "⬇️" },
	];

	useEffect(() => {
		const fetchScripts = async () => {
			try {
				const { data, error } = await supabase.from("scripts").select("*");
				if (error) throw error;
				const statusOrder = { pending: 0, approved: 1, denied: 2 };
				const sorted = (data || []).sort((a, b) => {
					const sa = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
					const sb = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
					if (sa !== sb) return sa - sb;
					return (
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
				});
				setTotalCount(sorted.length);
				const start = (currentPage - 1) * itemsPerPage;
				const end = start + itemsPerPage;
				setScripts(sorted.slice(start, end));
			} catch (error) {
				console.error("Error fetching scripts:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchScripts();
	}, [currentPage, sortField, sortDirection, searchQuery]);

	const filteredScripts = scripts;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const handleApprove = async (scriptId: string) => {
		const { error } = await supabase
			.from("scripts")
			.update({
				status: "approved",
				pending_review: false,
				review_feedback: null,
			})
			.eq("id", scriptId);
		if (!error)
			setScripts(
				scripts.map((s) =>
					s.id === scriptId
						? {
								...s,
								status: "approved",
								pending_review: false,
								review_feedback: null,
							}
						: s,
				),
			);
	};

	const handleDeny = (scriptId: string) => {
		setDenyFeedbackScriptId(scriptId);
		setFeedbackText("");
	};

	const submitFeedback = async (scriptId: string) => {
		if (!scriptId) return;
		const { error } = await supabase
			.from("scripts")
			.update({
				status: "denied",
				pending_review: false,
				review_feedback: feedbackText,
			})
			.eq("id", scriptId);
		if (!error)
			setScripts(
				scripts.map((s) =>
					s.id === scriptId
						? {
								...s,
								status: "denied",
								pending_review: false,
								review_feedback: feedbackText,
							}
						: s,
				),
			);
		setDenyFeedbackScriptId(null);
		setFeedbackText("");
	};

	const handleSaveScript = async (updatedScript: Script) => {
		try {
			const { error } = await supabase
				.from("scripts")
				.update({
					name: updatedScript.name,
					author: updatedScript.author,
					description: updatedScript.description,
				})
				.eq("id", updatedScript.id);
			if (error) throw error;
			setScripts(
				scripts.map((s) =>
					s.id === updatedScript.id ? { ...s, ...updatedScript } : s,
				),
			);
			setEditingScript(null);
			setEditedScriptData(null);
		} catch (err) {
			console.error("Error updating script:", err);
		}
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
													<Image
														src={script.logo_url}
														alt={script.name}
														fill
														className="object-cover"
														sizes="48px"
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
												{script.status === "denied" &&
													script.review_feedback && (
														<div className="text-red-500 text-sm">
															Feedback: {script.review_feedback}
														</div>
													)}
												<div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
													{editingScript === script.id ? (
														<>
															<button
																onClick={() => {
																	setEditingScript(null);
																	setEditedScriptData(null);
																}}
																className="w-full sm:w-auto px-4 py-3 rounded-lg text-white/80 font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
															>
																cancel
															</button>
															<button
																onClick={() =>
																	editedScriptData &&
																	handleSaveScript(editedScriptData)
																}
																className="w-full sm:w-auto shrink-0 py-2.5 px-5 flex items-center justify-center gap-2 rounded-lg bg-white text-[#080808] font-bold cursor-pointer hover:bg-white/90 active:bg-white/80 transition-all shadow border border-black/10 focus:outline-none focus:ring-2 focus:ring-white/50"
															>
																<Check className="w-4 h-4" />
																save changes
															</button>
														</>
													) : denyFeedbackScriptId === script.id ? (
														<div className="w-full flex flex-col gap-2">
															<textarea
																value={feedbackText}
																onChange={(e) =>
																	setFeedbackText(e.target.value)
																}
																className="w-full border border-black/10 rounded-lg p-3 text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none shadow"
																rows={3}
																placeholder="Reason for denial..."
																autoFocus
															/>
															<div className="flex gap-2 justify-end">
																<button
																	onClick={() => setDenyFeedbackScriptId(null)}
																	className="px-5 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 active:bg-white/30 shadow transition-all flex items-center gap-2 cursor-pointer"
																>
																	<X className="w-4 h-4" />
																	Cancel
																</button>
																<button
																	onClick={() => submitFeedback(script.id)}
																	className="px-5 py-2 rounded-lg bg-red-500 text-white shadow border border-red-600 hover:bg-red-600 active:bg-red-700 transition-all cursor-pointer"
																	disabled={!feedbackText.trim()}
																>
																	Submit
																</button>
															</div>
														</div>
													) : (
														<>
															<button
																onClick={() => {
																	setEditingScript(script.id);
																	setEditedScriptData(script);
																}}
																className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 active:bg-white/30 transition-all flex items-center gap-2 cursor-pointer"
															>
																<Pencil className="w-4 h-4" />
																Edit details
															</button>
															<button
																onClick={() => handleApprove(script.id)}
																className="px-5 py-2 rounded-lg bg-green-500 text-white shadow border border-green-600 hover:bg-green-600 active:bg-green-700 transition-all flex items-center gap-2 cursor-pointer"
															>
																<Check className="w-4 h-4" />
																Approve
															</button>
															<button
																onClick={() => handleDeny(script.id)}
																className="px-5 py-2 rounded-lg bg-red-500 text-white shadow border border-red-600 hover:bg-red-600 active:bg-red-700 transition-all flex items-center gap-2 cursor-pointer"
															>
																<X className="w-4 h-4" />
																Deny
															</button>
														</>
													)}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</motion.div>
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
