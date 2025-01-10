import { Route } from '@angular/router';
import { SystemConfigListComponent } from './pages/system.config.list.component';

export const routes: Route[] = [
  {
    path: 'system',
    component: SystemConfigListComponent,
  },
];
