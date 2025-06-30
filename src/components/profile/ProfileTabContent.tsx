import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X as XIcon, LogOut } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import AccountInfo from "@/components/profile/AccountInfo";

interface ProfileTabContentProps {
  profile: any;
  isEditing: boolean;
  editedFields: any;
  handleFieldChange: (field: string, value: string) => void;
  fieldErrors: any;
  setIsEditing: (v: boolean) => void;
  setEditedFields: (fields: any) => void;
  handleSubmit: () => void;
  handleSignOut: () => void;
  setShowDeleteModal: (v: boolean) => void;
  session: any;
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  profile,
  isEditing,
  editedFields,
  handleFieldChange,
  fieldErrors,
  setIsEditing,
  setEditedFields,
  handleSubmit,
  handleSignOut,
  setShowDeleteModal,
  session,
}) => (
  <>
    <div className="flex flex-col gap-2">
      <ProfileHeader
        user={profile}
        isEditing={isEditing}
        editedFields={editedFields}
        onFieldChange={handleFieldChange}
        fieldErrors={fieldErrors}
        onEditClick={() => setIsEditing(true)}
      />
      <ProfileBio
        user={profile}
        isEditing={isEditing}
        editedBio={editedFields.bio}
        onBioChange={v => handleFieldChange("bio", v)}
      />
      {isEditing && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex justify-end gap-2 pt-4">
            <button onClick={handleSubmit} className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 flex items-center gap-1.5 text-sm cursor-pointer"><Check className="h-3.5 w-3.5" />Save</button>
            <button onClick={() => { setIsEditing(false); setEditedFields({ username: profile?.username || "", first_name: profile?.first_name || "", bio: profile?.bio || "", location: profile?.location || "", avatar_url: profile?.avatar_url || "" }); }} className="px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center gap-1.5 text-sm cursor-pointer"><XIcon className="h-3.5 w-3.5" />Cancel</button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
    <AccountInfo user={profile} showEmail email={profile?.email} lastSignInAt={session?.user?.last_sign_in_at} />
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <button onClick={handleSignOut} className="w-full sm:w-auto shrink-0 py-1 px-5 flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"><LogOut className="w-5 h-5" />Sign Out</button>
      <button onClick={() => setShowDeleteModal(true)} className="w-full sm:w-auto text-center text-red-400/70 hover:text-red-400 text-sm transition-colors cursor-pointer">Delete Account</button>
    </div>
  </>
);

export default ProfileTabContent; 