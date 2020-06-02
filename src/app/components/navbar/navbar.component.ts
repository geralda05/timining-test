import { Component, OnInit } from '@angular/core';
import { faCheck, faExclamationTriangle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public faUserCircle = faUserCircle;
  constructor(public router: Router) { }

  public userData = {firstName:'', lastName:'', profilePictureUrl:''}
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('timining-user'))  
  }

  logout(){
    this.router.navigate(['/login']);
    localStorage.removeItem('timining-user')
  }
}
