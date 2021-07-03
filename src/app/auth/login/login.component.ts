import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  onLogin(form: NgForm,) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    const user = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.loginUser(user);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(res => {
      this.isLoading = res;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
