export default function PrivacyPage() {
	return (
		<main>

			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				></div>

				<h1 className="text-5xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					Privacy Policy
				</h1>
				<p
					className="mt-4 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4"
					style={{ textRendering: "optimizeLegibility" }}
				>
					Updated: June 11, 2025
				</p>

				<section
					className="grid grid-cols-1 gap-4 sm:gap-6 mt-8 px-4 max-w-4xl w-full"
					aria-labelledby="features-heading"
				>
					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Information We Collect
						</h2>
						<div className="text-white/80 leading-relaxed space-y-4">
							<p>We collect the following information:</p>
							<ul className="space-y-2">
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Account Information: Email address and username required for
										account creation.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										System Diagnostics (Optional): Anonymous system information
										about your operating system when you choose to submit error
										reports.
									</span>
								</li>
							</ul>
						</div>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							How We Use Your Information
						</h2>
						<div className="text-white/80 leading-relaxed space-y-4">
							<p>We use the collected information for:</p>
							<ul className="space-y-2">
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Account Management: To create and manage your user account.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Service Improvement: To analyze system diagnostics (when
										provided) and improve our service.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Communication: To send important updates about our service.
									</span>
								</li>
							</ul>
						</div>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Data Storage and Security
						</h2>
						<p className="text-white/80 leading-relaxed">
							We use Supabase as our database provider and authentication
							service. All data is stored securely and processed in accordance
							with industry standards. For more information about Supabase's
							security practices, we encourage you to visit their websites.
						</p>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Data Retention and Deletion
						</h2>
						<div className="text-white/80 leading-relaxed space-y-4">
							<p>
								We retain your data as long as you maintain an active account.
								You can delete your data by:
							</p>
							<ul className="space-y-2">
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Using the account deletion option in your account settings.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Contacting us via email to request account deletion.
									</span>
								</li>
							</ul>
						</div>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Your Rights
						</h2>
						<div className="text-white/80 leading-relaxed space-y-4">
							<p>You have the right to:</p>
							<ul className="space-y-2">
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>Access your personal data.</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>Correct any inaccurate information.</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Request deletion of your account and associated data.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>Opt-out of system diagnostics.</span>
								</li>
							</ul>
						</div>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Changes to This Policy
						</h2>
						<p className="text-white/80 leading-relaxed">
							We may update this privacy policy from time to time. We will
							notify you of any changes by posting the new policy on this page
							and updating the "Updated" date at the top of this policy.
						</p>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Contact Us
						</h2>
						<p className="text-white/80 leading-relaxed">
							If you have any questions about this privacy policy, please
							contact us at{" "}
							<a
								href="mailto:support@getdione.app"
								className="text-white/80 underline"
							>
								support@getdione.app
							</a>
							.
						</p>
					</article>
				</section>
			</div>
		</main>
	);
}
