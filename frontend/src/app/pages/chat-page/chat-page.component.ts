import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { ChatService, ChatResponse, ToolTrace } from '../../features/chat/services/chat.service';

interface ChatMessage {
  from: 'user' | 'agent';
  text: string;
  trace?: ToolTrace[]; 
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
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
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

    // User message
    this.messages.push({ from: 'user', text: prompt });
    this.input = '';
    this.loading = true;

    this.chatService.sendPrompt(prompt).subscribe({
      next: (res: ChatResponse) => {
        this.loading = false;
        // Agent reply
        this.messages.push({ from: 'agent', text: res.reply });

        // Trace info for debugging
        console.log('Trace:', res.trace);
      },
      error: (err) => {
        this.loading = false;
        this.messages.push({
          from: 'agent',
          text: '⚠️ Fehler bei der Anfrage: ' + err.message
        });
      }
    });
  }
}
