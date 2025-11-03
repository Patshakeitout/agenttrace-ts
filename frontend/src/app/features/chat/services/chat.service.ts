import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { TraceService } from './trace.service';

export interface ToolTrace {
  name: string;
  inputs?: unknown;
  outputs?: unknown;
  durationMs?: number;
}

export interface ChatResponse {
  reply: string;
  trace: ToolTrace[];
  tokens: { prompt: number; completion: number };
  cost: number;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = '/api/chat';

  constructor(
    private http: HttpClient,
    private trace: TraceService
  ) {}

  // Sends the prompt to the backend LLM tool endpoint
  sendPrompt(prompt: string): Observable<ChatResponse> {
    const span = this.trace.startSpan('chat.sendPrompt', { promptPreview: prompt.slice(0, 80) });

    this.trace.event('info', 'http.request.start', { url: this.apiUrl }, span.id);

    const startTime = performance.now();

    /* POST request -> attach RxJS operators (pipe()) ->
       tap = RxJS side-effect operator, callback runs only when HTTP succeeds
    */
    return this.http.post<ChatResponse>(this.apiUrl, { prompt }).pipe(
      tap((res) => {
        const durationMs = performance.now() - startTime;
        this.trace.event('info', 'http.request.end', { durationMs, status: 'ok' }, span.id);

        // Log response metrics for local trace viewer
        this.trace.event('debug', 'chat.reply.received', {
          replyPreview: res.reply.slice(0, 120),
          tokens: res.tokens,
          cost: res.cost
        }, span.id);

        // Also merge backend tool traces into the local trace log
        res.trace?.forEach(tool => {
          this.trace.event('debug', `tool.${tool.name}`, {
            inputs: tool.inputs,
            outputs: tool.outputs,
            durationMs: tool.durationMs
          }, span.id);
        });

        this.trace.endSpan(span, { success: true, totalDurationMs: durationMs });
      }),
      catchError((error) => {
        const durationMs = performance.now() - startTime;
        this.trace.event('error', 'http.request.error', { durationMs, error }, span.id);
        this.trace.endSpan(span, { success: false, durationMs, error: String(error) });
        return throwError(() => error);
      })
    );
  }
}
