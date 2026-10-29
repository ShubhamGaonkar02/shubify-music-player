import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import App from './App.jsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const isKeyConfigured = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isKeyConfigured ? (
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#1ed760',
            colorBackground: '#121214',
            colorInputBackground: '#1c1c20',
            colorInputText: '#ffffff',
            colorTextSecondary: '#a1a1aa',
            borderRadius: '1rem',
          },
          elements: {
            card: 'border border-white/10 shadow-2xl backdrop-blur-xl bg-[#121214]',
            formButtonPrimary: 'bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold rounded-full transition-all shadow-lg',
            footerActionLink: 'text-[#1ed760] hover:underline font-semibold',
            headerTitle: 'text-white font-extrabold text-xl',
            headerSubtitle: 'text-gray-400 text-xs',
            socialButtonsBlockButton: 'border border-white/10 bg-[#1a1a1e] hover:bg-[#242428] text-white transition-all',
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
