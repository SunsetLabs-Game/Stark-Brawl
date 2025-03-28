import { Dispatch, SetStateAction } from 'react';
import { FriendRequest } from '../../../../types/friend';
import { FriendRequestCard } from './FriendRequestCard';

interface FriendRequestsListProps {
  requests: FriendRequest[];
  setRequests: Dispatch<SetStateAction<FriendRequest[]>>;
}

export const FriendRequestsList = ({
  requests,
  setRequests,
}: FriendRequestsListProps) => {
  const handleAccept = async (id: string) => {
    // In a real app, you would make an API call here
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  const handleDecline = async (id: string) => {
    // In a real app, we would make an API call here
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  return (
    <div className='w-full p-4'>
      <div className='space-y-4'>
        {requests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
};
