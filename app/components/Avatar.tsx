import React, { useState } from 'react';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';

interface AvatarProps {
  photoURL: string | null;
  onSignOut: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ photoURL, onSignOut }) => {
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <div className="relative group">
      <div 
        className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center"
        onClick={onSignOut}
        onMouseEnter={() => setShowSignOut(true)}
        onMouseLeave={() => setShowSignOut(false)}
      >
        {photoURL ? (
          <Image src={photoURL} alt="User Avatar" width={40} height={40} className="rounded-full" />
        ) : (
          <User size={24} className="text-gray-600" />
        )}
        {showSignOut && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-full">
            <LogOut size={20} className="text-white" />
          </div>
        )}
      </div>
      {showSignOut && (
        <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md py-1 px-2">
          <span className="text-xs text-gray-600 whitespace-nowrap">Sign out</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;