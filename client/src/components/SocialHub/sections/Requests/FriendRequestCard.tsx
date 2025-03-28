import { useState } from 'react';
import { FriendRequest } from '../../../../types/friend';
import { Button } from '../../../ui/button';
import { Clock, Star, Users } from 'lucide-react';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export const FriendRequestCard = ({
  request,
  onAccept,
  onDecline,
}: FriendRequestCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAccept = async () => {
    setIsAnimating(true);
    setTimeout(() => {
      onAccept(request.id);
    }, 300);
  };

  const handleDecline = async () => {
    setIsAnimating(true);
    setTimeout(() => {
      onDecline(request.id);
    }, 300);
  };

  return (
    <div
      className={`relative backdrop-blur-sm bg-white/5 border border-[#a76dca80] text-white rounded-[8px] overflow-hidden transition-all duration-300 ${
        isAnimating
          ? 'opacity-0 transform translate-x-2'
          : 'opacity-100 transform translate-x-0'
      }`}
    >
      {/* User Info Section */}
      <div className='p-4'>
        <div className='flex items-start gap-3'>
          <img
            src={request.avatarUrl}
            alt={request.username}
            className='w-8 h-8 rounded-lg'
          />
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <h3 className='text-white text-sm font-medium'>
                {request.username}
              </h3>
            </div>
            <div className='flex flex-wrap items-center gap-1.5 text-xs mt-0.5 font-semibold text-white/60'>
              <span className='whitespace-nowrap'>
                🏆 {request.trophies.toLocaleString()} trophies
              </span>
              <div className='flex items-center gap-1.5 text-xs whitespace-nowrap'>
                <span>•</span>
                <span>
                  <Star className='w-3 h-3 text-blue-400' />
                </span>
                <span>Level {request.level}</span>
              </div>
            </div>
          </div>
          <div className='text-xs flex items-center gap-1 text-white/50'>
            <Clock className='w-3 h-3' />
            <span>2h ago</span>
          </div>
        </div>
        <div className='text-sm mt-2 flex items-center gap-1 p-1.5 px-3 bg-black/5  rounded-[8px]'>
          <span>
            <Users className='w-4 h-4 text-blue-400' />
          </span>
          <span className='text-white/60'>
            {request.mutualFriends} mutual friends
          </span>
        </div>
        {/* Action Buttons Section */}
        <div className='grid grid-cols-2 sm:gap-3 gap-2 mt-2'>
          <Button
            onClick={handleAccept}
            className='!rounded-[8px] bg-green-600 hover:bg-green-700  py-2.5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-1.5'
          >
            <span className='text-lg'>✓</span>
            Accept
          </Button>
          <Button
            onClick={handleDecline}
            className='bg-white !rounded-[8px] border border-red-300 hover:bg-gray-100  py-2.5 text-sm font-medium text-red-500 transition-colors flex items-center justify-center gap-1.5'
          >
            <span className='text-lg'>×</span>
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};
