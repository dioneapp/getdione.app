"use client";

import LoginOptions from "@/components/auth/LoginOptions";
import LoginTerms from "@/components/auth/LoginTerms";
import LoginWelcome from "@/components/auth/LoginWelcome";

export default async function LoginPage() {
  return (
    <div
      className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative"
      id="container"
    >
      <div className="h-fit w-full flex max-w-xl">
        <div className="w-full h-full group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg">
          <LoginWelcome />
          <LoginOptions />
          <LoginTerms />
        </div>
      </div>
    </div>
  );
}
