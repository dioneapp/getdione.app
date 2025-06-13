import Link from "next/link";

export default function NotFound() {
	return (
		<main className="min-h-screen flex items-center justify-center px-6">
			<div className="text-center">
				<h1 className="text-9xl font-bold text-white mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-white mb-6">
					Page Not Found
				</h2>
				<p className="text-white/70 mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Link
					href="/"
					className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
						fill="currentColor"
					>
						<path d="M480-160 160-480l320-320 42 42-248 248h526v60H274l248 248-42 42Z" />
					</svg>
					Back to Home
				</Link>
			</div>
		</main>
	);
}
