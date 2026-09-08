using System.ComponentModel.DataAnnotations.Schema;

namespace TecLibrasApi.Domain.Models
{
    [Table("sinal_categoria")]
    public class SinalCategoria
    {
        [Column("id_sinal")]
        public int IdSinal { get; set; }

        [Column("id_categoria")]
        public int IdCategoria { get; set; }
    }
}