import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chats-component',
  imports: [CommonModule],
  templateUrl: './chats-component.html',
  styleUrl: './chats-component.css',
  standalone: true
})
export class ChatsComponent {
  constructor (public chatService: ChatService, private router: Router) {

  }
  open(id: string){
    this.router.navigate(['/chats', id])
  }
  nuevo(){
    this.router.navigate(['/nuevo'])
  }
  
}
