// Footer with live Token counter + simple Guardrails status
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest, map } from 'rxjs';

import { TokenService } from '../../../services/token.service';
import { TraceService } from '../../../services/trace.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit, OnDestroy {
  vm = { last: 0, session: 0, events: 0 }; // View Model
  sub?: Subscription;

  constructor(private tokens: TokenService, private trace: TraceService) {}

  ngOnInit(): void {
    // Combined emmission [snap, count]
    this.sub = combineLatest([
      this.tokens.snapshot$, // emits { lastMessageTokens, sessionTokens }
      this.trace.trace$.pipe(map(evts => evts.length)) // emits number of events
    ]).subscribe(([snap, count]) => {
      // Update vm, updates footer display automatically
      this.vm = { last: snap.lastMessageTokens, session: snap.sessionTokens, events: count };
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
