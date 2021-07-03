import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthData } from "../auth-data.model";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(res => {
      this.isLoading = res;
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

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
