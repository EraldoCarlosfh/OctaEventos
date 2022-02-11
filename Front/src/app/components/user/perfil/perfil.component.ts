import { Component, OnInit } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AuthService } from '@app/services/auth.service';
import { RedeSocialService } from '@app/services/redeSocial.service';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public usuario = {} as UserUpdate;
  public file!: File;
  public eventoId = 0;
  public imagemURL = 'assets/img/perfil.png';
  public redeSocial: any;
 
  public get ehPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,              
              private redeSocialService: RedeSocialService,
              private authService: AuthService) { }

  ngOnInit() {
    this.carregarRedesSociais(this.eventoId)   
  }

  private carregarRedesSociais(id: number): void {
    var funcao = localStorage.getItem('funcao');

    if(funcao == 'Palestrante') {
      this.spinner.show();

      this.redeSocialService
        .getRedesSociais(funcao, id)
        .subscribe(
          (redeSocialRetorno: RedeSocial[]) => {
            this.redeSocial = redeSocialRetorno;
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar carregar Rede Social', 'Erro');
            
          }
        ).add(() => this.spinner.hide());
    }
  }

  public retornaTituloRedeSocial(nome: string): string {
    return nome === null || nome === '' ? 'Nome da Rede Social' : nome.replace('fab fa-', '');
  }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if (this.usuario.imagemURL != null)
    this.imagemURL = `${environment.api}resources/perfil/` + this.usuario.imagemURL;
    else
    this.imagemURL;
  }

  public onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.authService.postUpload(this.file).subscribe(
      () => {        
        this.toastr.success('Imagem atualizada com sucesso.', 'Sucesso!');
        window.location.reload();
      },
      (error: any) => {
        this.toastr.error(`Erro ao fazer upload de imagem`, 'Erro!');
        
      }
    ).add(() => this.spinner.hide());
  }

}
