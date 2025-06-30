"use client";
import type { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Pencil,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ExtendedUser } from "@/types/database";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

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

export default function UsersTab() {
	const supabase = createSupabaseBrowserClient();
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<any>(null);
	const [users, setUsers] = useState<ExtendedUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [expandedUser, setExpandedUser] = useState<string | null>(null);
	const [editingUser, setEditingUser] = useState<string | null>(null);
	const [editedUserData, setEditedUserData] = useState<ExtendedUser | null>(
		null,
	);
	const [sortField, setSortField] = useState("created_at");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const itemsPerPage = 10;

	const sortOptions = [
		{ value: "created_at", label: "Date Created", icon: "📅" },
		{ value: "username", label: "Username", icon: "👤" },
		{ value: "email", label: "Email", icon: "✉️" },
		{ value: "first_name", label: "First Name", icon: "👨‍💼" },
	];

	useEffect(() => {
		async function getSession() {
			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange((_, session) =>
				setSession(session as Session),
			);
			return () => subscription.unsubscribe();
		}
		getSession();
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const { count, error: countError } = await supabase
					.from("users")
					.select("*", { count: "exact", head: true })
					.or(
						`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%`,
					);
				if (countError) throw countError;
				setTotalCount(count || 0);
				const { data: usersData, error } = await supabase
					.from("users")
					.select("*")
					.or(
						`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%`,
					)
					.order(sortField, { ascending: sortDirection === "asc" })
					.range(
						(currentPage - 1) * itemsPerPage,
						currentPage * itemsPerPage - 1,
					);
				if (error) throw error;
				const usersWithMetadata = await Promise.all(
					(usersData || []).map(async (user) => {
						const { data: authData } = await supabase.auth.admin.getUserById(
							user.id,
						);
						return {
							...user,
							app_metadata: authData?.user?.app_metadata,
							user_metadata: authData?.user?.user_metadata,
						};
					}),
				);
				setUsers(usersWithMetadata);
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [currentPage, sortField, sortDirection, searchQuery]);

	const filteredUsers = users;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const handleSaveUser = async (updatedUser: ExtendedUser) => {
		try {
			const updateData = {
				username: updatedUser.username,
				email: updatedUser.email,
				first_name: updatedUser.first_name,
				location: updatedUser.location,
				bio: updatedUser.bio,
				moderator: updatedUser.moderator,
				publisher: updatedUser.publisher,
				tester: updatedUser.tester,
			};
			const { error } = await supabase
				.from("users")
				.update(updateData)
				.eq("id", updatedUser.id);
			if (error) throw error;
			setUsers(
				users.map((user) =>
					user.id === updatedUser.id ? { ...user, ...updateData } : user,
				),
			);
			setEditingUser(null);
			setEditedUserData(null);
			setExpandedUser(null);
		} catch (error) {
			console.error("Error updating user:", error);
			alert("Failed to update user. Please try again.");
			throw error;
		}
	};

	const startEditing = (user: ExtendedUser) => {
		if (profile?.moderator) {
			setEditingUser(user.id);
			setEditedUserData(user);
		}
	};

	const cancelEditing = () => {
		setEditingUser(null);
		setEditedUserData(null);
	};

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<input
						type="text"
						placeholder="Search users..."
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
						{filteredUsers.map((user) => (
							<motion.div
								key={user.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
							>
								<div
									className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
									onClick={() =>
										setExpandedUser(expandedUser === user.id ? null : user.id)
									}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
												{user?.avatar_url ? (
													<Image
														src={user.avatar_url}
														alt="Profile"
														fill
														className="object-cover"
														sizes="48px"
													/>
												) : (
													<div className="w-full h-full bg-white/10 flex items-center justify-center">
														<span className="text-white/50 text-xl">
															{user?.username?.[0]?.toUpperCase() || "?"}
														</span>
													</div>
												)}
											</div>
											<div>
												<h3 className="text-lg font-medium text-white truncate">
													{user.first_name}
												</h3>
												<p className="text-white/60 truncate">
													@{user.username}
												</p>
												<p className="text-white/60 text-sm truncate">
													{user.email}
												</p>
											</div>
										</div>
									</div>
								</div>
								<AnimatePresence>
									{expandedUser === user.id && (
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
															Username
														</label>
														{editingUser === user.id ? (
															<input
																type="text"
																value={editedUserData?.username || ""}
																onChange={(e) =>
																	setEditedUserData(
																		(prev: ExtendedUser | null) =>
																			prev
																				? { ...prev, username: e.target.value }
																				: null,
																	)
																}
																className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															/>
														) : (
															<p className="text-white">{user.username}</p>
														)}
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Email
														</label>
														{editingUser === user.id ? (
															<input
																type="email"
																value={editedUserData?.email || ""}
																onChange={(e) =>
																	setEditedUserData(
																		(prev: ExtendedUser | null) =>
																			prev
																				? { ...prev, email: e.target.value }
																				: null,
																	)
																}
																className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															/>
														) : (
															<p className="text-white">{user.email}</p>
														)}
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															First Name
														</label>
														{editingUser === user.id ? (
															<input
																type="text"
																value={editedUserData?.first_name || ""}
																onChange={(e) =>
																	setEditedUserData(
																		(prev: ExtendedUser | null) =>
																			prev
																				? {
																						...prev,
																						first_name: e.target.value,
																					}
																				: null,
																	)
																}
																className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															/>
														) : (
															<p className="text-white">{user.first_name}</p>
														)}
													</div>
													<div>
														<label className="block text-sm text-white/60 mb-1">
															Location
														</label>
														{editingUser === user.id ? (
															<input
																type="text"
																value={editedUserData?.location || ""}
																onChange={(e) =>
																	setEditedUserData(
																		(prev: ExtendedUser | null) =>
																			prev
																				? { ...prev, location: e.target.value }
																				: null,
																	)
																}
																className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															/>
														) : (
															<p className="text-white">
																{user.location || "Not set"}
															</p>
														)}
													</div>
												</div>
												<div>
													<label className="block text-sm text-white/60 mb-1">
														Bio
													</label>
													{editingUser === user.id ? (
														<textarea
															value={editedUserData?.bio || ""}
															onChange={(e) =>
																setEditedUserData(
																	(prev: ExtendedUser | null) =>
																		prev
																			? { ...prev, bio: e.target.value }
																			: null,
																)
															}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
															rows={3}
														/>
													) : (
														<p className="text-white">{user.bio || "No bio"}</p>
													)}
												</div>
												<div className="flex flex-col sm:flex-row gap-4">
													<div className="flex items-center gap-2">
														<input
															type="checkbox"
															checked={
																editingUser === user.id
																	? editedUserData?.moderator
																	: user.moderator
															}
															onChange={(e) =>
																setEditedUserData(
																	(prev: ExtendedUser | null) =>
																		prev
																			? { ...prev, moderator: e.target.checked }
																			: null,
																)
															}
															disabled={editingUser !== user.id}
															className="w-5 h-5 rounded border-white/20 bg-white/5"
														/>
														<span className="text-white/60">Moderator</span>
													</div>
													<div className="flex items-center gap-2">
														<input
															type="checkbox"
															checked={
																editingUser === user.id
																	? editedUserData?.publisher
																	: user.publisher
															}
															onChange={(e) =>
																setEditedUserData(
																	(prev: ExtendedUser | null) =>
																		prev
																			? { ...prev, publisher: e.target.checked }
																			: null,
																)
															}
															disabled={editingUser !== user.id}
															className="w-5 h-5 rounded border-white/20 bg-white/5"
														/>
														<span className="text-white/60">Publisher</span>
													</div>
													<div className="flex items-center gap-2">
														<input
															type="checkbox"
															checked={
																editingUser === user.id
																	? editedUserData?.tester
																	: user.tester
															}
															onChange={(e) =>
																setEditedUserData(
																	(prev: ExtendedUser | null) =>
																		prev
																			? { ...prev, tester: e.target.checked }
																			: null,
																)
															}
															disabled={editingUser !== user.id}
															className="w-5 h-5 rounded border-white/20 bg-white/5"
														/>
														<span className="text-white/60">Tester</span>
													</div>
												</div>
												<div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
													{editingUser === user.id ? (
														<>
															<button
																onClick={cancelEditing}
																className="w-full sm:w-auto px-4 py-3 hover:text-white/70 rounded-lg text-white/80 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
															>
																Cancel
															</button>
															<button
																onClick={() =>
																	editedUserData &&
																	handleSaveUser(editedUserData)
																}
																className="w-full sm:w-auto shrink-0 py-2 px-4 flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
															>
																<Check className="w-4 h-4" />
																Save Changes
															</button>
														</>
													) : profile?.moderator ? (
														<button
															onClick={() => startEditing(user)}
															className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer"
														>
															<Pencil className="w-4 h-4" />
															Edit Details
														</button>
													) : (
														<div className="text-white/60 text-sm truncate">
															You need moderator privileges to edit user
															profiles
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
					<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="text-white/60 text-center sm:text-left truncate">
							Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
							{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
							users
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
