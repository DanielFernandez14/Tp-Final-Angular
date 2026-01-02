import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-chat-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-chat-component.html',
  styleUrl: './new-chat-component.css',
})
export class NewChatComponent {
  form;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      initial: [''],
    });
  }

  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = (this.form.value.name ?? '').trim();
    const initial = (this.form.value.initial ?? '').trim();

    if (!name) {
      this.form.get('name')?.setErrors({ required: true });
      return;
    }

    const chat = this.chatService.createChat(name);

    if (initial) {
      this.chatService.sendMessage(chat.id, initial, true);
    }

    this.router.navigate(['/chats', chat.id]);
  }

  cancel() {
    this.router.navigate(['/chats']);
  }

  get nameCtrl() {
    return this.form.get('name');
  }
}
