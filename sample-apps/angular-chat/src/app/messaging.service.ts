import { Injectable } from '@angular/core'
import { Observable, pipe } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { NaiveService } from './naive.service'
import { ChatMessage } from './chat-message.model'

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  constructor(private db: NaiveService) {}

  init() {
    return this.db.init()
  }

  async makeChatRoom(): Promise<string> {
    const chatRoomId = `chatRoom-${Date.now().toString()}`
    await this.pushToDirectory(chatRoomId)
    await this.pushToChatRoom('admin', chatRoomId, 'oh hey')
    return chatRoomId
  }

  // TODO this is broken because of how path matching
  // is implemented
  getDirectory(): Observable<string[]> {
    return this.db.toObservable(`/directory`).pipe(map(Object.keys))
  }

  getChatRoom(chatRoomId: string): Observable<ChatMessage[]> {
    return this.db
      .toObservable(`/chatRooms/${chatRoomId}`)
      .pipe(map(Object.values))
  }

  sendMessage(userId: string, chatRoomId: string, message: string) {
    return this.pushToChatRoom(userId, chatRoomId, message)
  }

  private pushToDirectory(chatRoomId: string) {
    return this.db.write(`/directory/${chatRoomId}`, { created: Date.now() })
  }

  private pushToChatRoom(userId: string, chatRoomId: string, message: string) {
    return this.db.write(`/chatRooms/${chatRoomId}`, {
      [Date.now().toString()]: {
        user: userId,
        message
      }
    })
  }
}
