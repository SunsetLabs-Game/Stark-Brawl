import { Dispatch, SetStateAction } from 'react';
import { FriendRequest } from '../../../types/friend';
import { FriendRequestsList } from './Requests/FriendRequestsList';

interface RequestsProps {
  requests: FriendRequest[];
  setRequests: Dispatch<SetStateAction<FriendRequest[]>>;
}

export default function Requests({ requests, setRequests }: RequestsProps) {
  return <FriendRequestsList requests={requests} setRequests={setRequests} />;
}
