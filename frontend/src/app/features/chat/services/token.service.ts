// Token counter

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TokenSnapshot {
  lastMessageTokens: number;
  sessionTokens: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private sessionTokens = 0;
  private snap$ = new BehaviorSubject<TokenSnapshot>({ lastMessageTokens: 0, sessionTokens: 0 });

  estimate(text: string): number {
    // Char-based heuristic; swap later for a real tokenizer (1 token ≈ 4 characters of text)
    const approx = Math.ceil(text.replace(/\s+/g, ' ').trim().length / 4);
    return Math.max(0, approx);
  }

  addMessage(text: string) {
    const last = this.estimate(text);
    this.sessionTokens += last;
    this.snap$.next({ lastMessageTokens: last, sessionTokens: this.sessionTokens });
  }

  get snapshot$() { return this.snap$.asObservable(); }

  reset() {
    this.sessionTokens = 0;
    this.snap$.next({ lastMessageTokens: 0, sessionTokens: 0 });
  }
}
