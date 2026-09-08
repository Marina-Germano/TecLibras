using System.ComponentModel.DataAnnotations;

namespace TecLibrasApi.DTOs
{
    public class SalvarSinalDto
    {
        [Required(ErrorMessage = "O termo é obrigatório.")]
        [StringLength(100, ErrorMessage = "O termo deve ter no máximo 100 caracteres.")]
        public string TermoTi { get; set; } = string.Empty;

        public string? DescricaoSinal { get; set; }
        
        // Aqui o frontend manda apenas o ID selecionado no combo-box (select)
        public int? IdInterprete { get; set; } 

        [Required(ErrorMessage = "O vídeo é obrigatório.")]
        public string VideoUrl { get; set; } = string.Empty;

        // Imagem principal vem como arquivo físico do Desktop
        //[(ErrorMessage = "A imagem principal é obrigatória.")]
        public IFormFile? ImagemArquivo { get; set; }

        // Opcional
        public IFormFile? ImagemSecundaria { get; set; } 
    }
}