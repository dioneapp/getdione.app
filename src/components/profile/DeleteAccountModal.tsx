import type React from "react";

interface DeleteAccountModalProps {
	show: boolean;
	onClose: () => void;
	onDelete: () => void;
	isDeleting: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
	show,
	onClose,
	onDelete,
	isDeleting,
}) => {
	if (!show) return null;
	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white/10 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
				<h3 className="text-white text-xl font-semibold mb-4">
					Delete Account
				</h3>
				<p className="text-white/70 mb-6">
					Are you sure you want to delete your account? This action cannot be
					undone.
				</p>
				<div className="flex gap-4">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={onDelete}
						disabled={isDeleting}
						className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 cursor-pointer"
					>
						{isDeleting ? "Deleting..." : "Delete Account"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteAccountModal;
