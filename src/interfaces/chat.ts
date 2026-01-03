import { Message } from "./message";

export type ChatStatus = "online" | "offline";

export interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    avatarUrl?: string;
    status: ChatStatus;
    lastSeen: string;
    messages: Message[];
}
