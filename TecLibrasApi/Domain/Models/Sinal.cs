using System;


namespace TecLibrasApi.Domain.Models
{
    public class Sinal
    {
        public int Id { get; private set; }
        public string TermoTi { get; private set; } = string.Empty;
        public string? DescricaoSinal { get; private set; }
        public int? IdInterprete { get; private set; }
        public DateTime DataPublicacao { get; private set; }

        // Propriedade de Navegação (Para o Entity Framework buscar o Nome depois)
        public virtual Usuario? Interprete { get; private set; }

        // Mídias - Value Objects
        public Midia Video { get; private set; } = null!;
        public Midia Imagem { get; private set; } = null!;
        public Midia? ImagemSecundaria { get; private set; }

        // Construtor vazio exigido pelo Entity Framework Core
        protected Sinal() { }

        // Construtor que usamos na API para criar um Sinal válido
        public Sinal(string termoTi, string? descricaoSinal, int? idInterprete, Midia video, Midia imagem, Midia? imagemSecundaria = null)
        {
            TermoTi = string.IsNullOrWhiteSpace(termoTi) ? throw new ArgumentException("Termo TI é obrigatório.") : termoTi;
            DescricaoSinal = descricaoSinal;
            IdInterprete = idInterprete;
            DataPublicacao = DateTime.Now;

            Video = video ?? throw new ArgumentNullException(nameof(video), "Vídeo é obrigatório.");
            Imagem = imagem ?? throw new ArgumentNullException(nameof(imagem), "Imagem principal é obrigatória.");
            ImagemSecundaria = imagemSecundaria;
        }

        // Método para atualizar os dados do sinal futuramente
        public void Atualizar(string termoTi, string? descricaoSinal, int? idInterprete, Midia video, Midia imagem, Midia? imagemSecundaria = null)
        {
            TermoTi = string.IsNullOrWhiteSpace(termoTi) ? throw new ArgumentException("Termo TI é obrigatório.") : termoTi;
            DescricaoSinal = descricaoSinal;
            IdInterprete = idInterprete;
            
            Video = video ?? throw new ArgumentNullException(nameof(video), "Vídeo é obrigatório.");
            Imagem = imagem ?? throw new ArgumentNullException(nameof(imagem), "Imagem principal é obrigatória.");
            ImagemSecundaria = imagemSecundaria;
        }
    }
}