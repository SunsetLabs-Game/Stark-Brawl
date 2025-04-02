"use client";

import React from "react";
import { Friend, Message } from "./Types";
import FriendListItem from "./FriendListItem";
import { MessageSquare } from "lucide-react";

interface FriendListProps {
    friends: Friend[];
    messages: Message[];
    openChat: (friend: Friend) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, messages, openChat }) => {
    return (
        <div>
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <MessageSquare className="h-16 w-16 text-white/30 mb-4" />
                    <p className="text-white/70 text-lg mb-2">No messages</p>
                    <p className="text-white/50 text-sm">Start a conversation with your friends!</p>
                </div>
            ) : (
                <div className="space-y-3 p-2">
                    {messages
                        .filter((msg, idx, self) => self.findIndex((m) => m.senderId === msg.senderId) === idx)
                        .map((message) => {
                            const friend = friends.find((f) => f.id === message.senderId);
                            return friend ? (
                                <FriendListItem key={message.id} message={message} friend={friend} openChat={openChat} />
                            ) : null;
                        })}
                </div>
            )}
        </div>
    );
};

export default FriendList;