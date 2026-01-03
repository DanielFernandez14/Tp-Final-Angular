import { Chat } from "../interfaces/chat";
import { Message } from "../interfaces/message";

export function createMockChats(makeId: () => string): Chat[] {
    const base = Date.now();

    const iso = (offsetMs: number): string => new Date(base - offsetMs).toISOString();

    const makeMsgs = (items: { text: string; fromMe: boolean; offsetMs: number }[]): Message[] =>
        items.map((m) => ({
            id: makeId(),
            text: m.text,
            fromMe: m.fromMe,
            date: iso(m.offsetMs),
        }));

    const c1Messages = makeMsgs([
        { text: "Hola!", fromMe: false, offsetMs: 1000 * 60 * 18 },
        { text: "Todo bien?", fromMe: false, offsetMs: 1000 * 60 * 16 },
    ]);

    const c2Messages = makeMsgs([
        { text: "Che, ¿tenés un minuto?", fromMe: false, offsetMs: 1000 * 60 * 55 },
        { text: "Sí, decime", fromMe: true, offsetMs: 1000 * 60 * 54 },
        { text: "Dale, después te aviso.", fromMe: false, offsetMs: 1000 * 60 * 52 },
    ]);

    const c3Messages = makeMsgs([
        { text: "¿Lo viste?", fromMe: false, offsetMs: 1000 * 60 * 35 },
        { text: "Estoy en eso", fromMe: true, offsetMs: 1000 * 60 * 34 },
        { text: "Te mando el link en un rato.", fromMe: false, offsetMs: 1000 * 60 * 32 },
    ]);

    const c4Messages = makeMsgs([
        { text: "¿Podés ahora?", fromMe: false, offsetMs: 1000 * 60 * 24 },
        { text: "Sí", fromMe: true, offsetMs: 1000 * 60 * 23 },
        { text: "Joya ", fromMe: false, offsetMs: 1000 * 60 * 22 },
    ]);

    const c5Messages = makeMsgs([
        { text: "Quedó algo pendiente?", fromMe: false, offsetMs: 1000 * 60 * 90 },
        { text: "Un detalle nomás", fromMe: true, offsetMs: 1000 * 60 * 88 },
        { text: "Mañana lo cerramos.", fromMe: false, offsetMs: 1000 * 60 * 86 },
    ]);

    const c6Messages = makeMsgs([
        { text: "¿Subiste los cambios?", fromMe: false, offsetMs: 1000 * 60 * 14 },
        { text: "Listo, quedó subido.", fromMe: true, offsetMs: 1000 * 60 * 13 },
    ]);

    return [
        {
            id: "1",
            name: "Alicia",
            messages: c1Messages,
            lastMessage: c1Messages[c1Messages.length - 1]?.text ?? "",
            avatarUrl: "/avatars/1.png",
            status: "online",
            lastSeen: iso(1000 * 60 * 16),
        },
        {
            id: "2",
            name: "Bruno",
            messages: c2Messages,
            lastMessage: c2Messages[c2Messages.length - 1]?.text ?? "",
            avatarUrl: "/avatars/2.png",
            status: "offline",
            lastSeen: iso(1000 * 60 * 52),
        },
        {
            id: "3",
            name: "Carla",
            messages: c3Messages,
            lastMessage: c3Messages[c3Messages.length - 1]?.text ?? "",
            avatarUrl: "/avatars/3.png",
            status: "online",
            lastSeen: iso(1000 * 60 * 32),
        },
        {
            id: "4",
            name: "Diego",
            messages: c4Messages,
            lastMessage: c4Messages[c4Messages.length - 1]?.text ?? "",
            avatarUrl: "/avatars/4.png",
            status: "offline",
            lastSeen: iso(1000 * 60 * 22),
        },
        {
            id: "5",
            name: "Ema",
            messages: c5Messages,
            lastMessage: c5Messages[c5Messages.length - 1]?.text ?? "",
            avatarUrl: "/avatars/6.png",
            status: "offline",
            lastSeen: iso(1000 * 60 * 86),
        },
        {
            id: "6",
            name: "Fede",
            messages: c6Messages,
            lastMessage: c6Messages[c6Messages.length - 1]?.text ?? "",
            avatarUrl: "/avatars/5.png",
            status: "online",
            lastSeen: iso(1000 * 60 * 13),
        },
    ];
}
