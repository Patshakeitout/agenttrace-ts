import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ToolTrace {
  step: string;
  tool: string;
  args: any;
  result: any;
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

  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { prompt });
  }
}
