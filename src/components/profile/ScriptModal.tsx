import { X } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

interface ScriptModalProps {
	show: boolean;
	onClose: () => void;
	formRef: React.RefObject<HTMLFormElement>;
	scriptForm: {
		name: string;
		description: string;
		script_url: string;
		logo_url: string;
		banner_url: string;
		version: string;
		tags: string[];
		id?: string;
	};
	handleScriptField: (field: string, value: string) => void;
	handleScriptSubmit: (e: React.FormEvent) => void;
	tagOptions: string[];
	handleTagToggle: (tag: string) => void;
	scriptError: string;
	isEdit?: boolean;
}

const ScriptModal: React.FC<ScriptModalProps> = ({
	show,
	onClose,
	formRef,
	scriptForm,
	handleScriptField,
	handleScriptSubmit,
	tagOptions,
	handleTagToggle,
	scriptError,
	isEdit,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (show) {
			setTimeout(() => {
				modalRef.current?.focus();
			}, 0);
		}
	}, [show]);

	if (!show) return null;
	return (
		<div
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
			aria-modal="true"
			role="dialog"
		>
			<div
				ref={modalRef}
				tabIndex={-1}
				className="bg-white/10 border border-white/20 rounded-xl p-0 w-full max-w-xl mx-4 relative shadow-2xl shadow-black/40 outline-none"
			>
				{/* top bar */}
				<div className="px-6 pt-6 pb-2">
					<div className="flex items-center justify-between">
						<h2 className="text-white text-2xl font-semibold" id="modal-title">
							{isEdit ? "Edit Script" : "Submit Script"}
						</h2>
						<button
							onClick={onClose}
							aria-label="Close modal"
							className="text-white/60 hover:text-white text-2xl px-2 py-1 rounded-full focus:outline-none transition cursor-pointer"
							type="button"
						>
							<X size={24} />
						</button>
					</div>
					<p className="text-white/70 text-sm mt-1 mb-4">
						Share your script with the Dione community. Fill out the details
						below and submit for review.
					</p>
				</div>
				<div className="px-6 pb-6 pt-0">
					<form
						ref={formRef}
						onSubmit={handleScriptSubmit}
						className="flex flex-col gap-5"
						aria-labelledby="modal-title"
					>
						{/* name + version */}
						<div className="flex gap-4 flex-col sm:flex-row">
							<div className="flex-1">
								<label
									htmlFor="script-name"
									className="block text-sm font-medium text-white mb-2"
								>
									Name
								</label>
								<input
									type="text"
									id="script-name"
									placeholder="Script Name"
									value={scriptForm.name}
									onChange={(e) => handleScriptField("name", e.target.value)}
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white hover:border-white transition"
									required
									aria-required="true"
								/>
							</div>
							<div className="flex-1">
								<label
									htmlFor="script-version"
									className="block text-sm font-medium text-white mb-2"
								>
									Version
								</label>
								<input
									type="text"
									id="script-version"
									placeholder="1.0.0"
									value={scriptForm.version}
									onChange={(e) => handleScriptField("version", e.target.value)}
									className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white hover:border-white transition"
									required
									aria-required="true"
								/>
							</div>
						</div>
						{/* description */}
						<div>
							<label
								htmlFor="script-description"
								className="block text-sm font-medium text-white mb-2"
							>
								Description
							</label>
							<textarea
								id="script-description"
								placeholder="Short description"
								value={scriptForm.description}
								onChange={(e) =>
									handleScriptField("description", e.target.value)
								}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white hover:border-white transition resize-none"
								rows={3}
								required
								aria-required="true"
							/>
						</div>
						{/* script url */}
						<div>
							<label
								htmlFor="script-url"
								className="block text-sm font-medium text-white mb-2"
							>
								Script URL
							</label>
							<input
								type="url"
								id="script-url"
								placeholder="https://github.com/user/repo/blob/branch/dione.json"
								value={scriptForm.script_url}
								onChange={(e) =>
									handleScriptField("script_url", e.target.value)
								}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white hover:border-white transition"
								required
								aria-required="true"
							/>
						</div>
						{/* logo url */}
						<div>
							<label
								htmlFor="logo-url"
								className="block text-sm font-medium text-white mb-2"
							>
								Logo URL
							</label>
							<input
								type="url"
								id="logo-url"
								placeholder="https://i.imgur.com/logo.png"
								value={scriptForm.logo_url}
								onChange={(e) => handleScriptField("logo_url", e.target.value)}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white hover:border-white transition"
								required
								aria-required="true"
							/>
						</div>
						{/* banner url */}
						<div>
							<label
								htmlFor="banner-url"
								className="block text-sm font-medium text-white mb-2"
							>
								Banner URL
							</label>
							<input
								type="url"
								id="banner-url"
								placeholder="https://i.imgur.com/banner.png"
								value={scriptForm.banner_url}
								onChange={(e) =>
									handleScriptField("banner_url", e.target.value)
								}
								className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white hover:border-white transition"
								aria-required="true"
							/>
						</div>
						{/* tags */}
						<div>
							<label className="block text-sm font-medium text-white mb-2">
								Tags
							</label>
							<div className="flex gap-2 flex-wrap">
								{tagOptions.map((tag) => (
									<button
										type="button"
										key={tag}
										onClick={() => handleTagToggle(tag)}
										aria-pressed={scriptForm.tags.includes(tag)}
										className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none duration-100 cursor-pointer
                      ${
												scriptForm.tags.includes(tag)
													? "bg-white text-black border-black shadow"
													: "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30"
											}
                    `}
									>
										{tag.charAt(0).toUpperCase() + tag.slice(1)}
									</button>
								))}
							</div>
						</div>
						{/* error */}
						{scriptError && (
							<div className="text-red-500 text-base font-semibold text-center bg-red-50/10 border border-red-500/30 rounded-lg py-2 px-3 mt-1">
								{scriptError}
							</div>
						)}
						{/* submit */}
						<button
							type="submit"
							className="w-full font-semibold shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/80 shadow-lg border border-black/10 cursor-pointer"
						>
							{isEdit ? "Save Changes" : "Submit for Review"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ScriptModal;
