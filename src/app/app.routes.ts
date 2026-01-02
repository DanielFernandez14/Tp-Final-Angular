import { Routes } from '@angular/router';
import { ChatsComponent } from './chats-component/chats-component';
import { ChatDetailComponent } from './chat-detail-component/chat-detail-component';
import { NewChatComponent } from './new-chat-component/new-chat-component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'chats', pathMatch: 'full'
    },
    {
        path: 'chats', component: ChatsComponent
    },
    {
        path: 'chats/:id', component: ChatDetailComponent
    },
    {
        path: 'nuevo', component: NewChatComponent
    },
    {
        path: '**', redirectTo: 'chats'
    }

];
