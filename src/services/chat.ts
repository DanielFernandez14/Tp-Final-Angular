import { Injectable, Signal, WritableSignal, computed, signal } from "@angular/core";
import { Chat } from "../interfaces/chat";
import { Message } from "../interfaces/message";
import { createMockChats } from "./chat.mock";
import { makeId } from "./chat.utils";
import { AUTO_OFFLINE_DELAY_MS, AUTO_REPLY_DELAY_MS, AUTO_REPLIES } from "./chat-constants";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    private readonly _chats: WritableSignal<Chat[]> = signal(createMockChats(makeId));
    public readonly chats: Signal<Chat[]> = this._chats.asReadonly();

    private readonly offlineTimers = new Map<string, ReturnType<typeof setTimeout>>();

    getChatsSnapshot(): Chat[] {
        return this._chats();
    }

    getChatSignal(id: string): Signal<Chat | undefined> {
        return computed(() => this._chats().find((chat) => chat.id === id));
    }

    createChat(name: string): Chat {
        const cleanName: string = (name ?? "").trim();
        if (!cleanName) {
            throw new Error("El nombre del chat es obligatorio");
        }

        const now: string = new Date().toISOString();

        const newChat: Chat = {
            id: makeId(),
            name: cleanName,
            lastMessage: "",
            avatarUrl: "/avatars/1.png",
            status: "online",
            lastSeen: now,
            messages: [],
        };

        this._chats.update((actuales) => [newChat, ...actuales]);
        return newChat;
    }

    sendMessage(chatId: string, text: string, fromMe: boolean): Message | undefined {
        const cleanText: string = (text ?? "").trim();
        if (!chatId || !cleanText) return undefined;

        const exists: boolean = this._chats().some((c) => c.id === chatId);
        if (!exists) return undefined;

        const now: string = new Date().toISOString();

        const newMessage: Message = {
            id: makeId(),
            text: cleanText,
            fromMe,
            date: now,
        };

        this._chats.update((actuales) => {
            let updatedChat: Chat | undefined;

            const mapped: Chat[] = actuales.map((chat) => {
                if (chat.id !== chatId) return chat;

                const updatedMessages: Message[] = [...chat.messages, newMessage];

                updatedChat = {
                    ...chat,
                    messages: updatedMessages,
                    lastMessage: cleanText,
                    status: !fromMe ? "online" : chat.status,
                    lastSeen: !fromMe ? now : chat.lastSeen,
                };

                return updatedChat;
            });

            if (!updatedChat) return mapped;

            const rest: Chat[] = mapped.filter((c) => c.id !== chatId);
            return [updatedChat, ...rest];
        });

        if (!fromMe) {
            this.scheduleAutoOffline(chatId);
        }

        if (fromMe) {
            this.scheduleAutoReply(chatId);
        }

        return newMessage;
    }

    private scheduleAutoReply(chatId: string): void {
        setTimeout(() => {
            const stillExists: boolean = this._chats().some((c) => c.id === chatId);
            if (!stillExists) return;

            const replyText: string = this.buildAutoReply();
            this.sendMessage(chatId, replyText, false);
        }, AUTO_REPLY_DELAY_MS);
    }

    private scheduleAutoOffline(chatId: string): void {
        const prev = this.offlineTimers.get(chatId);
        if (prev) clearTimeout(prev);

        const t = setTimeout(() => {
            const stillExists: boolean = this._chats().some((c) => c.id === chatId);
            if (!stillExists) return;

            this._chats.update((actuales) =>
                actuales.map((c) => (c.id === chatId ? { ...c, status: "offline" } : c))
            );

            this.offlineTimers.delete(chatId);
        }, AUTO_OFFLINE_DELAY_MS);

        this.offlineTimers.set(chatId, t);
    }

    private buildAutoReply(): string {
        return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    }
}
