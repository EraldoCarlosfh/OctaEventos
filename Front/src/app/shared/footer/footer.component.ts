import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  showMenu(): boolean {
    return (
      this.router.url != '/usuario/login' &&
      this.router.url != '/usuario/cadastro' &&
      this.router.url != '/usuario' &&
      this.router.url != '/paginanaoencontrada'
    );
  }

}
