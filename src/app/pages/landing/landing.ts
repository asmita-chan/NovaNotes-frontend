import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(private http: HttpClient, private fb: FormBuilder, private authService: Auth, private toastr: ToastrService, private router: Router){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, (control: AbstractControl) => control.value && control.value.trim().length > 0 ? null : { whitespace: true }]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), (control: AbstractControl) => control.value && control.value.trim().length > 0 ? null : { whitespace: true }]]
    });
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['',[Validators.required, (control: AbstractControl) => control.value && control.value.trim().length > 0 ? null : { whitespace: true }]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), (control: AbstractControl) => control.value && control.value.trim().length > 0 ? null : { whitespace: true }]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });
  }
  ngOnInit(){
    this.getApi().subscribe(
      (response: any) => {
        console.log(response.GeneratedCode);
      }
    )
  }
  BASE_URL: String = environment.BASE_URL;
  getApi(): Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/`);
  }
  showLogin: Boolean = false;
  showSignup: Boolean = false;
  openLogin(){
    this.showLogin = true;
    this.showSignup = false;
  }
  openSignup(){
    this.showLogin = false;
    this.showSignup = true;
  }
  goBack(){
    this.showLogin = false;
    this.showSignup = false;
  }
  showPassword: Boolean = false;
  loginForm: FormGroup;
  signupForm: FormGroup;
  submitLogin(){
    const postJson = {
      "username": this.loginForm.get('username')?.value,
      "password": this.loginForm.get('password')?.value
    }
    this.authService.getLogin(postJson).subscribe({
      next: (res) => {
        if(res.StatusCode === '200'){
          sessionStorage.setItem("userId", res.loginResponse.userId);
          sessionStorage.setItem("accessToken", res.loginResponse.token);
          console.log("Signup Success: ", res);
          this.toastr.success("Login Success");
          this.router.navigate(['/dashboard'], {state: { name: res.loginResponse.name }});
        }
        else if(res.StatusCode === '417'){
          console.log("Exception ---->", res)
          this.toastr.warning("Bad Credentials");
        }
        else{
          console.log("Exception ---->", res)
          this.toastr.error("Error", "Something went wrong. Please try again later.");
        }
      },
      error: (err) => {
        this.toastr.error("Error", "Something went wrong. Please try again later.")
        console.error("Error: ", err);
      }
    })
  }
  submitSignup(){
    const postJson = {
      "name": this.signupForm.get('name')?.value,
      "email": this.signupForm.get('email')?.value,
      "mobile": this.signupForm.get('mobile')?.value,
      "loginId": this.signupForm.get('username')?.value,
      "userPwd": this.signupForm.get('password')?.value,
      "activeFlag": "true"
    }
    this.authService.getSignup(postJson).subscribe({
      next: (res) => {
        if(res.StatusCode === '200'){
          sessionStorage.setItem("userId", res.loginResponse.userId);
          sessionStorage.setItem("accessToken", res.loginResponse.token);
          console.log("Signup Success: ", res);
          this.toastr.success("Sign Up Successful");
          this.router.navigate(['/dashboard'], {state: { name: res.loginResponse.name }});
          // window.open("/notes/notes", "_self");
        }
        else if(res.StatusCode === '417'){
          console.log("Exception ---->", res)
          this.toastr.warning("Username already taken");
        }
        else{
          console.log(res);
          this.toastr.error("Error", "Something went wrong. Please try again Later");
        }
      },
      error: (err) => {
         console.error("Signup Failed: ", err);
         this.toastr.error("Error", "Something went wrong. Please try again Later");
      }
    })
  }
  togglePassword(){
    this.showPassword = !this.showPassword;
  }
  openAuthModal(){
    const modal = document.getElementById('auth-modal');
    if(modal) modal.classList.remove('hidden');
  }
}
