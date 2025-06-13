import { motion } from "framer-motion";
import { ExtendedUser } from "@/types/database";

interface ProfileBioProps {
  user: ExtendedUser | null;
  isEditing?: boolean;
  editedBio?: string;
  onBioChange?: (value: string) => void;
}

export default function ProfileBio({
  user,
  isEditing = false,
  editedBio,
  onBioChange,
}: ProfileBioProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="space-y-4">
          <div>
            <h2 className="text-white/50 text-sm">About</h2>
            {isEditing ? (
              <motion.textarea
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                value={editedBio}
                onChange={(e) => onBioChange?.(e.target.value)}
                maxLength={200}
                className="bg-transparent border-b border-white/20 px-1 py-0.5 text-white w-full min-h-[60px] resize-y focus:outline-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-white whitespace-pre-wrap break-words line-clamp-3">
                {user?.bio || "No bio yet"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 