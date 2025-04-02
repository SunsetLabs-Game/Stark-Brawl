"use client";

import React, { useState, useRef, useEffect } from "react";
import { Friend, Message } from "./Types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import MessageItem from "./MessageItem";

interface ChatPanelProps {
    selectedFriend: Friend;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    username: string;
    onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ selectedFriend, messages, setMessages, username, onClose }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (!currentMessage.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            senderId: 0,
            senderName: username,
            senderAvatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png",
            content: currentMessage,
            timestamp: "Just now",
            isRead: true,
        };

        setMessages([...messages, newMessage]);
        setCurrentMessage("");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-green-500";
            case "playing":
                return "bg-blue-500";
            case "away":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusText = (status: string, lastActive?: string) => {
        switch (status) {
            case "online":
                return "Online";
            case "playing":
                return "In Game";
            case "away":
                return "Away";
            default:
                return lastActive ? `Offline (${lastActive})` : "Offline";
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-16 bottom-0 w-80 bg-purple-900 border-l border-purple-800 z-20 flex flex-col"
        >
            <div className="p-3 border-b border-purple-800 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <img
                            src={selectedFriend.avatar || "/placeholder.svg"}
                            alt={selectedFriend.name}
                            className="rounded-full object-cover h-[40px] w-[40px]"
                        />
                        <div
                            className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(selectedFriend.status)} rounded-full border border-purple-900`}
                        ></div>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-white font-bold">{selectedFriend.name}</h3>
                        <p className="text-white/70 text-xs">{getStatusText(selectedFriend.status, selectedFriend.lastActive)}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages
                    .filter((msg) => msg.senderId === selectedFriend.id || msg.senderId === 0)
                    .map((msg) => (
                        <MessageItem key={msg.id} msg={msg} />
                    ))}
                <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-purple-800 flex">
                <Input
                    placeholder="Type a message..."
                    className="bg-purple-800/50 border-purple-700 text-white placeholder:text-white/50 mr-2"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />
                <Button className="bg-blue-600 hover:bg-blue-500" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
};

export default ChatPanel;