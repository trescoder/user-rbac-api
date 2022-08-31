import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiModule, Configuration } from './api';
import { JwtService } from './auth/jwt.service';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    ApiModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: Configuration,
      useFactory: (jwtService: JwtService) =>
        new Configuration({
          basePath: environment.apiUrl,
          accessToken: jwtService.getJWT.bind(jwtService),
        }),
      deps: [JwtService],
      multi: false,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
