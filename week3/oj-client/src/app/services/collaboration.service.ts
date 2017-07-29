import { Injectable } from '@angular/core';

declare const io: any
// whenever editor change, send the change event to server
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  constructor() { }

  init(): void {
    this.collaborationSocket = io(window.location.origin, {query: "message=" + "ha"});

    // when receive 'message'
    this.collaborationSocket.on('message', (message) => {
      console.log('message received from server: ' + message);
    })
  }

}
