import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from '@app/models/Identity/UserLogin';
import { AuthService } from '@app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model = {} as UserLogin;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    var token = localStorage.getItem('token'); 
    var tokenObj = JSON.parse(token!);

    if (tokenObj.token != null) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.authService.login(this.model).subscribe(
      () => { this.router.navigate(['/dashboard']);
        this.toastr.success('Login efetuado com sucesso.','Sucesso!'); 
        window.location.reload();      
     },
      (error: any) => {
        if (error.status == 401) {
          this.toastr.error(`Falha ao efetuar login.`, 'Erro!');
        } else{
          
        }
     }
    )
  }

}
