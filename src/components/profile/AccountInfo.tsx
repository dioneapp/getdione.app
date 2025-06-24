import type { ExtendedUser } from "@/types/database";
import { FlaskConical, Shield, Crown } from "lucide-react";

interface AccountInfoProps {
	user: ExtendedUser | null;
	showEmail?: boolean;
	email?: string;
	lastSignInAt?: string;
}

export default function AccountInfo({
	user,
	showEmail = false,
	email,
	lastSignInAt,
}: AccountInfoProps) {
	return (
		<div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
			<div className="grid grid-cols-2 gap-4">
				{showEmail && (
					<div>
						<p className="text-white/50 text-sm">Email</p>
						<p className="text-white truncate max-w-[200px] md:blur-sm md:hover:blur-none transition-all duration-300">
							{email}
						</p>
					</div>
				)}
				<div>
					<p className="text-white/50 text-sm">Member Since</p>
					<div className="relative inline-block cursor-pointer">
						<div className="peer">
							<p className="text-white">
								{user?.created_at
									? new Date(user.created_at).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
							{user?.created_at
								? new Date(user.created_at).toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})
								: "N/A"}
						</div>
					</div>
				</div>
				{lastSignInAt && (
					<div>
						<p className="text-white/50 text-sm">Last Sign In</p>
						<div className="relative inline-block cursor-pointer">
							<div className="peer">
								<p className="text-white">
									{new Date(lastSignInAt).toLocaleDateString()}
								</p>
							</div>
							<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
								{new Date(lastSignInAt).toLocaleDateString("en-US", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>
					</div>
				)}
				<div>
					<p className="text-white/50 text-sm">Badges</p>
					<div className="flex gap-2">
						{user?.tester || user?.publisher || user?.moderator ? (
							<>
								{user?.tester && (
									<div className="relative inline-block cursor-pointer">
										<div className="peer">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24px"
												viewBox="0 -960 960 960"
												width="24px"
												fill="#e3e3e3"
											>
												<path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Z" />
											</svg>
										</div>
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
											Tester
										</div>
									</div>
								)}
								{user?.publisher && (
									<div className="relative inline-block cursor-pointer">
										<div className="peer">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24px"
												viewBox="0 -960 960 960"
												width="24px"
												fill="#e3e3e3"
											>
												<path d="M440-91 160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm0-366v274l40 23 40-23v-274l240-139v-42l-43-25-237 137-237-137-43 25v42l240 139Z" />
											</svg>
										</div>
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
											Publisher
										</div>
									</div>
								)}
								{user?.moderator && (
									<div className="relative inline-block cursor-pointer">
										<div className="peer">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24px"
												viewBox="0 -960 960 960"
												width="24px"
												fill="#e3e3e3"
											>
												<path d="M714-162 537-339l84-84 177 177q17 17 17 42t-17 42q-17 17-42 17t-42-17Zm-552 0q-17-17-17-42t17-42l234-234-68-68q-11 11-28 11t-28-11l-23-23v90q0 14-12 19t-22-5L106-576q-10-10-5-22t19-12h90l-22-22q-12-12-12-28t12-28l114-114q20-20 43-29t47-9q20 0 37.5 6t34.5 18q8 5 8.5 14t-6.5 16l-76 76 22 22q11 11 11 28t-11 28l68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q8 0 15 .5t14 2.5q9 3 11.5 12.5T737-809l-65 65q-6 6-6 14t6 14l44 44q6 6 14 6t14-6l65-65q7-7 16.5-5t12.5 12q2 7 2.5 14t.5 15q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L246-162q-17 17-42 17t-42-17Z" />
											</svg>
										</div>
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
											Moderator
										</div>
									</div>
								)}
							</>
						) : (
							<p className="text-white">No badges yet</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
