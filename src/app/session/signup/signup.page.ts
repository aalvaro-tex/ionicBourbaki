import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar, LoadingController, IonAlert } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, atCircleOutline, atOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import {  } from '@angular/fire/app';
import {  } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.prod';
import { } from '@firebase/auth';
import { inject, Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Auth } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonAlert, IonFab,
    IonIcon,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    RouterLink,
    IonFabButton,
    ReactiveFormsModule]
})
export class SignupPage implements OnInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);

  title = 'Crea tu cuenta';
  isAlertOpen = false;
  alertButtons = ['Cerrar'];

  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private route: Router
  ) {
    addIcons({ personOutline, atOutline, lockClosedOutline, arrowForwardOutline });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  singUp() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value as User;
      if (user.email && user.password) {
        createUserWithEmailAndPassword(this.auth, user.email, user.password).then(() => {
          if (this.auth.currentUser) {
            updateProfile(this.auth.currentUser, {
              displayName: user.name
            }).then(() => {
              console.log('User registered');
              this.route.navigate(['./tabs/home']);
            }).catch((error) => {
              console.log(error);
            });
          } else {
            console.log('Email or password is undefined');
          }
        }).catch((error) => {
          // El usuario ya existe
          this.isAlertOpen = true;
          console.log(error);
        });
      } else {
        console.log('Email or password is undefined');
      }
    }
  }

  setOpen(set: boolean) {
    this.isAlertOpen = set;
  }


  private buildForm() {
    this.registerForm = new FormGroup({
      name: new FormControl<string>('', [Validators.required]),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    });
  }

}