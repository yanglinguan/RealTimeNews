import { Component, OnInit, Inject } from '@angular/core';
// when AuthService is not globally provide, we need to import
import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title: string = "COJ"
  profile: any
  constructor(
    private auth: AuthService // don not inject
  ) { 
    this.auth.userProfile.subscribe(
      profile => this.profile = profile
    );
  }

  ngOnInit() {
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

}
