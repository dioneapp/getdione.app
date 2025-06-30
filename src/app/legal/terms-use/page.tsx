import LegalCard from "@/components/legal/LegalCard";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function TermsPage() {
	return (
		<LegalPageLayout title="Terms of Use" updatedDate="June 11, 2025">
			<LegalCard title="Service Overview">
				<p>
					Dione ("we," "our," or "us") is a software installation platform that
					facilitates access to open-source artificial intelligence
					applications. We provide a technical interface to streamline the
					installation process of publicly available AI tools.
				</p>
			</LegalCard>

			<LegalCard title="Access to Third-Party Tools">
				<p>
					Our service exclusively provides access to open-source tools created
					and maintained by third parties. We do not own, control, or maintain
					these tools. The availability and functionality of these tools are
					subject to their respective authors' decisions and licenses.
				</p>
			</LegalCard>

			<LegalCard title="Disclaimer of Warranties">
				<p>
					The platform is provided "as is" and "as available" without any
					warranties of any kind. We do not guarantee the functionality,
					reliability, or availability of any third-party tools accessible
					through our platform. Users acknowledge that they use these tools at
					their own risk.
				</p>
			</LegalCard>

			<LegalCard title="User Responsibilities">
				<p>Users must:</p>
				<ul className="space-y-2">
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>
							Comply with all applicable laws and regulations while using the
							platform.
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
							Use the tools in accordance with their respective licenses and
							terms.
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>Not engage in any illegal or unauthorized activities.</span>
					</li>
				</ul>
			</LegalCard>

			<LegalCard title="Limitation of Liability">
				<p>
					We shall not be liable for any direct, indirect, incidental, special,
					consequential, or punitive damages resulting from:
				</p>
				<ul className="space-y-2">
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>The use or inability to use any third-party tools.</span>
					</li>
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>
							Any modifications or discontinuation of tools by their respective
							authors.
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>
							Any security issues or data breaches related to third-party tools.
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>Any technical malfunctions or errors in the tools.</span>
					</li>
				</ul>
			</LegalCard>

			<LegalCard title="Modifications to Terms">
				<p>
					We reserve the right to modify these terms at any time. Users will be
					notified of any changes, and continued use of the platform constitutes
					acceptance of the modified terms.
				</p>
			</LegalCard>

			<LegalCard title="Contact">
				<p>
					For questions about these terms, please contact us at{" "}
					<a
						href="mailto:support@getdione.app"
						className="text-white/80 underline"
					>
						support@getdione.app
					</a>
					.
				</p>
			</LegalCard>
		</LegalPageLayout>
	);
}