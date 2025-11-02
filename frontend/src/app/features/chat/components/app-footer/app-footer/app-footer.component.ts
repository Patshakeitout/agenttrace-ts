// Footer with live Token counter + simple Guardrails status
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest, map } from 'rxjs';

import { TokenService } from '../../../services/trace.service';
import { TraceService } from '../../../services/trace.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit, OnDestroy {
  vm = { last: 0, session: 0, events: 0 };
  sub?: Subscription;

  constructor(private tokens: TokenService, private trace: TraceService) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.tokens.snapshot$,
      this.trace.trace$.pipe(map(evts => evts.length))
    ]).subscribe(([snap, count]) => {
      this.vm = { last: snap.lastMessageTokens, session: snap.sessionTokens, events: count };
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
