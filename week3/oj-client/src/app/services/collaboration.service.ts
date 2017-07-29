import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors';

declare const io: any;
declare const ace: any;
// whenever editor change, send the change event to server
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  clientInfo: Object = {}; // mantain the cursor color for each client
  clientNum: number = 0;
  constructor() { }

  init(editor: any, sessionId: string): void {
    // handshake send the sessionId to server
    this.collaborationSocket = io(window.location.origin, {query: "sessionId=" + sessionId});

    // register change event handler, when receive the change from others, we need to apply the change on our own editor
    this.collaborationSocket.on('change', (delta: string) => {
      console.log('collaboration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChanged = delta;
      // apply the change on the editor, this function is provided by ace editor
      editor.getSession().getDocument().applyDeltas([delta]);
    })

    // handle cursorMove event, when receive cursorMove event from server, apply the cursor move to the editor
    // the cursor parameter contains cursor position and socketId of owner of the cursor
    this.collaborationSocket.on('cursorMove', (cursor) => {
      const editorSession = editor.getSession();
      cursor = JSON.parse(cursor);
      const x = cursor['row'];
      const y = cursor['column'];
      const clientId = cursor['socketId'];

      // if the client alreay in clientInfo, remove the cursor
      // otherwise create new cursor for the client by creating css style
      if (clientId in this.clientInfo) {
        editorSession.removeMarker(this.clientInfo[clientId]['marker']);
      } else { 
        this.clientInfo[clientId] = {};

        // create a color for the new cursor by creating a css style
        const css = document.createElement('style');
        css.type = 'text/css';

        // The z-index property specifies the stack order of an element.
        // An element with greater stack order is always in front of an element with a lower stack order.
        // Note: z-index only works on positioned elements (position:absolute, position:relative, or position:fixed).
        // https://www.w3schools.com/cssref/pr_pos_z-index.asp
        // A rule that has the !important property will always be applied no matter where that rule appears in the CSS document
        css.innerHTML = '.editor_cursor_' + clientId
         + '{ position: absolute; background: ' + COLORS[this.clientNum] + ';'
         + 'z-index: 100; width: 3px !important; }';

        document.body.appendChild(css);
        this.clientNum++;
      }

      // draw the new marker
      const Range = ace.require('ace/range').Range
      // addMarker(Range, String(css class for the marker), Function|String (type of the marker), Boolean(inFont, true: infront marker is created))
      // If inFront is true, a front marker is defined, and the 'changeFrontMarker' event fires; otherwise, the 'changeBackMarker' event fires.
      const newMarker = editorSession.addMarker(new Range(x, y, x, y+1), 'editor_cursor_' + clientId, true);
      this.clientInfo[clientId]['marker'] = newMarker;
    })

    // we don't need 'restoreBuffer' handler, since it will be handled by change
  }

  // send our own editor change to server as an change event
  change(delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }

  cursorMove(cursorPosition: string): void {
    this.collaborationSocket.emit('cursorMove', cursorPosition);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }

}
