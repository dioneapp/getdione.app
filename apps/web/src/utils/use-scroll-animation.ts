import { useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export const useScrollAnimation = (threshold = 0.1, once = true) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: threshold, once });
	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			mainControls.start("visible");
		}
	}, [isInView, mainControls]);

	return { ref, mainControls };
};

// Animation variants for different types of animations
export const fadeInUpVariants = {
	hidden: {
		opacity: 0,
		y: 50,
	},
	visible: {
		opacity: 1,
		y: 0,
	},
};

export const fadeInVariants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
};

export const scaleInVariants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
	},
	visible: {
		opacity: 1,
		scale: 1,
	},
};

export const slideInLeftVariants = {
	hidden: {
		opacity: 0,
		x: -50,
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

export const slideInRightVariants = {
	hidden: {
		opacity: 0,
		x: 50,
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

export const staggerContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

export const staggerItemVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
	},
};

// Default transition for smooth animations
export const defaultTransition = {
	duration: 0.6,
	ease: "easeOut" as const,
};

export const slowTransition = {
	duration: 0.8,
	ease: "easeOut" as const,
};
