import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/Identity/User';
import { AuthService } from '@app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  form!: FormGroup;
  user = {} as User;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword'),
    };

    this.form = this.fb.group(
      {
        primeiroNome: ['', [Validators.required]],
        ultimoNome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
      },
      formOptions
    );
  }

  confirmSave(): void {
   this.spinner.show();
    if (this.form.valid) {
      this.user = { ...this.form.value,
        password: this.form.get('password')!.value };

      this.authService.register(this.user).subscribe(
        () => {
           this.router.navigate(['/dashboard']);
           this.toastr.success('Cadastro efetuado com sucesso.','Salvando Cadastro!');
        },
         (error: any) => {
          const erro = error.error;
          erro.forEach((element: any) => {
            switch (element.code) {
              case 'DuplicateUserName':
                  this.toastr.error(`Cadastro duplicado.`, 'Erro!');
                break;
                default:
                 this.toastr.error(`Erro no Cadastro: CODE: ${element.code}`, 'Erro!');
                break;
              }
          });
        }
      ).add(() => this.spinner.hide());
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  public clearForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }
}
