import { CommonModule } from "@angular/common";
import { Component, Signal, computed } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from "@angular/forms";
import { ChatService } from "../../services/chat";
import { Chat } from "../../interfaces/chat";

@Component({
    selector: "app-chat-detail-component",
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: "./chat-detail-component.html",
    styleUrl: "./chat-detail-component.css",
    standalone: true,
})
export class ChatDetailComponent {
    chatSignal!: Signal<Chat | undefined>;
    private id?: string;

    messageCtrl = new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(500)],
    });

    form = new FormGroup({
        text: this.messageCtrl,
    });

    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get("id") ?? undefined;
        this.chatSignal = this.id ? this.chatService.getChatSignal(this.id) : computed(() => undefined);
    }

    send() {
        if (!this.id) return;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const text = this.messageCtrl.value.trim();
        if (!text) {
            this.messageCtrl.setErrors({ required: true });
            return;
        }

        this.chatService.sendMessage(this.id, text, true);
        this.form.reset({ text: "" });
    }

    formatDate(date: string) {
        if (!date) return "";
        return new Date(date).toLocaleString();
    }
}
