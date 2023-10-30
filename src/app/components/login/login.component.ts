import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading:boolean=false;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
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
        console.log(res);
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
