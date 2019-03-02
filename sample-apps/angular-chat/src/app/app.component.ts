import { Component } from '@angular/core'

import { MessagingService } from './messaging.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private MessagingService) {}
  title = 'angular-chat'
}
