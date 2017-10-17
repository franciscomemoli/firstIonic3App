import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';

import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { auth } from 'firebase'; 

@Injectable()
export class AuthProvider {
     
  constructor(private af: AngularFireAuth, private fb: Facebook ,private platform: Platform, private googlePlus: GooglePlus) {
  }
  signInWithFacebook() {
    return Observable.create(observer => {
      this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.af.auth.signInWithCredential(facebookCredential);
        observer.next(facebookCredential);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
  loginWithGoogle() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
       return this.googlePlus.login({
          'webClientId':'*********************'
        }).then(userData => {
          var token = userData.idToken;
          const googleCredential = auth.GoogleAuthProvider.credential(token, null);
          firebase.auth().signInWithCredential(googleCredential).then((success)=>{
            observer.next(success);
          }).catch(error => {
            //console.log(error);
            observer.error(error);
          });
        }).catch(error => {
            //console.log(error);
            observer.error(error);
        });
      }
      // else {
      //  console.log()
      //  return this.af.auth.login({
      //    provider: AuthProviders.GooglePlus,
      //    method: AuthMethods.Popup
      //    }).then(()=>{
      //      observer.next();
      //    }).catch(error => {
      //      //console.log(error);
      //      observer.error(error);
      //  });
      //}
    });
  }
  loginWithEmail(credentials) {
    return Observable.create(observer => {
      this.af.auth.signInWithEmailAndPassword(credentials.email, credentials.password
      ).then((authData) => {
        //console.log(authData);
        observer.next(authData);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
 
  registerUser(credentials: any) {
    return Observable.create(observer => {
      this.af.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(authData => {
        //this.af.auth.currentUser.updateProfile({displayName: credentials.displayName, photoURL: credentials.photoUrl}); //set name and photo
        observer.next(authData);
      }).catch(error => {
        //console.log(error);
        observer.error(error);
      });
    });
  }
   
  resetPassword(emailAddress:string){
    return Observable.create(observer => {
      this.af.auth.sendPasswordResetEmail(emailAddress).then(function(success) {
          //console.log('email sent', success);
          observer.next(success);
        }, function(error) {
          //console.log('error sending email',error);
          observer.error(error);
        });
     });
  } 
  logout() {
    this.af.auth.signOut();
  }
 
  get currentUser():string{
    return this.af.auth.currentUser?this.af.auth.currentUser.email:null;
  } 
}