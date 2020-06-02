import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public faSpinner = faSpinner;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  public user;
  public password;
  public loading = false;
  login(){
    const self = this;
    self.loading = true;
    axios({
      method: 'post',
      url: 'https://frontend-excercise.dt.timlabtesting.com/ops/login',
      data:{
        email: self.user,
        password: self.password,
      },
      timeout:30000,
    }).then(function(response){
      localStorage.setItem('timining-user',JSON.stringify(response.data));
      self.router.navigate(['/events']);
      self.loading = false;
    }).catch(function(error){
      self.loading = false;
      if(error.code == 'ECONNABORTED'){
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Timeout. Check your internet connection and try again'
        })
      }else if(error.response.status == 403){
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Unvalid user/password'
        })
      }else{
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Unknown error'
        })
      }
    })
  }
}
