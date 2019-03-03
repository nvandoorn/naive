import { Component } from '@angular/core'

import { Observable } from 'rxjs'

import { MessagingService } from './messaging.service'
import { ChatMessage } from './chat-message.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userId: string = ''
  chatRoomId: string
  messages$: Observable<ChatMessage[]>
  messageBuff: string
  constructor(private messaging: MessagingService) {}

  ngOnInit() {
    this.messaging.init()
  }

  sendMessage() {
    this.messaging.sendMessage(this.userId, this.chatRoomId, this.messageBuff)
  }

  async makeChatRoom() {
    this.chatRoomId = await this.messaging.makeChatRoom(this.userId)
    this.messages$ = this.messaging.getChatRoom(this.chatRoomId)
  }
}
