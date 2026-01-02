import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _chats: WritableSignal<Chat[]> = signal(this.createMock());
  public readonly chats: Signal<Chat[]> = this._chats;

  private readonly AUTO_REPLY_DELAY_MS = 1200;

  constructor() {}

  private createMock(): Chat[] {
    const now = new Date().toISOString();

    const messages: Message[] = [
      { id: this.makeId(), text: 'Hola!', fromMe: false, date: now },
      { id: this.makeId(), text: 'Todo bien?', fromMe: false, date: now },
    ];

    return [
      {
        id: '1',
        name: 'Alicia',
        lastMessage: messages[messages.length - 1]?.text ?? '',
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
    const cleanName = (name ?? '').trim();
    if (!cleanName) {
      throw new Error('El nombre del chat es obligatorio');
    }

    const newChat: Chat = {
      id: this.makeId(),
      name: cleanName,
      lastMessage: '',
      messages: [],
    };

    this._chats.update((actuales) => [...actuales, newChat]);
    return newChat;
  }

  sendMessage(chatId: string, text: string, fromMe: boolean): Message | undefined {
    const cleanText = (text ?? '').trim();
    if (!chatId || !cleanText) return undefined;

    const exists = this._chats().some((c) => c.id === chatId);
    if (!exists) return undefined;

    const newMessage: Message = {
      id: this.makeId(),
      text: cleanText,
      fromMe,
      date: new Date().toISOString(),
    };

    this._chats.update((actuales) =>
      actuales.map((chat) => {
        if (chat.id !== chatId) return chat;

        const updatedMessages = [...chat.messages, newMessage];
        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: cleanText,
        };
      })
    );

    if (fromMe) {
      this.scheduleAutoReply(chatId, cleanText);
    }

    return newMessage;
  }

  private scheduleAutoReply(chatId: string, userText: string): void {
    setTimeout(() => {
      const stillExists = this._chats().some((c) => c.id === chatId);
      if (!stillExists) return;

      const replyText = this.buildAutoReply(userText);
      this.sendMessage(chatId, replyText, false);
    }, this.AUTO_REPLY_DELAY_MS);
  }

  private buildAutoReply(userText: string): string {
    return `Recibido: ${userText}`;
  }
}
