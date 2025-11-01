import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatResponse } from './chat.service';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

interface ChatMessage {
  from: 'user' | 'agent';
  text: string;
}

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: '../../pages/chat-page/chat-page.component.html',
  styleUrls: ['../../pages/chat-page/chat-page.component.scss']
})
export class ChatPageComponent {
  input = '';
  messages: ChatMessage[] = [];
  currentYear = new Date().getFullYear();
  loading = false;

  constructor(private chatService: ChatService) {}

  send(): void {
    const prompt = this.input.trim();
    if (!prompt) return;

    // Add user message immediately
    this.messages.push({ from: 'user', text: prompt });
    this.input = '';
    this.loading = true;

    this.chatService.sendPrompt(prompt).subscribe({
      next: (res: ChatResponse) => {
        this.loading = false;
        // Add agent reply
        this.messages.push({ from: 'agent', text: res.reply });

        // Optional: Trace info for debugging
        console.log('Trace:', res.trace);
      },
      error: (err) => {
        this.loading = false;
        this.messages.push({
          from: 'agent',
          text: '⚠️ Error in request: ' + err.message
        });
      }
    });
  }
}
