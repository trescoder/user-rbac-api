import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartComponent } from './start.component';
import { GlobalModule } from '../global/global.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    StartComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild([
      {
        path: '',
        component: StartComponent
      }
    ])
  ]
})
export class StartModule { }
