import { supabase } from "@/utils/database";
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pencil } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import LoadingSkeleton from "./loading-skeleton";
import { AnimatePresence, motion } from "framer-motion";

// add type for script data
type Script = {
	id: string;
	name: string;
	author: string;
	description: string;
	logo_url?: string;
	created_at: string;
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

												<div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
													{editingScript === script.id ? (
														<>
															<button
																onClick={cancelEditing}
																className="w-full sm:w-auto px-4 py-3 hover:text-white/70 rounded-lg text-white/80 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
															>
																Cancel
															</button>
															<button
																onClick={() =>
																	editedScriptData &&
																	handleSaveScript(editedScriptData)
																}
																className="w-full sm:w-auto shrink-0 py-2 px-4 flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
															>
																<Check className="w-4 h-4" />
																Save Changes
															</button>
														</>
													) : (
														<button
															onClick={() => startEditing(script)}
															className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer"
														>
															<Pencil className="w-4 h-4" />
															Edit Details
														</button>
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