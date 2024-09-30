import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signInWithGoogle, signInWithEmailPassword, createUserWithEmailPassword } from '@/utils/auth';

interface SignInModalProps {
  onClose: () => void;
  onSignIn: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ onClose, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onSignIn();
      onClose(); // Close the modal after successful sign-in
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await signInWithEmailPassword(email, password);
    if (user) {
      onSignIn();
      onClose(); // Close the modal after successful sign-in
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await createUserWithEmailPassword(email, password);
    if (user) {
      onSignIn();
      onClose(); // Close the modal after successful sign-up
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <button onClick={handleGoogleSignIn} className="btn-primary w-full mb-4">
          Sign in with Google
        </button>
        <div className="my-4 text-center">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
        <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="btn-primary w-full mb-4">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary-dark ml-2 hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;