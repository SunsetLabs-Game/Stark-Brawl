import React from "react";
import { Message } from "./Types";

interface MessageItemProps {
  msg: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg }) => {
  return (
    <div key={msg.id} className={`flex ${msg.senderId === 0 ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === 0 ? "bg-blue-600 text-white" : "bg-purple-800 text-white"}`}
      >
        <p className="text-sm">{msg.content}</p>
        <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
      </div>
      {msg.senderId === 0 && (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png"
          alt="You"
          className="rounded-full object-cover ml-2 self-end w-[32px] h-[32px]"
        />
      )}
    </div>
  );
};

export default MessageItem;