import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Signal, ViewChild, computed, effect, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

import { ChatService } from "../../services/chat";
import { Chat } from "../../interfaces/chat";
import { FechaPipe } from "../pipes/fecha-pipe";

@Component({
    selector: "app-chat-detail-component",
    imports: [CommonModule, ReactiveFormsModule, RouterLink, FechaPipe],
    templateUrl: "./chat-detail-component.html",
    styleUrl: "./chat-detail-component.css",
    standalone: true,
})
export class ChatDetailComponent implements AfterViewInit {
    private readonly route = inject(ActivatedRoute);
    private readonly chatService = inject(ChatService);

    @ViewChild("historialViewport")
    private historialViewport?: ElementRef<HTMLDivElement>;

    private viewReady = false;
    private lastCount = 0;

    private readonly idSignal = toSignal(
        this.route.paramMap.pipe(map((pm) => pm.get("id") ?? "")),
        { initialValue: "" }
    );

    chatSignal: Signal<Chat | undefined> = computed(() => {
        const id = this.idSignal();
        if (!id) return undefined;
        return this.chatService.getChatSignal(id)();
    });

    messageCtrl = new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(500)],
    });

    form = new FormGroup({
        text: this.messageCtrl,
    });

    constructor() {
        effect(() => {
            const chat = this.chatSignal();
            const count = chat?.messages.length ?? 0;

            if (!this.viewReady) {
                this.lastCount = count;
                return;
            }

            const grew = count > this.lastCount;
            const wasNearBottom = this.isNearBottom(140);

            this.lastCount = count;

            if (!grew) return;
            if (!wasNearBottom) return;

            this.scheduleScrollToBottom("auto");
        });
    }

    ngAfterViewInit(): void {
        this.viewReady = true;
        this.scheduleScrollToBottom("auto");
    }

    private scheduleScrollToBottom(behavior: ScrollBehavior): void {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.scrollToBottom(behavior);
            });
        });
    }

    private isNearBottom(thresholdPx = 80): boolean {
        const el = this.historialViewport?.nativeElement;
        if (!el) return true;

        const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
        return distance <= thresholdPx;
    }

    private scrollToBottom(behavior: ScrollBehavior): void {
        const el = this.historialViewport?.nativeElement;
        if (!el) return;

        el.scrollTo({
            top: el.scrollHeight,
            behavior,
        });
    }

    send() {
        const id = this.idSignal();
        if (!id) return;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const text = this.messageCtrl.value.trim();
        if (!text) {
            this.messageCtrl.setErrors({ required: true });
            return;
        }

        this.chatService.sendMessage(id, text, true);
        this.form.reset({ text: "" });

        this.scheduleScrollToBottom("smooth");
    }
}
