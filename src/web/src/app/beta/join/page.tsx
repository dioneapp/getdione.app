"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// form submission handler
async function submitForm(formData: FormData) {
	const trapField = formData.get("trap_field")?.toString() || "";
	if (trapField !== "") {
		throw new Error("Form submission rejected.");
	}

	const name = formData.get("name")?.toString() || "";
	const email = formData.get("email")?.toString() || "";
	const reason = formData.get("reason")?.toString() || "";
	const os = formData.get("os")?.toString() || "";
	const role = formData.get("role")?.toString() || "";
	const experience = formData.get("experience")?.toString() || "";
	const usage = formData.get("usage")?.toString() || "";
	const updates = formData.get("updates")?.toString() || "no";
	const discord = formData.get("discord")?.toString() || "no";

	if (!name || !email || !os || !role || !experience || !usage) {
		throw new Error("All fields are required");
	}

	const webhookBody = {
		embeds: [
			{
				title: "New Beta Program Signup",
				color: 0xbcb1e7,
				fields: [
					{ name: "Name", value: name, inline: true },
					{ name: "Email", value: email, inline: true },
					{ name: "Operating System", value: os, inline: true },
					{ name: "Role", value: role, inline: true },
					{ name: "AI Experience", value: experience, inline: true },
					{ name: "Intended Usage", value: usage, inline: true },
					{
						name: "Newsletter Signup",
						value: updates === "yes" ? "Subscribed" : "Not subscribed",
						inline: true,
					},
					{ name: "Reason for Interest", value: reason },
					{
						name: "Joined Discord",
						value: discord === "yes" ? "Yes" : "No",
						inline: true,
					},
				],
				timestamp: new Date().toISOString(),
			},
		],
	};

	const response = await fetch("/api/beta", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(webhookBody),
	});

	if (!response.ok) {
		throw new Error("Failed to submit application");
	}

	return discord === "yes";
}

export default function BetaJoin() {
	const router = useRouter();
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");

		try {
			const formData = new FormData(e.currentTarget);
			const joinDiscord = await submitForm(formData);
			router.push(
				joinDiscord ? "/beta/success?joinDiscord=true" : "/beta/success",
			);
		} catch (e) {
			console.error("Form submission error:", e);
			setError(
				"There was an error submitting your application. Please try again.",
			);
		}
	}

	return (
		<main>
			{/* background elements */}
			<div
				className="fixed inset-0 flex justify-center items-center"
				aria-hidden="true"
			>
				<div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]" />
			</div>

			{/* main content */}
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

				<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					Join the Beta Program
				</h1>

				<h2 className="mt-4 mb-8 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4">
					Be among the first to try Dione and help shape the future of AI app
					management.
				</h2>

				{error && (
					<div className="w-full max-w-xl mb-6">
						<div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg">
							{error}
						</div>
					</div>
				)}

				<form
					id="beta-join-form"
					onSubmit={handleSubmit}
					className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10"
				>
					<div className="space-y-4">
						<div className="flex gap-4 flex-col sm:flex-row">
							<div className="flex-1">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-white mb-2"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									required
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="Your name"
								/>
							</div>
							<div className="flex-1">
								<label
									htmlFor="email"
									className="block text-sm font-medium text-white mb-2"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="your@email.com"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="role"
								className="block text-sm font-medium text-white mb-2"
							>
								What best describes your role?
							</label>
							<select
								id="role"
								name="role"
								required
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
							>
								<option value="" disabled className="bg-[#080808]">
									Select your role
								</option>
								<option value="Developer" className="bg-[#080808]">
									Developer
								</option>
								<option value="Data Scientist" className="bg-[#080808]">
									Data Scientist
								</option>
								<option value="Researcher" className="bg-[#080808]">
									Researcher
								</option>
								<option value="Student" className="bg-[#080808]">
									Student
								</option>
								<option value="Business Professional" className="bg-[#080808]">
									Business Professional
								</option>
								<option value="Other" className="bg-[#080808]">
									Other
								</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="experience"
								className="block text-sm font-medium text-white mb-2"
							>
								Experience with AI tools
							</label>
							<select
								id="experience"
								name="experience"
								required
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
							>
								<option value="" disabled className="bg-[#080808]">
									Select your experience level
								</option>
								<option value="Beginner" className="bg-[#080808]">
									Beginner - Just starting out
								</option>
								<option value="Intermediate" className="bg-[#080808]">
									Intermediate - Regular user
								</option>
								<option value="Advanced" className="bg-[#080808]">
									Advanced - Power user
								</option>
								<option value="Expert" className="bg-[#080808]">
									Expert - Professional experience
								</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="usage"
								className="block text-sm font-medium text-white mb-2"
							>
								Primary intended usage
							</label>
							<select
								id="usage"
								name="usage"
								required
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
							>
								<option value="" disabled className="bg-[#080808]">
									Select primary usage
								</option>
								<option value="Personal Projects" className="bg-[#080808]">
									Personal Projects
								</option>
								<option value="Professional Work" className="bg-[#080808]">
									Professional Work
								</option>
								<option value="Academic Research" className="bg-[#080808]">
									Academic Research
								</option>
								<option value="Business Applications" className="bg-[#080808]">
									Business Applications
								</option>
								<option value="Learning/Education" className="bg-[#080808]">
									Learning/Education
								</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="os"
								className="block text-sm font-medium text-white mb-2"
							>
								Operating System
							</label>
							<select
								id="os"
								name="os"
								required
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
							>
								<option value="" disabled className="bg-[#080808]">
									Select your OS
								</option>
								<option value="Windows" className="bg-[#080808]">
									Windows
								</option>
								<option value="macOS" className="bg-[#080808]">
									macOS
								</option>
								<option value="Linux" className="bg-[#080808]">
									Linux
								</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="reason"
								className="block text-sm font-medium text-white mb-2"
							>
								Why are you interested in Dione?
							</label>
							<textarea
								id="reason"
								name="reason"
								rows={4}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
								placeholder="Tell us why you want to join the beta program..."
								maxLength={1000}
							/>
							<p className="text-xs text-white/50">Optional</p>
						</div>

						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="updates"
								name="updates"
								value="yes"
								className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white/50"
							/>
							<label htmlFor="updates" className="text-sm text-white/80">
								Keep me updated about Dione news and releases
							</label>
						</div>
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="discord"
								name="discord"
								value="yes"
								className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white/50"
								defaultChecked
							/>
							<label htmlFor="discord" className="text-sm text-white/80">
								Want to join the Discord server to get priority?
							</label>
						</div>
						<input
							type="text"
							name="trap_field"
							style={{ display: "none" }}
							tabIndex={-1}
							autoComplete="off"
						/>

						<button
							type="submit"
							className="w-full font-semibold shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10 cursor-pointer"
						>
							Submit Application
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M5 12h14" />
								<path d="m12 5 7 7-7 7" />
							</svg>
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
