export type TraceLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TraceSpan {
  id: string;
  name: string;
  startedAt: number;
  endedAt?: number;
  meta?: Record<string, unknown>;
}

export interface TraceEvent {
  ts: number;
  level: TraceLevel;
  spanId?: string;
  name: string;
  data?: unknown;
}
