import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  today: string = '';
  user = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.time();
    this.userName();
    var data = new Date();
        var day = data.getDate();
        var month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][data.getMonth()];
        var year = data.getFullYear();

        this.today =  day + ' de ' + month + ' de ' + year;
  }

  showMenu(): boolean {
    return (
      // this.router.url != '/usuario/login' && 
      // this.router.url != '/usuario/cadastro' &&
      this.router.url != '/paginanaoencontrada'
    );
  }

  userName() {    
    var name = localStorage.getItem('token'); 
    var objeto = JSON.parse(name!); 
    
    if (objeto.userName != null) {
      this.user = true;
    }    
    return objeto.userName;
  }

  logout(): void {
    localStorage.removeItem('token');   
    localStorage.removeItem('funcao'); 
    this.toastr.show('Seu acesso foi encerrado', 'Log-Out!');
    this.router.navigate(['/usuario/login']);
    window.location.reload()
  }

  time() {
    var dataAtual = new Date();
    var dia = dataAtual.getDate() + '-' + ( dataAtual.getMonth() + 1 ) + '-' + dataAtual.getFullYear();
    var hora = dataAtual.getHours() + ':' + dataAtual.getMinutes() + ':' + dataAtual.getSeconds();
    this.today = dia + ' ' + hora;
  }
}
