"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Friend, Message } from "./Messages/Types";
import FriendList from "./Messages/FriendList";
import ChatPanel from "./Messages/ChatPanel";

const Messages: React.FC = () => {
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [username] = useState("u/Warmix7");
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "CryptoKing",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png",
      status: "online",
      trophies: 32450,
      level: 150,
      clan: "Crypto Warriors",
      isFavorite: true,
    },
    {
      id: 2,
      name: "NFTHunter",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%281%29-9wGstIndm3EHsb8DVxACEeEysTvTLr.png",
      status: "playing",
      trophies: 31280,
      level: 145,
      clan: "Token Masters",
    },
    {
      id: 3,
      name: "BlockchainBeast",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg-O3IUaPWmrwcMxFfOjNtLl08MtnR1VF.png",
      status: "online",
      trophies: 30150,
      level: 142,
      clan: "Crypto Warriors",
      isFavorite: true,
    },
    {
      id: 4,
      name: "StarknetPro",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%282%29-8C60ISdWrtmynZ8TEf65LMGT0CP5ua.png",
      status: "online",
      trophies: 29870,
      level: 138,
      clan: "L2 Legends",
    },
    {
      id: 5,
      name: "TokenMaster",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/klipartz.com-1kdb2gSHyxhFyYxBgeEJ2byaZlZCN6.png",
      status: "offline",
      lastActive: "3h ago",
      trophies: 28950,
      level: 135,
      clan: "Token Masters",
    },
    {
      id: 6,
      name: "ZkRollup",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png",
      status: "offline",
      lastActive: "1d ago",
      trophies: 14320,
      level: 39,
      clan: "L2 Legends",
    },
    {
      id: 7,
      name: "CryptoNoob",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%281%29-9wGstIndm3EHsb8DVxACEeEysTvTLr.png",
      status: "away",
      lastActive: "5m ago",
      trophies: 12450,
      level: 35,
      clan: "Token Masters",
    },
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 1,
      senderName: "CryptoKing",
      senderAvatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png",
      content: "Hey! Want to play some matches?",
      timestamp: "10:30 AM",
      isRead: true,
    },
    {
      id: 2,
      senderId: 2,
      senderName: "NFTHunter",
      senderAvatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%281%29-9wGstIndm3EHsb8DVxACEeEysTvTLr.png",
      content: "Check out my new legendary brawler NFT!",
      timestamp: "Yesterday",
      isRead: false,
    },
    {
      id: 3,
      senderId: 3,
      senderName: "BlockchainBeast",
      senderAvatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg-O3IUaPWmrwcMxFfOjNtLl08MtnR1VF.png",
      content: "Are you joining the tournament this weekend?",
      timestamp: "Yesterday",
      isRead: false,
    },
  ]);

  const openChat = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowChatPanel(true);
  };

  const handleCloseChat = () => {
    setShowChatPanel(false);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative bg-purple-900">
      <FriendList friends={friends} messages={messages} openChat={openChat} />
      <AnimatePresence>
        {showChatPanel && selectedFriend && (
          <ChatPanel
            selectedFriend={selectedFriend}
            messages={messages}
            setMessages={setMessages}
            username={username}
            onClose={handleCloseChat}
          />
        )}
      </AnimatePresence>
      <div className="absolute bottom-1 right-1 text-xs text-white/50">v2.0.0 Starknet Edition</div>
    </div>
  );
};

export default Messages; 