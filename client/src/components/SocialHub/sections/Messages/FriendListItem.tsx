import React from "react";
import { Friend, Message } from "./Types";

interface FriendListItemProps {
    message: Message;
    friend: Friend;
    openChat: (friend: Friend) => void;
}

const FriendListItem: React.FC<FriendListItemProps> = ({ message, friend, openChat }) => {
    return (
        <div
            className={`bg-purple-800/70 rounded-xl overflow-hidden border ${!message.isRead ? "border-blue-500" : "border-purple-700"} p-3 cursor-pointer hover:bg-purple-700/50 transition-colors`}
            onClick={() => openChat(friend)}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <img
                            src={message.senderAvatar || "/placeholder.svg"}
                            alt={message.senderName}
                            className="rounded-full object-cover h-[40px] w-[40px]"
                        />
                        {!message.isRead && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                    <div className="ml-3">
                        <h3 className="text-white font-bold">{message.senderName}</h3>
                        <p className="text-white/70 text-sm truncate max-w-[200px]">{message.content}</p>
                    </div>
                </div>
                <div className="text-white/50 text-xs">{message.timestamp}</div>
            </div>
        </div>
    );
};

export default FriendListItem;