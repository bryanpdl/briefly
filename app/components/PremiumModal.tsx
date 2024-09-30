import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p className="mb-6">
          Unlock all premium features for just $4.99/month. Enjoy section regeneration, PDF export, and email sharing!
        </p>
        <button className="btn-primary w-full mb-4">
          Subscribe Now
        </button>
        <div className="flex justify-center items-center space-x-4">
          <Image src="/stripe-logo.png" alt="Stripe" width={60} height={25} />
          <Image src="/paypal-logo.png" alt="PayPal" width={80} height={25} />
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Secure payment processed by Stripe or PayPal
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;