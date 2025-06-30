import Image from "next/image";
import React from "react";

export default function LoginWelcome() {
	return (
		<div className="flex flex-col gap-1 items-center">
			<Image
				src="/Dio.svg"
				alt="dione logo"
				width={120}
				height={120}
				className="m-2 animate-float"
				priority
			/>
			<h1 className="text-white text-3xl font-semibold flex items-center gap-2">
				Log In to Dione
			</h1>
			<span className="text-xs text-white/40 mt-2">
				open-source means you own your data
			</span>
		</div>
	);
}
