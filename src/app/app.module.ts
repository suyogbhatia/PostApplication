import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from "./auth/login/login.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import { HeaderComponet } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponet,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    /* multi will allow multiple interceptor to run in the app and won't
      overwrite the existing ones */
  ],
  entryComponents: [ErrorComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  //allows to use non-angular elements named with dash-case(like mat=accordian)
})
export class AppModule { }
