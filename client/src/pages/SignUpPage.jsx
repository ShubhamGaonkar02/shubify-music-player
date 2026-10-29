import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { ShieldCheck, KeyRound, ExternalLink } from 'lucide-react';

const SignUpPage = ({ missingClerkKey }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#09090b] p-4 text-white font-sans select-none relative overflow-hidden">
      {/* Dynamic Background Glow Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1ed760]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center z-10 relative">
        {/* Top Shubify Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/logo.png"
            alt="Shubify Logo"
            className="w-16 h-16 object-contain mb-3 drop-shadow-xl hover:scale-105 transition-transform"
          />
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#1ed760] via-emerald-400 to-green-300 bg-clip-text text-transparent tracking-tight">
            Shubify
          </h1>
          <span className="text-xs font-extrabold text-[#1ed760] tracking-wider uppercase opacity-90 mt-0.5">
            – Ad-Free Music Player
          </span>
          <p className="text-xs text-gray-400 mt-2 font-semibold">
            Create an account to stream endless ad-free music
          </p>
        </div>

        {/* Clerk Sign Up Component or Setup Banner */}
        {missingClerkKey ? (
          <div className="w-full bg-[#121214] border border-amber-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <KeyRound size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-white mb-2">Clerk API Key Required</h2>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              To activate Clerk authentication, add your Publishable Key to your client{' '}
              <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">.env</code> file or Vercel Environment Variables:
            </p>
            <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-left mb-4 font-mono text-[11px] text-gray-300 select-all overflow-x-auto">
              VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
            </div>
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-transform hover:scale-105"
            >
              Get Key from Clerk Dashboard <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <SignUp
              routing="path"
              path="/signup"
              signInUrl="/login"
              fallbackRedirectUrl="/"
            />
          </div>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-400">
          <ShieldCheck size={14} className="text-[#1ed760]" />
          <span>Protected with secure Clerk authentication & session encryption</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
