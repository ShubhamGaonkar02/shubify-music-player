import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { ShieldCheck, KeyRound, ExternalLink } from 'lucide-react';

const Login = ({ missingClerkKey }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f4fbf7] p-4 text-slate-900 font-sans select-none relative overflow-hidden">
      {/* Dynamic Background Glow Rings in Light Mint & Emerald */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center z-10 relative">
        {/* Top Shubify Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/logo.png"
            alt="Shubify Logo"
            className="w-16 h-16 object-contain mb-3 drop-shadow-md hover:scale-105 transition-transform"
          />
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent tracking-tight">
            Shubify
          </h1>
          <span className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase opacity-90 mt-0.5">
            – Ad-Free Music Player
          </span>
          <p className="text-xs text-slate-600 mt-2 font-semibold">
            Sign in with your account to stream endless music
          </p>
        </div>

        {/* Clerk Sign In Component or Setup Banner */}
        {missingClerkKey ? (
          <div className="w-full bg-white border border-amber-500/30 rounded-3xl p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <KeyRound size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">Clerk API Key Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              To activate Clerk authentication, add your Publishable Key to your client{' '}
              <code className="text-emerald-700 bg-slate-100 px-1.5 py-0.5 rounded">.env</code> file or Vercel Environment Variables:
            </p>
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-left mb-4 font-mono text-[11px] text-slate-700 select-all overflow-x-auto">
              VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
            </div>
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-transform hover:scale-105 shadow-sm"
            >
              Get Key from Clerk Dashboard <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/signup"
              fallbackRedirectUrl="/"
            />
          </div>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Protected with secure Clerk authentication & session encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
