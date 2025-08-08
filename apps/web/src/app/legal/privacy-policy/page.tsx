import LegalCard from "@/components/legal/LegalCard";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function PrivacyPage() {
	return (
		<LegalPageLayout title="Privacy Policy" updatedDate="June 11, 2025">
			<LegalCard title="Information We Collect">
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
							System Diagnostics (Optional): Anonymous system information about
							your operating system when you choose to submit error reports.
						</span>
					</li>
				</ul>
			</LegalCard>

			<LegalCard title="How We Use Your Information">
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
							Service Improvement: To analyze system diagnostics (when provided)
							and improve our service.
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>
							Communication: To send important updates about our service.
						</span>
					</li>
				</ul>
			</LegalCard>

			<LegalCard title="Data Storage and Security">
				<p>
					We use Supabase as our database provider and authentication service.
					All data is stored securely and processed in accordance with industry
					standards. For more information about Supabase&rsquo;s security
					practices, we encourage you to visit their websites.
				</p>
			</LegalCard>

			<LegalCard title="Data Retention and Deletion">
				<p>
					We retain your data as long as you maintain an active account. You can
					delete your data by:
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
						<span>Contacting us via email to request account deletion.</span>
					</li>
				</ul>
			</LegalCard>

			<LegalCard title="Your Rights">
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
						<span>Request deletion of your account and associated data.</span>
					</li>
					<li className="flex items-start">
						<span className="text-white/80 mr-2">•</span>
						<span>Opt-out of system diagnostics.</span>
					</li>
				</ul>
			</LegalCard>

			<LegalCard title="Changes to This Policy">
				<p>
					We may update this privacy policy from time to time. We will notify
					you of any changes by posting the new policy on this page and updating
					the &quot;Updated&quot; date at the top of this policy.
				</p>
			</LegalCard>

			<LegalCard title="Contact Us">
				<p>
					If you have any questions about this privacy policy, please contact us
					at{" "}
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
