import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../../_models/User';
import { AuthService } from '../../_service/auth.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  user: User;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required , Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.matchPassword })
      ,
    })
  }
   usernameValidator(fb: FormGroup) {
     const userName = fb.get('userName');
     if (userName.value.indexOf(' ') >= 0){
        userName.setErrors({ usernameValidator: true });
      }
      else{
        userName.setErrors({ usernameValidator: false });
      }
   }

   matchPassword(fb: FormGroup) {
    const confirmSenhaCtrl = fb.get('confirmPassword')
    if (confirmSenhaCtrl.errors === null || 'mismatch' in confirmSenhaCtrl.errors) {
      if (fb.get('password').value !== confirmSenhaCtrl.value) {
        confirmSenhaCtrl.setErrors({ mismatch: true });
      } else {
        confirmSenhaCtrl.setErrors(null);
      }
    }
  }
    registerUser() {
      if (this.registerForm.valid) {
      this.user = Object.assign(
        { password: this.registerForm.get('passwords.password').value },
        this.registerForm.value
      )
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login'])
          this.toastr.success('Cadastro Realizado')
        },
        response => {
          response.error.forEach(err => {
            switch (err.code) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro duplicado')
                break;
              case 'InvalidUserName':
                this.toastr.error('Usuário inválido');
                break;
              default:
                this.toastr.error(`Erro no cadastro! CODE: ${err.code}`)
                break;
            }
          });
        }
      );
    }
  }
}