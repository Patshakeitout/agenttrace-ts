import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // RxJS subject that holds the latest array of events

// Interfaces
import { TraceEvent, TraceSpan, TraceLevel } from '../../models/trace';

@Injectable({ providedIn: 'root' })
export class TraceService {
  private spans: TraceSpan[] = []; // spans in memory
  // Reactive stream for all trace events
  // With real LLM: replace BehaviorSubject with a call to a server API to persist events
  private events$ = new BehaviorSubject<TraceEvent[]>([]); 

  get trace$() { return this.events$.asObservable(); } // public observable (so footer can show event count)
  
  // Returns all currently active spans (useful for visualization of running operations)
  get openSpans() { return this.spans.filter(s => !s.endedAt); } 


  // Creates a new TraceSpan object with: unique id (UUID), name, startedAt, optional metadata;
  // adds it to the list and fires a debug event of type 'span.start' and returns the span
  startSpan(name: string, meta?: Record<string, unknown>): TraceSpan {
    const span: TraceSpan = { id: crypto.randomUUID(), name, startedAt: performance.now(), meta };
    this.spans.push(span);
    this.event('debug', 'span.start', { spanId: span.id, name, meta });

    return span;
  }

  // Sets the endedAt timestamp, logs the 'span-end' event
  // -> measures operation duration and correlates it with nested events
  endSpan(span: TraceSpan, meta?: Record<string, unknown>) {
    span.endedAt = performance.now();
    this.event('debug', 'span.end', { spanId: span.id, name: span.name, durationMs: span.endedAt - span.startedAt, meta });
  }

  // Adds a custom event to the list and links it to the spanId  
  event(level: TraceLevel, name: string, data?: unknown | string, spanId?: string) {
    const evt: TraceEvent = { ts: Date.now(), level, name, data, spanId };
    this.events$.next([...this.events$.value, evt]);
  }

  // Clearing trace (for a 'clear logs' button)
  clear() {
    this.spans = [];
    this.events$.next([]);
  }
}
