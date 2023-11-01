import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading:boolean=false;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      CodigoUsuario: ['', [Validators.required]],
      ClaveUsuario: [''],
      Token: [''],
      PerfilUsuario: [''],
    });
  }
  onSubmit(){
    this.loading=true;
    this.loginService.authenticate(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res.response);
        localStorage.setItem('user', JSON.stringify(res.response));
        // Redirige al usuario a una ruta protegida.
        this.router.navigate(['ejecutivo']);
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }, 
    });
  }
  load(){

  }
}
