import { Component } from '@angular/core';
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // every time the url contain hash, handleAuthentication will be called
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  title = 'COJ';
}
