import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  signInForm = this.fb.group({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required])
  });
  errors: string | undefined;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.adminService.accessToken && this.adminService.accessToken !== 'undefined') {
      this.router.navigate(['/']);
    }
  }

  protected login() {
    
    this.errors = '';
    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      const payload = {
        username: username || '',
        password: password || '',
      }
      this.adminService.signIn(payload).subscribe({
        next: (res) => {
          if (res.success)
            this.router.navigate(['/auth/dashboard']);
        },
        error: (e: Error) => {
          this.errors = 'Username or password incorrect. Please try again!';
          console.log(e);
        }
      })
    }
  }

}
