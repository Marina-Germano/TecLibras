using Microsoft.EntityFrameworkCore;
using TecLibrasApi.Domain.Models;

namespace TecLibrasApi.Infra
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Mapeamento das tabelas ativas do MVP
        public DbSet<Sinal> Sinal { get; set; }
        public DbSet<Usuario> Usuarios { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==========================================
            // MAPEAMENTO DA TABELA: usuario
            // ==========================================
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuario");
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id).HasColumnName("id_usuario");
                entity.Property(e => e.Nome).HasColumnName("nome").IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").IsRequired();
                entity.Property(e => e.Senha).HasColumnName("senha");
                entity.Property(e => e.IdGoogle).HasColumnName("id_google");
                entity.Property(e => e.AvatarUrl).HasColumnName("avatar_url");
                entity.Property(e => e.Perfil).HasColumnName("perfil").HasDefaultValue("USUARIO");
                entity.Property(e => e.TokenRecuperacao).HasColumnName("token_recuperacao");
                entity.Property(e => e.DataCriacao).HasColumnName("data_criacao");
            });

            // ==========================================
            // MAPEAMENTO DA TABELA: sinal (SINGULAR)
            // ==========================================
            modelBuilder.Entity<Sinal>(entity =>
            {
                // Ajustado para o nome exato da tabela no banco
                entity.ToTable("sinal");
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id).HasColumnName("id_sinal");
                entity.Property(e => e.TermoTi).HasColumnName("termo_ti").IsRequired();
                entity.Property(e => e.DescricaoSinal).HasColumnName("descricao_sinal");
                entity.Property(e => e.IdInterprete).HasColumnName("id_interprete");
                entity.Property(e => e.DataPublicacao).HasColumnName("data_publicacao");

                // Relacionamento (Chave Estrangeira do Intérprete apontando para 'usuario')
                entity.HasOne(s => s.Interprete)
                      .WithMany()
                      .HasForeignKey(s => s.IdInterprete)
                      .HasConstraintName("fk_interprete");

                // Mídia: Vídeo (Obrigatório)
                entity.OwnsOne(s => s.Video, v =>
                {
                    v.Property(p => p.Url).HasColumnName("video_url").IsRequired();
                    v.Property(p => p.Formato).HasColumnName("video_formato");
                    v.Property(p => p.Tamanho).HasColumnName("video_tamanho");
                });

                // Mídia: Imagem Principal (Obrigatória)
                entity.OwnsOne(s => s.Imagem, i =>
                {
                    i.Property(p => p.Url).HasColumnName("imagem_url").IsRequired();
                    i.Property(p => p.Formato).HasColumnName("imagem_formato");
                    i.Property(p => p.Tamanho).HasColumnName("imagem_tamanho");
                });

                // Mídia: Imagem Secundária (Opcional)
                entity.OwnsOne(s => s.ImagemSecundaria, sec =>
                {
                    sec.Property(p => p.Url).HasColumnName("imagem_secundaria_url");
                    sec.Property(p => p.Formato).HasColumnName("imagem_secundaria_formato");
                    sec.Property(p => p.Tamanho).HasColumnName("imagem_secundaria_tamanho");
                });
            });
        }
    }
}