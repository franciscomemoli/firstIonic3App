import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SignupPage } from '../signup/signup'
import { ResetPasswordPage } from '../reset-password/reset-password'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  error: any;
  signupPage = SignupPage;
  resetPasswordPage = ResetPasswordPage;
  constructor(public navCtrl: NavController, private fb: FormBuilder, public auth: AuthProvider) {
    this.loginForm = this.fb.group({  
            'email': ['', Validators.compose([Validators.required, Validators.pattern(/[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
  
        this.email = this.loginForm.controls['email'];     
        this.password = this.loginForm.controls['password'];     
  }
 
  login(): void { 
        if(this.loginForm.valid) {
          console.log(this.email.value, this.password.value);
          //console.log(this.email.value, this.password.value);
          //alert('Implement authentication');
          var credentials = ({email: this.email.value, password: this.password.value}); //Added next lines
          this.auth.loginWithEmail(credentials).subscribe(data => {
            console.log(data)
          }, error=>{             //Added next lines for handling unknown users
          console.log(error);
          if (error.code == 'auth/user-not-found')
          {
            alert('User not found');
          }
          });
        }
    }
    logout(): void {
      this.auth.logout();
    }
}