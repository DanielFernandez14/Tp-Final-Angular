import { CommonModule } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat';
import { Chat } from '../../interfaces/chat';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-detail-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-detail-component.html',
  styleUrl: './chat-detail-component.css',
  standalone: true,
})
export class ChatDetailComponent {
  chatSignal!: Signal<Chat | undefined>;
  private id?: string;

  messageCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(500)],
  });

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.chatSignal = this.id
      ? this.chatService.getChatSignal(this.id)
      : computed(() => undefined);
  }

  send() {
    if (!this.id) return;

    if (this.messageCtrl.invalid) {
      this.messageCtrl.markAsTouched();
      return;
    }

    const text = this.messageCtrl.value.trim();
    if (!text) {
      this.messageCtrl.setErrors({ required: true });
      return;
    }

    this.chatService.sendMessage(this.id, text, true);
    this.messageCtrl.reset('');
  }

  formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }
}
