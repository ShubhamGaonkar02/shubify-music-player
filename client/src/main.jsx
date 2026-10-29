import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './index.css';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_YWR2YW5jZWQtdHJvbGwtMTc5MC5jbGVyay5hY2NvdW50cy5kZXYk';

const isKeyConfigured = Boolean(PUBLISHABLE_KEY && !PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isKeyConfigured ? (
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          variables: {
            colorPrimary: '#1ed760',
            colorBackground: '#ffffff',
            colorInputBackground: '#f8fafc',
            colorInputText: '#0f172a',
            colorText: '#0f172a',
            colorTextSecondary: '#64748b',
            borderRadius: '1rem',
          },
          elements: {
            card: 'border border-slate-200/90 shadow-xl bg-white rounded-2xl',
            formButtonPrimary: 'bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold rounded-full transition-all shadow-md',
            footerActionLink: 'text-[#16a34a] hover:underline font-bold',
            headerTitle: 'text-slate-900 font-extrabold text-xl',
            headerSubtitle: 'text-slate-500 text-xs',
            socialButtonsBlockButton: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all font-bold shadow-sm',
            socialButtonsBlockButtonText: 'text-slate-800 font-bold',
            formFieldInput: 'bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:border-[#1ed760] focus:ring-1 focus:ring-[#1ed760]',
            dividerLine: 'bg-slate-200',
            dividerText: 'text-slate-400 text-xs',
            footer: 'border-t border-slate-100',
          },
        }}
      >
        <App />
      </ClerkProvider>
    ) : (
      <App missingClerkKey={true} />
    )}
  </React.StrictMode>,
);
