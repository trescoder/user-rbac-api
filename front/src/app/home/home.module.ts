import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { GlobalModule } from '../global/global.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { StartMenuComponent } from './start-menu/start-menu.component';

@NgModule({
  declarations: [HomeComponent, StartMenuComponent],
  imports: [
    CommonModule,
    GlobalModule,
    MatSidenavModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        children: [
          {
            path: '',
            loadChildren: () =>
              import('src/app/start/start.module').then((m) => m.StartModule),
          },
        ],
      },
    ]),
  ],
})
export class HomeModule {}
