import type React from "react";

const Background: React.FC = () => {
	return (
		<div
			className="absolute inset-0 flex justify-center items-center -z-10"
			aria-hidden="true"
		>
			<div className="bg-gradient-to-br from-[#BCB1E7]/70 via-[#FFFFFF]/10 to-[#BCB1E7]/60 animate-gradient h-[70vh] w-[70vh] rounded-full blur-[150px] transition-all duration-1000"></div>
		</div>
	);
};

export default Background;
