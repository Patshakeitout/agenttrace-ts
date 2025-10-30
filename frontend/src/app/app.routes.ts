import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'chat',
    component: ChatPageComponent,
    title: 'AgentTrace · Chat',
  },
  {
    path: '**',
    redirectTo: 'chat',
  },
];

