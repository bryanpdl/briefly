import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import PremiumModal from './PremiumModal';
import SignInModal from './SignInModal';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleGetStarted = () => {
    setShowSignInModal(true);
  };

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    onGetStarted();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-3xl" role="img" aria-label="Grape">🍇</span>
          <span className="text-2xl font-bold ml-2">briefberry</span>
        </div>
        <button onClick={handleGetStarted} className="btn-primary">
          Sign In
        </button>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          AI-Powered Project Briefs for Designers
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Transform your ideas into comprehensive project briefs in seconds! Let AI craft your project brief while you focus on designing.
        </p>
        <div className="mb-12">
          <button onClick={handleGetStarted} className="btn-inverted text-lg px-8 py-3">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-semibold mb-8">Pricing</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
              <h3 className="text-2xl font-bold mb-4 text-left">Free</h3>
              <ul className="text-left mb-6">
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> AI-generated project briefs
                </li>
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> Basic editing
                </li>
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> Shareable links
                </li>
              </ul>
              <p className="font-bold text-2xl text-left">$0 / month</p>
            </div>
            <div 
              className="bg-white p-8 rounded-lg shadow-lg flex-1 border-2 border-[#2C2C2C] cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => setShowPremiumModal(true)}
            >
              <h3 className="text-2xl font-bold mb-4 text-left">Premium</h3>
              <ul className="text-left mb-6">
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> All Free features
                </li>
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> No watermarks on shared links
                </li>
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> Section regeneration
                </li>
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> PDF export
                </li>
                <li className="flex items-center mb-2">
                  <Check className="mr-2 text-green-500" /> Email sharing
                </li>
              </ul>
              <p className="font-bold text-2xl text-left">$4.99 / month</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-600">
          © 2024 briefberry. All rights reserved.
        </p>
      </footer>

      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          onSignIn={handleSignInSuccess}
        />
      )}
    </div>
  );
};

export default LandingPage;