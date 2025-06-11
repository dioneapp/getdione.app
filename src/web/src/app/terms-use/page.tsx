export default function TermsPage() {
	return (
		<main>
			<div
				className="fixed inset-0 flex justify-center items-center"
				aria-hidden="true"
			>
				<div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
			</div>

			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				></div>

				<h1 className="text-5xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					Terms of Use
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
							Service Overview
						</h2>
						<p className="text-white/80 leading-relaxed">
							Dione ("we," "our," or "us") is a software installation platform
							that facilitates access to open-source artificial intelligence
							applications. We provide a technical interface to streamline the
							installation process of publicly available AI tools.
						</p>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Access to Third-Party Tools
						</h2>
						<p className="text-white/80 leading-relaxed">
							Our service exclusively provides access to open-source tools
							created and maintained by third parties. We do not own, control,
							or maintain these tools. The availability and functionality of
							these tools are subject to their respective authors' decisions and
							licenses.
						</p>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Disclaimer of Warranties
						</h2>
						<p className="text-white/80 leading-relaxed">
							The platform is provided "as is" and "as available" without any
							warranties of any kind. We do not guarantee the functionality,
							reliability, or availability of any third-party tools accessible
							through our platform. Users acknowledge that they use these tools
							at their own risk.
						</p>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							User Responsibilities
						</h2>
						<div className="text-white/80 leading-relaxed space-y-4">
							<p>Users must:</p>
							<ul className="space-y-2">
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Comply with all applicable laws and regulations while using
										the platform.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Respect intellectual property rights and copyright laws.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Use the tools in accordance with their respective licenses
										and terms.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Not engage in any illegal or unauthorized activities.
									</span>
								</li>
							</ul>
						</div>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Limitation of Liability
						</h2>
						<div className="text-white/80 leading-relaxed space-y-4">
							<p>
								We shall not be liable for any direct, indirect, incidental,
								special, consequential, or punitive damages resulting from:
							</p>
							<ul className="space-y-2">
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										The use or inability to use any third-party tools.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Any modifications or discontinuation of tools by their
										respective authors.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Any security issues or data breaches related to third-party
										tools.
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-white/80 mr-2">•</span>
									<span>
										Any technical malfunctions or errors in the tools.
									</span>
								</li>
							</ul>
						</div>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Modifications to Terms
						</h2>
						<p className="text-white/80 leading-relaxed">
							We reserve the right to modify these terms at any time. Users will
							be notified of any changes, and continued use of the platform
							constitutes acceptance of the modified terms.
						</p>
					</article>

					<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
						<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
							Contact
						</h2>
						<p className="text-white/80 leading-relaxed">
							For questions about these terms, please contact us at{" "}
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
