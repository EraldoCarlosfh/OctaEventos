import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AuthService } from '@app/services/auth.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  form!: FormGroup;
  UserUpdate = {} as UserUpdate;

  get f(): any {
    return this.form.controls;
  }

  constructor(public authService: AuthService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.validation();
    this.loadUser();
    this.loadForm();
  }

  private loadForm(): void {
    this.form.valueChanges.subscribe(() => this.changeFormValue.emit({ ...this.form.value }));
  }

  private validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };

    this.form = this.fb.group({
      userName: [''],
      imagemURL: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      descricao: ['', Validators.required],
      password: ['', [Validators.nullValidator, Validators.minLength(4)]],
      confirmePassword: ['', Validators.nullValidator],
    }, formOptions);
  }

  private loadUser(): void {
    this.spinner.show();
    this.authService.getUser().subscribe(
      (userUpdateRetorno) => {
        this.UserUpdate = userUpdateRetorno;
        localStorage.setItem('funcao',userUpdateRetorno.funcao );
        this.form.patchValue(this.UserUpdate);
        this.toastr.success('Usuário carregado com sucesso.', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error(`Usuário não carregado.`, 'Erro!');
        this.router.navigate(['/dashboard']);
        
      }
    ).add(() => this.spinner.hide());
  }

  public confirmSave(): void {
    this.UserUpdate = { ... this.form.value };
    this.spinner.show();

    if (this.f.funcao.value == 'Palestrante') {
      this.palestranteService.postPalestrante().subscribe(
        () => this.toastr.success('Função palestrante Ativada!', 'Sucesso!'),
        (error) => {
          this.toastr.error('A função palestrante não pode ser Ativada', 'Error');
          console.error("ERROR FUNCAO PALESTRANTE: ", error);
        }
      )
    }

    this.authService.updateUser(this.UserUpdate).subscribe(
      () => {
        this.toastr.success('Usuário atualizado com sucesso.', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error(`Usuário não atualizado.`, 'Erro!');
        this.router.navigate(['/dashboard']);
        
      }
    ).add(() => this.spinner.hide());
  }

  public clearForm(): void {
    this.form.reset();
    this.toastr.warning('Formulário resetado.', 'Redefinir informações!');
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

}
