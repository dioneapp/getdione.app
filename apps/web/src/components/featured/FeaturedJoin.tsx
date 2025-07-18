import { ArrowRight } from "lucide-react";

export default function FeaturedJoin({
	error,
	handleSubmit,
}: {
	error: string;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
	return (
		<main>
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

				<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					Feature Your AI Tool
				</h1>

				<h2 className="mt-4 mb-8 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4">
					Submit your project for consideration in our featured section.
					Showcase your tool to thousands of AI developers and enthusiasts.
				</h2>

				{error && (
					<div className="w-full max-w-xl mb-6">
						<div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg">
							{error}
						</div>
					</div>
				)}

				<form
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
									Your Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									required
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="John Doe"
								/>
							</div>
							<div className="flex-1">
								<label
									htmlFor="email"
									className="block text-sm font-medium text-white mb-2"
								>
									Your Email
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
								htmlFor="tool_name"
								className="block text-sm font-medium text-white mb-2"
							>
								Tool Name
							</label>
							<input
								type="text"
								id="tool_name"
								name="tool_name"
								required
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
								placeholder="Your tool's official name"
							/>
						</div>

						<div className="flex gap-4 flex-col sm:flex-row">
							<div className="flex-1">
								<label
									htmlFor="github"
									className="block text-sm font-medium text-white mb-2"
								>
									GitHub URL
								</label>
								<input
									type="url"
									id="github"
									name="github"
									required
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="https://github.com/your-project"
								/>
							</div>
							<div className="flex-1">
								<label
									htmlFor="website"
									className="block text-sm font-medium text-white mb-2"
								>
									Website
								</label>
								<input
									type="url"
									id="website"
									name="website"
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="https://your-tool.com"
								/>
							</div>
						</div>

						<div className="flex gap-4 flex-col sm:flex-row">
							<div className="flex-1">
								<label
									htmlFor="contact_email"
									className="block text-sm font-medium text-white mb-2"
								>
									Contact Email
								</label>
								<input
									type="email"
									id="contact_email"
									name="contact_email"
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="contact@your-tool.com"
								/>
							</div>
							<div className="flex-1">
								<label
									htmlFor="social"
									className="block text-sm font-medium text-white mb-2"
								>
									Social Media
								</label>
								<input
									type="text"
									id="social"
									name="social"
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
									placeholder="Twitter/LinkedIn handles"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="objective"
								className="block text-sm font-medium text-white mb-2"
							>
								Tool Objective
							</label>
							<textarea
								id="objective"
								name="objective"
								required
								rows={3}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
								placeholder="Briefly describe the purpose and functionality of your tool"
							/>
						</div>

						<div>
							<label
								htmlFor="tags"
								className="block text-sm font-medium text-white mb-2"
							>
								Tool Tags
							</label>
							<input
								type="text"
								id="tags"
								name="tags"
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
								placeholder="Comma-separated tags (e.g., AI, ML, NLP, Computer Vision)"
							/>
						</div>

						<div className="flex gap-4 flex-col sm:flex-row">
							<div className="flex-1">
								<label
									htmlFor="category"
									className="block text-sm font-medium text-white mb-2"
								>
									Category
								</label>
								<select
									id="category"
									name="category"
									required
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
									defaultValue={""}
								>
									<option value="" disabled className="bg-[#080808]">
										Select category
									</option>
									<option value="Machine Learning" className="bg-[#080808]">
										Machine Learning
									</option>
									<option
										value="Natural Language Processing"
										className="bg-[#080808]"
									>
										NLP
									</option>
									<option value="Computer Vision" className="bg-[#080808]">
										Computer Vision
									</option>
									<option value="Data Analysis" className="bg-[#080808]">
										Data Analysis
									</option>
									<option value="Developer Tools" className="bg-[#080808]">
										Developer Tools
									</option>
									<option value="Other" className="bg-[#080808]">
										Other
									</option>
								</select>
							</div>
							<div className="flex-1">
								<label
									htmlFor="audience"
									className="block text-sm font-medium text-white mb-2"
								>
									Target Audience
								</label>
								<select
									id="audience"
									name="audience"
									required
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
									defaultValue={""}
								>
									<option value="" disabled className="bg-[#080808]">
										Select audience
									</option>
									<option value="Developers" className="bg-[#080808]">
										Developers
									</option>
									<option value="Researchers" className="bg-[#080808]">
										Researchers
									</option>
									<option value="Businesses" className="bg-[#080808]">
										Businesses
									</option>
									<option value="Students" className="bg-[#080808]">
										Students
									</option>
									<option value="General Public" className="bg-[#080808]">
										General Public
									</option>
								</select>
							</div>
						</div>

						<div>
							<label
								htmlFor="metrics"
								className="block text-sm font-medium text-white mb-2"
							>
								Key Metrics
							</label>
							<input
								type="text"
								id="metrics"
								name="metrics"
								required
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
								placeholder="Monthly users, downloads, or other metrics"
							/>
						</div>

						<div>
							<label
								htmlFor="testimonials"
								className="block text-sm font-medium text-white mb-2"
							>
								User Testimonials
							</label>
							<textarea
								id="testimonials"
								name="testimonials"
								rows={3}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
								placeholder="Paste user testimonials or reviews (if available)"
							/>
							<p className="text-xs text-white/50">Optional</p>
						</div>

						<div>
							<label
								htmlFor="reason"
								className="block text-sm font-medium text-white mb-2"
							>
								Why Should We Feature Your Tool?
							</label>
							<textarea
								id="reason"
								name="reason"
								rows={3}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
								placeholder="Explain what makes your tool unique and valuable to our community"
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="financial_interest"
									name="financial_interest"
									value="yes"
									className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white/50"
								/>
								<label
									htmlFor="financial_interest"
									className="text-sm text-white/80"
								>
									I'm interested in financially supporting the featuring of this
									tool
								</label>
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
									Receive platform updates and featuring opportunities
								</label>
							</div>
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
							Submit for Featuring
							<ArrowRight className="w-5 h-5" />
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
