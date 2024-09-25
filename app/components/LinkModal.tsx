import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface LinkModalProps {
  link: string;
  onClose: () => void;
}

const LinkModal: React.FC<LinkModalProps> = ({ link, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Custom Link</h3>
          <p className="mb-4 break-all">{link}</p>
          <div className="flex justify-between">
            <Link href={link} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Visit Page
            </Link>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;