import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { ChatService, ChatResponse, ToolTrace } from '../../features/chat/services/chat.service';
import { MiniGuardrailsService } from '../../features/chat/services/mini-guardrails.service';
import { TokenService } from '../../features/chat/services/token.service';
import { TraceService } from '../../features/chat/services/trace.service';
import { AppFooterComponent } from "../../features/chat/components/app-footer/app-footer/app-footer.component";


interface ChatMessage {
  role: 'user' | 'agent' | 'system';
  text: string;
  meta?: { toolTraces?: ToolTrace[] };
}

@Component({
  selector: 'app-chat-page',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    AppFooterComponent
  ],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  input = '';
  messages: ChatMessage[] = [];
  currentYear = new Date().getFullYear();
  loading = false;

  @ViewChild('inputArea') inputArea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private chatService: ChatService,
    private guard: MiniGuardrailsService,
    private tokens: TokenService,
    private trace: TraceService,
    private snack: MatSnackBar
  ) { }

  send(): void {
    const prompt = this.input.trim();
    if (!prompt) return;

    const span = this.trace.startSpan('ui.sendClick');

    // Guardrails
    const guardRail = this.guard.checkMessage(prompt);
    this.trace.event('info', 'guardrails.checked', guardRail, span.id);

    if (!guardRail.allowed) {
      this.trace.event('warn', 'guardrails.blocked', { reasons: guardRail.reasons }, span.id);
      this.snack.open(`Blocked: ${guardRail.reasons.join(' · ')}`, 'OK', { duration: 4000 });
      this.trace.endSpan(span, { blocked: true });
      return;
    }

    // Token
    this.tokens.addMessage(prompt);

    // User message
    this.messages.push({ role: 'user', text: prompt });
    this.input = '';
    this.loading = true;

    this.chatService.sendPrompt(prompt).subscribe({
      next: (res: ChatResponse) => {
        this.loading = false;
        this.tokens.addMessage(res.reply);

        // Agent reply
        this.messages.push({
          role: 'agent',
          text: res.reply,
          meta: { toolTraces: res.trace }
        });

        // Trace info for debugging
        console.log('Trace:', res.trace);
      },
      error: (e) => {
        this.trace.event('error', 'chat.error', { message: String(e) }, span.id);
        this.snack.open('Error sending message', 'OK', { duration: 3000 });
      },
      complete: () => {
        this.loading = false;
        this.trace.endSpan(span, { ok: true });
        queueMicrotask(() => this.inputArea?.nativeElement?.focus());
      }
    });
  }

  onEnter(event: Event) {
    const e = event as KeyboardEvent;
    if (!e.shiftKey) {
      this.send();
      e.preventDefault();
    }
  }
}
