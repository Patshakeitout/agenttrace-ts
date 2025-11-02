import { Injectable } from '@angular/core';

export interface GuardrailResult {
  allowed: boolean;
  reasons: string[];
  tags: string[]; // e.g. ['pii','nsfw','length']
}

@Injectable({ providedIn: 'root' })
export class MiniGuardrailsService {
  // 👇 extend these as needed
  private banned = [
    /(?<!\w)drop\s+table\b/i,
    /(?<!\w)truncate\s+table\b/i,
    /\b(api[_-]?key|password|passwort|token)\b\s*[:=]\s*[^\s'"]+/i,
  ];

  private pii = [
    /\b\d{2,3}-?\d{2,3}-?\d{4,}\b/,             // loose phone/ID
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i // email
  ];

  checkMessage(text: string): GuardrailResult {
    const reasons: string[] = [];
    const tags: string[] = [];

    if (text.length > 4000) { reasons.push('Message too long'); tags.push('length'); }

    if (this.banned.some(rx => rx.test(text))) {
      reasons.push('Contains banned patterns (e.g., destructive SQL or secret-like values).');
      tags.push('suspicious');
    }

    if (this.pii.some(rx => rx.test(text))) {
      reasons.push('Looks like it contains personal data (PII).');
      tags.push('pii');
    }

    // very light NSFW/abuse screen (placeholder)
    if (/(kill|hate|suicide|nsfw)/i.test(text)) {
      reasons.push('Potentially sensitive/abusive content.');
      tags.push('safety');
    }

    return { allowed: reasons.length === 0, reasons, tags };
  }
}
