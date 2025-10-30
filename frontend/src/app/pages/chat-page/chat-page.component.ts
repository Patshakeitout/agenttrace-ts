import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent {
  input = '';
  messages: { text: string; from: 'user' | 'agent' }[] = [];
  currentYear = new Date().getFullYear();

  send(): void {
    if (!this.input.trim()) return;
    this.messages.push({ text: this.input, from: 'user' });

    // Mock agent response
    setTimeout(() => {
      this.messages.push({
        text: '🤖 Agent received: ' + this.input,
        from: 'agent',
      });
    }, 400);

    this.input = '';
  }
}

