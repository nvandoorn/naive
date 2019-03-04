import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { MessagingService } from './messaging.service'
import { NaiveService } from './naive.service'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule],
  providers: [MessagingService, NaiveService],
  bootstrap: [AppComponent]
})
export class AppModule {}
