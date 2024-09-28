import React from 'react';

interface BerrySpriteProp {
  mood: 'happy' | 'thinking' | 'excited';
}

const BerrySprite: React.FC<BerrySpriteProp> = ({ mood }) => {
  // You can replace these with actual sprite images or SVGs
  const spriteImages = {
    happy: '😊',
    thinking: '🤔',
    excited: '😃',
  };

  return (
    <div className="berry-sprite">
      <span style={{ fontSize: '48px' }}>{spriteImages[mood]}</span>
    </div>
  );
};

export default BerrySprite;