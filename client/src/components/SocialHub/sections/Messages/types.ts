export interface Message {
    id: number;
    senderId: number;
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface Friend {
    id: number;
    name: string;
    avatar: string;
    status: "online" | "offline" | "playing" | "away";
    lastActive?: string;
    trophies: number;
    level: number;
    clan?: string;
    isFavorite?: boolean;
}