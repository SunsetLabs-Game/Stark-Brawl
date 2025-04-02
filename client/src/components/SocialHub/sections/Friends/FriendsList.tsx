import { Dispatch, SetStateAction } from 'react';
import { FriendCardInterface } from '../../../../types/friend';
import { FriendCard } from './FriendCard';

interface FriendsListProps {
  friends: FriendCardInterface[];
  search: string;
}

export const FriendsList = ({
    friends,
    search,
}: FriendsListProps) => {
  const handleMessage = async (username: string) => {
    console.log('Message to:', username);
  };

  const handleInvite = async (username: string) => {
    console.log('Invite to:', username);
  };

  const filteredFriends = search.trim()
  ? friends.filter((friend) =>
      friend.username.toLowerCase().includes(search.toLowerCase())
    )
  : friends;

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    const aOnline = a.online_status === 'Online' ? 1 : 0;
    const bOnline = b.online_status === 'Online' ? 1 : 0;
    return bOnline - aOnline;
  });

  return (
    <div className='w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
        {sortedFriends.map((friend) => (
            <FriendCard
            key={friend.username}
            friend={friend}
            onMessage={handleMessage}
            onInvite={handleInvite}
            />
        ))}
    </div>
  );
};
