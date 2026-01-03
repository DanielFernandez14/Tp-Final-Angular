import { CommonModule } from "@angular/common";
import { Component, Signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { startWith } from "rxjs/operators";
import { ChatService } from "../../services/chat";
import { FechaPipe } from "../pipes/fecha-pipe";
import { Chat } from "../../interfaces/chat";

@Component({
    selector: "app-chats-component",
    imports: [CommonModule, FechaPipe, ReactiveFormsModule],
    templateUrl: "./chats-component.html",
    styleUrl: "./chats-component.css",
    standalone: true,
})
export class ChatsComponent {
    queryCtrl = new FormControl("", { nonNullable: true });

    private readonly querySignal = toSignal(
        this.queryCtrl.valueChanges.pipe(startWith(this.queryCtrl.value)),
        { initialValue: "" }
    );

    private lastActivityMs(chat: Chat): number {
        const lastMsgDate = chat.messages?.length ? chat.messages[chat.messages.length - 1]?.date : undefined;
        const raw = lastMsgDate ?? chat.lastSeen ?? "";
        const t = Date.parse(raw);
        return Number.isFinite(t) ? t : 0;
    }

    chatsFiltrados: Signal<Chat[]> = computed(() => {
        const q = (this.querySignal() ?? "").trim().toLowerCase();
        const chats = this.chatService.chats();

        const filtrados = !q
            ? chats
            : chats.filter((c) => {
                    const name = (c.name ?? "").toLowerCase();
                    const last = (c.lastMessage ?? "").toLowerCase();
                    return name.includes(q) || last.includes(q);
                });

        return [...filtrados].sort((a, b) => this.lastActivityMs(b) - this.lastActivityMs(a));
    });

    constructor(
        public chatService: ChatService,
        private router: Router
    ) {}

    open(id: string) {
        this.clearSearch();
        this.router.navigate(["/chats", id]);
    }

    nuevo() {
        this.router.navigate(["/nuevo"]);
    }

    clearSearch() {
        this.queryCtrl.setValue("");
    }
}
