import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

// TODO use npm/yarn
import { dbFactory, DatabaseConnection } from 'naive-client'

import { ChatMessage } from './chat-message.model'

const wsUrl = 'ws://localhost:5001'
const httpUrl = 'http://localhost:5000'

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private db: DatabaseConnection
  constructor() {
    this.db = dbFactory({ wsUrl, httpUrl })
  }

  init() {
    return this.db.init()
  }

  async makeChatRoom(userId: string): Promise<string> {
    const chatRoomId = Date.now().toString()
    await this.db.write(`/chatRooms/${chatRoomId}`, {
      user: 'admin',
      message: `Oh no she better don't`
    })
    return chatRoomId
  }

  getChatRoom(chatRoomId: string): Observable<ChatMessage[]> {
    return Observable.create(observer => {
      this.db.subscribe(`/chatRooms/${chatRoomId}`, data => {
        observer.next(Object.values(data))
      })
    })
  }

  sendMessage(userId: string, chatRoomId: string, message: string) {
    return this.db.write(`/chatRooms/${chatRoomId}`, {
      [Date.now().toString()]: {
        user: userId,
        message
      }
    })
  }
}
