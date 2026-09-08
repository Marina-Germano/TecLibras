using System;

namespace TecLibrasApi.DTOs
{
    public class SinalResponseDto
    {
        public int Id { get; set; }
        public string TermoTi { get; set; } = string.Empty;
        public string? DescricaoSinal { get; set; }
        
        // Enviamos o ID caso o frontend precise (por exemplo, para pré-selecionar no dropdown ao editar)
        public int? IdInterprete { get; set; } 
        
        // Enviamos o NOME para exibir na tabela/lista para o usuário final
        public string? NomeInterprete { get; set; } 
        
        public DateTime DataPublicacao { get; set; }

        public MidiaDto Video { get; set; } = null!;
        public MidiaDto Imagem { get; set; } = null!;
        public MidiaDto? ImagemSecundaria { get; set; }
    }
}