import { useState } from 'react';
import { FriendCardInterface } from '../../../../types/friend';
import { Button } from '../../../ui/button';
import { MessageSquare, Star, Users } from 'lucide-react';

interface FriendCardProps {
  friend: FriendCardInterface;
  onMessage: (username: string) => void;
  onInvite: (username: string) => void;
}

export const FriendCard = ({
    friend,
    onMessage,
    onInvite,
}: FriendCardProps) => {

  const handleMessage = async () => {
    setTimeout(() => {
        onMessage(friend.username);
    }, 300);
  };

  const handleInvite = async () => {
    setTimeout(() => {
        onInvite(friend.username);
    }, 300);
  };

  return (
    <div
      className={'relative backdrop-blur-sm bg-white/5 border border-[#a76dca80] text-white rounded-[8px] overflow-hidden transition-all duration-300'}
    >
      <div className='p-4'>
        <div className='flex items-start gap-3'>
          <img
            src={friend.avatar}
            alt={friend.username}
            className='w-8 h-8 rounded-lg'
          />
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <h3 className='text-white text-sm font-medium'>
                {friend.username}
              </h3>
            </div>
            <div className='flex flex-wrap items-center gap-1.5 text-xs mt-0.5 font-semibold text-white/60'>
                <span className='whitespace-nowrap'>
                  { friend.online_status == "Online" ? (
                    <span>🟢 Online</span>
                  ) : friend.online_status == "Offline" ? (
                    <span>🔴 Offline</span>
                  ) : friend.online_status == "In Game" ? (
                    <span>🔵 In Game</span>
                  ) : (
                    <span>🟠 Away</span>
                  )
                }
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center  justify-between mt-2'>
              <span className='whitespace-nowrap text-xs'>
                🏆 {friend.trophies.toLocaleString()} trophies
              </span>
              <div className='flex items-center gap-1.5 text-xs whitespace-nowrap'>
                <span>
                  <Star className='w-3 h-3 text-blue-400' />
                </span>
                <span>Level {friend.level}</span>
              </div>
        </div>
        <div className='text-gray-300 font-medium bg-purple-900/40 p-2 text-sm rounded'>
          <span>
           🛡️ Clan: {friend.clan_affiliation}
          </span>
        </div>
        {/* Action Buttons Section */}
        <div className='flex items-center  justify-between mt-2'>
          <Button
            onClick={handleMessage}
            className='flex items-center  bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 text-sm gap-[6.5px] font-semibold rounded'
          >
            <span className='text-lg'><MessageSquare className='w-4 h-4 text-white' /></span>
            Message
          </Button>
          <Button
            onClick={handleInvite}
            className='flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm gap-[6.5px] font-semibold rounded'
          >
            <span className='text-lg'>
              <Users className='w-4 h-4 text-white-400' />
            </span>
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
};
