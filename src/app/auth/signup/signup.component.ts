import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthData } from "../auth-data.model";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls:['./signup.component.css']
})
export class SignupComponent {
  isLoading;

  constructor(private authService: AuthService) {}
  onSignup(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.createUser(authData);
  }
}
