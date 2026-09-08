using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TecLibrasApi.Domain.Models
{
    [Table("categorias")]
    public class Categoria
    {
        [Key]
        [Column("id_categoria")]
        public int IdCategoria { get; set; }

        [Required]
        [Column("nome_categoria")] // Ajuste caso no seu SQL o nome da coluna seja diferente (ex: apenas "nome")
        public string NomeCategoria { get; set; } = string.Empty;
    }
}