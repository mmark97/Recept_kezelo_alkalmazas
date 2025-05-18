import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewUser, User } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pass1: new FormControl('', [Validators.required, Validators.minLength(6)]),
    pass2: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  signupError = '';

  register() {
    if (this.signUpForm.invalid) {
      console.log('Invalid form');
      return;
    } else {
      if (this.signUpForm.value.pass1 !== this.signUpForm.value.pass2) {
        return;
      }

      const user: NewUser = {
        firstName: this.signUpForm.get('firstname')?.value ?? '',
        lastName: this.signUpForm.get('lastname')?.value ?? '',
        email: this.signUpForm.get('email')?.value ?? '',
      };

      this.authService
        .signUp(user.email, this.signUpForm.get('pass1')?.value ?? '', user)
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((error) => console.error(error));
    }
  }
}
