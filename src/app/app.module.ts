import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    SafeHtmlPipe,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
