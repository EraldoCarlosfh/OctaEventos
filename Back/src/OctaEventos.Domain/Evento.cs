using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OctaEventos.Domain.Identity;

namespace OctaEventos.Domain
{

    public class Evento
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }
        public string Tema { get; set; }
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }        
        // public int UserId { get; set; }  Opcional já e adicionado o UserId por heranca
        public User User { get; set; }
        public IEnumerable<Lote> Lotes { get; set; }
        public IEnumerable<RedeSocial> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}

//DataType Annotations
//[Table("Festas")] alterar o nome da tabela na cria��o do banco = data annotations
//[Key] Chave prim�ria = data annotations
//[ForeignKey("Festas")] Chave estrangeira referenciando a tabela onde Id seria chave prim�ria = data annotations
//[Required] campo obrigat�rio no banco = data annotations
//[NotMapped] campo n�o ser� mapeado ou criado no banco de dados = data annotations
//[MaxLength(50)] especificar tamanho m�ximo = data annotations
//[MinLength(50)] especificar tamanho min�mo = data annotations