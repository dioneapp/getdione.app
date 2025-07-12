import { motion } from "framer-motion";

export default function LoadingSkeleton() {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, i) => (
				<motion.div
					key={i}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3, delay: i * 0.1 }}
					className="bg-white/5 p-4 rounded-lg border border-white/10"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
								<div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
							</div>
						</div>
						<div className="flex gap-2">
							<div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
							<div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
}
