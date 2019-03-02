import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { MessagingService } from './messaging.service'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule {}
