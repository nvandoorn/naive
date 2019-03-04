import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { dbFactory, DatabaseConnection } from 'naive-client'

import { NaiveServiceInterface } from './naive.model'

const wsUrl = 'ws://localhost:5001'
const httpUrl = 'http://localhost:5000'

@Injectable({
  providedIn: 'root'
})
export class NaiveService {
  private db: DatabaseConnection = dbFactory({ wsUrl, httpUrl })
  init = this.db.init
  write = this.db.write
  read = this.db.read
  remove = this.db.remove
  subscribe = this.db.subscribe

  toObservable(path: string): Observable<any> {
    return Observable.create(observer => {
      this.subscribe(path, data => {
        observer.next(data)
      })
    })
  }
}
