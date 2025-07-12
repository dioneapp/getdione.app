export default function LoginTerms() {
	return (
		<div className="mt-4 text-center text-white/70 text-sm">
			By logging in, you agree to our
			<a
				href="/legal/terms-use"
				target="_blank"
				className="text-[#BCB1E7] hover:underline"
				rel="noreferrer"
			>
				{" "}
				Terms of Use
			</a>{" "}
			and
			<a
				href="/legal/privacy-policy"
				target="_blank"
				className="text-[#BCB1E7] hover:underline"
				rel="noreferrer"
			>
				{" "}
				Privacy Policy
			</a>
			.
		</div>
	);
}
