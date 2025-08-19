import Image from "next/image";
import React from "react";

export default function LoginWelcome({ isAppLogin }: { isAppLogin: boolean }) {
	return (
		<div className="flex flex-col items-center text-center">
			<Image
				src="/Dio.svg"
				alt="dione logo"
				width={120}
				height={120}
				className="mb-4 animate-float"
				priority
			/>
			<h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">
				{isAppLogin ? "Continue to" : "Log In to"} Dione
			</h1>
			<span className="text-sm text-white/50 mt-2">
				Open-source means you own your data
			</span>
		</div>
	);
}
