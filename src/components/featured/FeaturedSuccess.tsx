export default function FeaturedSuccess() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8">
			<div className="relative text-center max-w-xl">
				<h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tighter mb-6">
					Submission Received!
				</h1>
				<p className="text-lg sm:text-xl text-white/80 mb-8">
					Thank you for submitting your tool for featuring. Our team will review
					your submission and contact you at the email provided in a few days.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/"
						className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 font-medium text-white bg-white/10 backdrop-blur border border-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
					>
						Return Home
					</a>
				</div>
			</div>
		</main>
	);
} 