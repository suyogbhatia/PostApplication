import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css']
})
export class LoginComponent {
  isLoading;

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm, ) {
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
}
