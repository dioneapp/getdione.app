export default function LoginTerms() {
	return (
		<div className="mt-3 text-center text-white/60 text-xs whitespace-nowrap">
			By continuing you agree to our
			<a
				href="/legal/terms-use"
				target="_blank"
				className="text-[#BCB1E7] hover:underline"
				rel="noreferrer"
			>
				{" "}
				Terms
			</a>{" "}
			and
			<a
				href="/legal/privacy-policy"
				target="_blank"
				className="text-[#BCB1E7] hover:underline"
				rel="noreferrer"
			>
				{" "}
				Privacy
			</a>
			.
		</div>
	);
}
