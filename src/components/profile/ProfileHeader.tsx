import Image from "next/image";
import { ExtendedUser } from "@/types/database";

interface ProfileHeaderProps {
  user: ExtendedUser | null;
  isEditing?: boolean;
  editedFields?: {
    username: string;
    first_name: string;
    location: string;
  };
  onFieldChange?: (field: "username" | "first_name" | "location", value: string) => void;
  fieldErrors?: {
    username: string;
    first_name: string;
  };
  onEditClick?: () => void;
}

export default function ProfileHeader({
  user,
  isEditing = false,
  editedFields,
  onFieldChange,
  fieldErrors,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="flex gap-4 items-center">
      {/* avatar */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
        {user?.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt="Profile"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 80px"
          />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <span className="text-white/50 text-2xl">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-1">
          <div className="text-white text-3xl font-semibold">
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={editedFields?.first_name}
                  onChange={(e) => onFieldChange?.("first_name", e.target.value)}
                  maxLength={15}
                  className={`bg-transparent border-b ${fieldErrors?.first_name ? "border-red-500/50" : "border-white/20"} px-1 py-0.5 text-white w-full focus:outline-none text-2xl`}
                  placeholder="Your name"
                />
                {fieldErrors?.first_name && (
                  <div className="text-red-400 text-sm">
                    {fieldErrors.first_name}
                  </div>
                )}
              </div>
            ) : (
              user?.first_name || "No name set"
            )}
          </div>
          <div className="flex flex-col gap-2 text-white/50 text-sm">
            <div className="flex items-center">
              <span>@</span>
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editedFields?.username}
                    onChange={(e) => {
                      // only allow alphanumeric chars, underscores
                      const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                      onFieldChange?.("username", value);
                    }}
                    maxLength={15}
                    className={`bg-transparent border-b ${fieldErrors?.username ? "border-red-500/50" : "border-white/20"} pl-1 pr-1 py-0.5 text-white w-full focus:outline-none`}
                    placeholder="username"
                  />
                  {fieldErrors?.username && (
                    <div className="text-red-400 text-sm mt-1">
                      {fieldErrors.username}
                    </div>
                  )}
                </div>
              ) : (
                <span>{user?.username || "anonymous"}</span>
              )}
            </div>
            {/* location display */}
            {user?.location && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFields?.location}
                    onChange={(e) => onFieldChange?.("location", e.target.value)}
                    maxLength={10}
                    className="bg-transparent border-b border-white/20 px-1 py-0.5 text-white w-full focus:outline-none"
                    placeholder="Where are you from?"
                  />
                ) : (
                  <span className="text-white/70">{user?.location}</span>
                )}
              </div>
            )}
          </div>
        </div>
        {!isEditing && onEditClick && (
          <button
            onClick={onEditClick}
            className="mt-4 w-full sm:w-auto shrink-0 px-3 py-1.5 gap-2 flex items-center justify-center bg-white/10 backdrop-blur border border-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="currentColor"
            >
              <path d="M160-120q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm544-528 56-56-56-56-56 56 56 56Z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
} 