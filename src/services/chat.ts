import { Injectable, Signal, WritableSignal, computed, signal } from "@angular/core";
import { Chat } from "../interfaces/chat";
import { Message } from "../interfaces/message";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    private readonly _chats: WritableSignal<Chat[]> = signal(this.createMock());
    public readonly chats: Signal<Chat[]> = this._chats.asReadonly();

    private readonly AUTO_REPLY_DELAY_MS: number = 1200;

    private createMock(): Chat[] {
        const now: string = new Date().toISOString();

        const messages: Message[] = [
            { id: this.makeId(), text: "Hola!", fromMe: false, date: now },
            { id: this.makeId(), text: "Todo bien?", fromMe: false, date: now },
        ];

        return [
            {
                id: "1",
                name: "Alicia",
                lastMessage: messages[messages.length - 1]?.text ?? "",
                avatarUrl: "/avatars/1.png",
                status: "online",
                lastSeen: now,
                messages,
            },
        ];
    }

    private makeId(): string {
        try {
            return crypto.randomUUID();
        } catch {
            return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }
    }

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
            id: this.makeId(),
            name: cleanName,
            lastMessage: "",
            avatarUrl: "/avatars/1.png",
            status: "online",
            lastSeen: now,
            messages: [],
        };

        this._chats.update((actuales) => [...actuales, newChat]);
        return newChat;
    }

    sendMessage(chatId: string, text: string, fromMe: boolean): Message | undefined {
        const cleanText: string = (text ?? "").trim();
        if (!chatId || !cleanText) return undefined;

        const exists: boolean = this._chats().some((c) => c.id === chatId);
        if (!exists) return undefined;

        const now: string = new Date().toISOString();

        const newMessage: Message = {
            id: this.makeId(),
            text: cleanText,
            fromMe,
            date: now,
        };

        this._chats.update((actuales) =>
            actuales.map((chat) => {
                if (chat.id !== chatId) return chat;

                const updatedMessages: Message[] = [...chat.messages, newMessage];

                return {
                    ...chat,
                    messages: updatedMessages,
                    lastMessage: cleanText,
                    lastSeen: fromMe ? chat.lastSeen : now,
                };
            })
        );

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
        }, this.AUTO_REPLY_DELAY_MS);
    }

    private buildAutoReply(): string {
        const replies: string[] = ["Dale, entendido.", "Perfecto.", "Ok, sigo acá.", "Copiado.", "De una."];
        return replies[Math.floor(Math.random() * replies.length)];
    }
}
