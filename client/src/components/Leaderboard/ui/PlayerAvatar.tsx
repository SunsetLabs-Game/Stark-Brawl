import React from 'react';
import { PlayerAvatarProps } from '../../../types/leaderboard-types';


const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  avatar, 
  isOnline = false, 
  isFriend = false 
}) => {
  return (
    <div className="relative">
      {/* Avatar Image */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
        {avatar ? (
          <img 
            src={avatar} 
            alt="Player avatar" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/avatars/default.png';
            }}
          />
        ) : (
          <span className="text-lg">👤</span>
        )}
      </div>
      
      {/* Online Status Indicator */}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-800"></div>
      )}
      
      {/* Friend Indicator (optional visual cue) */}
      {isFriend && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
          <span className="text-xs">✓</span>
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;