using System;

namespace TecLibrasApi.Domain.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Senha { get; set; }
        public string? IdGoogle { get; set; }
        public string? AvatarUrl { get; set; }
        public string Perfil { get; set; } = "USUARIO"; // 'USUARIO', 'INTÉRPRETE', 'ADM'
        public string? TokenRecuperacao { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.Now;
    }
}