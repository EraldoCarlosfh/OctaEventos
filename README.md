# OctaEventos - Projeto Anuglar + .NET Core 3.1

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version  13.1.2

## Processos para rodar Aplicação

### **Backend** 

Após efetuar o Clone do Projeto pelo git, acesse a pasta do Projeto **OctaEventos/Back/src**  você encontrará um arquivo chamado **OctaEventos.sln**, está e solução do projeto de um duplo clique e será iniciado o Projeto no Visual Studio, feito isto espanda **OctaEventos.API**, altere os arquivos **appsettings.Development.json** e **appsettings.json** altere o Password do **ConnectionStrings** a senha atual é **Cadalu2022#**, apague e coloque a senha do seu Banco de Dados, lembrando que o Projeto está utilizando o Banco de Dados Postgres. Verifique também as configurações de **Port=5432** e **User Id=postgres** se forem os mesmo do seu banco deixe como está senão altere.

Após alterar a senha para a senha do seu Banco de Dados Postgres vá em **Exibir** => **Outras Janelas** => **Console do Gerenciador de Pacotes**, digite o comando **update-database**, se sua senha estiver correta após este procedimento será criado o banco e as tabelas que constam na Migration.

Finalizado estes processos defina **OctaEventos.API** como **Projeto de Inicialização** e pronto, pode Iniciar a Depuração do Projeto.

### **Frontend**

Após efetuar o Clone do Projeto pelo git, acesse a pasta do Projeto e inicie o diretório **OctaEventos/Front** no visual code, feito isto digite o comando **npm install** ou **npm i** para baixar as bibliotecas e dependências do projeto que se encontraram na pasta node_modules, finalizado este processo inicie a aplicação com o comando **ng serve** ou **ng s**.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io/).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).