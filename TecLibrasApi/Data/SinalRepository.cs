using Microsoft.EntityFrameworkCore;
using TecLibrasApi.Domain.Models;
using TecLibrasApi.DTOs;
using TecLibrasApi.Infra;

namespace TecLibrasApi.Data
{
    public class SinalRepository : ISinalRepository
    {
        private readonly AppDbContext _context;

        public SinalRepository(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // BUSCAR TODOS (GET)
        // ==========================================
        public async Task<IEnumerable<SinalResponseDto>> ObterTodosAsync()
        {
            return await _context.Sinal
                .Select(s => new SinalResponseDto
                {
                    Id = s.Id,
                    TermoTi = s.TermoTi,
                    DescricaoSinal = s.DescricaoSinal,
                    IdInterprete = s.IdInterprete,
                    NomeInterprete = s.Interprete != null ? s.Interprete.Nome : null,
                    DataPublicacao = s.DataPublicacao,
                    Video = new MidiaDto { Url = s.Video.Url, Formato = s.Video.Formato, Tamanho = s.Video.Tamanho },
                    Imagem = new MidiaDto { Url = s.Imagem.Url, Formato = s.Imagem.Formato, Tamanho = s.Imagem.Tamanho },
                    ImagemSecundaria = s.ImagemSecundaria != null 
                        ? new MidiaDto { Url = s.ImagemSecundaria.Url, Formato = s.ImagemSecundaria.Formato, Tamanho = s.ImagemSecundaria.Tamanho } 
                        : null
                })
                .ToListAsync();
        }

        // ==========================================
        // BUSCAR POR ID (GET)
        // ==========================================
        public async Task<SinalResponseDto?> ObterPorIdAsync(int id)
        {
            return await _context.Sinal
                .Where(s => s.Id == id)
                .Select(s => new SinalResponseDto
                {
                    Id = s.Id,
                    TermoTi = s.TermoTi,
                    DescricaoSinal = s.DescricaoSinal,
                    IdInterprete = s.IdInterprete,
                    NomeInterprete = s.Interprete != null ? s.Interprete.Nome : null,
                    DataPublicacao = s.DataPublicacao,
                    Video = new MidiaDto { Url = s.Video.Url, Formato = s.Video.Formato, Tamanho = s.Video.Tamanho },
                    Imagem = new MidiaDto { Url = s.Imagem.Url, Formato = s.Imagem.Formato, Tamanho = s.Imagem.Tamanho },
                    ImagemSecundaria = s.ImagemSecundaria != null 
                        ? new MidiaDto { Url = s.ImagemSecundaria.Url, Formato = s.ImagemSecundaria.Formato, Tamanho = s.ImagemSecundaria.Tamanho } 
                        : null
                })
                .FirstOrDefaultAsync();
        }

        // ==========================================
        // ADICIONAR (POST)
        // ==========================================
        public async Task<int> AdicionarAsync(SalvarSinalDto dto)
        {
            if (dto.ImagemArquivo == null || dto.ImagemArquivo.Length == 0)
            {
                throw new ArgumentException("A imagem principal é obrigatória.");
            }
            string pastaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img");
            if (!Directory.Exists(pastaDestino)) Directory.CreateDirectory(pastaDestino);

            // 1. Processar a imagem principal do Desktop
            string nomeArquivoImg1 = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImagemArquivo.FileName);
            string caminhoImg1 = Path.Combine(pastaDestino, nomeArquivoImg1);
            using (var stream = new FileStream(caminhoImg1, FileMode.Create))
            {
                await dto.ImagemArquivo.CopyToAsync(stream);
            }
            var imagem = new Midia($"img/{nomeArquivoImg1}", Path.GetExtension(dto.ImagemArquivo.FileName), dto.ImagemArquivo.Length);

            // 2. Processar a imagem secundária (Opcional)
            Midia? imagemSecundaria = null;
            if (dto.ImagemSecundaria != null && dto.ImagemSecundaria.Length > 0)
            {
                string nomeArquivoImg2 = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImagemSecundaria.FileName);
                string caminhoImg2 = Path.Combine(pastaDestino, nomeArquivoImg2);
                
                using (var stream = new FileStream(caminhoImg2, FileMode.Create))
                {
                    await dto.ImagemSecundaria.CopyToAsync(stream);
                }
                
                imagemSecundaria = new Midia($"img/{nomeArquivoImg2}", Path.GetExtension(dto.ImagemSecundaria.FileName), dto.ImagemSecundaria .Length);
            }

            // 3. Vídeo do YouTube
            string videoEmbedUrl = ConverterParaYouTubeEmbed(dto.VideoUrl);
            var video = new Midia(videoEmbedUrl, "youtube", 0);

            var novoSinal = new Sinal(dto.TermoTi, dto.DescricaoSinal, dto.IdInterprete, video, imagem, imagemSecundaria);

            _context.Sinal.Add(novoSinal);
            await _context.SaveChangesAsync();

            return novoSinal.Id;
        }

        // ==========================================
        // ATUALIZAR (PUT)
        // ==========================================
        public async Task<bool> AtualizarAsync(int id, SalvarSinalDto dto)
        {
            var sinal = await _context.Sinal.FirstOrDefaultAsync(s => s.Id == id);
            if (sinal == null) return false;

            string pastaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img");
            if (!Directory.Exists(pastaDestino)) Directory.CreateDirectory(pastaDestino);

            // Atualiza o Vídeo do YouTube
            string videoEmbedUrl = ConverterParaYouTubeEmbed(dto.VideoUrl);
            var video = new Midia(videoEmbedUrl, "youtube", 0);

            // Se enviou uma nova imagem principal, substitui. Caso contrário, mantém a atual.
            Midia imagem = sinal.Imagem;
            if (dto.ImagemArquivo != null && dto.ImagemArquivo.Length > 0)
            {
                // Apaga o arquivo físico antigo se existir
                if (!string.IsNullOrEmpty(sinal.Imagem.Url))
                {
                    string caminhoAntigo = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", sinal.Imagem.Url.Replace("img/", ""));
                    if (File.Exists(caminhoAntigo)) File.Delete(caminhoAntigo);
                }
                string nomeArquivoImg1 = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImagemArquivo.FileName);
                string caminhoImg1 = Path.Combine(pastaDestino, nomeArquivoImg1);
                using (var stream = new FileStream(caminhoImg1, FileMode.Create))
                {
                    await dto.ImagemArquivo.CopyToAsync(stream);
                }
                imagem = new Midia($"img/{nomeArquivoImg1}", Path.GetExtension(dto.ImagemArquivo.FileName), dto.ImagemArquivo.Length);
            }

            // Se enviou uma nova imagem secundária, substitui. Caso contrário, mantém a atual.
            Midia? imagemSecundaria = sinal.ImagemSecundaria;
            if (dto.ImagemSecundaria != null && dto.ImagemSecundaria.Length > 0)
            {
                if (sinal.ImagemSecundaria != null && !string.IsNullOrEmpty(sinal.ImagemSecundaria.Url))
                {
                    string caminhoAntigoSec = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", sinal.ImagemSecundaria.Url.Replace("img/", ""));
                    if (File.Exists(caminhoAntigoSec)) File.Delete(caminhoAntigoSec);
                }
                string nomeArquivoImg2 = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImagemSecundaria.FileName);
                string caminhoImg2 = Path.Combine(pastaDestino, nomeArquivoImg2);
                using (var stream = new FileStream(caminhoImg2, FileMode.Create))
                {
                    await dto.ImagemSecundaria.CopyToAsync(stream);
                }
                imagemSecundaria = new Midia($"img/{nomeArquivoImg2}", Path.GetExtension(dto.ImagemSecundaria.FileName), dto.ImagemSecundaria.Length);
            }

            // Atualiza na entidade
            sinal.Atualizar(dto.TermoTi, dto.DescricaoSinal, dto.IdInterprete, video, imagem, imagemSecundaria);

            await _context.SaveChangesAsync();
            return true;
        }

        // ==========================================
        // EXCLUIR (DELETE)
        // ==========================================
        public async Task<bool> ExcluirAsync(int id)
        {
            var sinal = await _context.Sinal.FirstOrDefaultAsync(s => s.Id == id);
            if (sinal == null) return false;

            _context.Sinal.Remove(sinal);
            await _context.SaveChangesAsync();
            return true;
        }

        // ==========================================
        // MÉTODO AUXILIAR: YouTube Embed
        // ==========================================
        private string ConverterParaYouTubeEmbed(string url)
        {
            if (string.IsNullOrEmpty(url)) return url;

            if (url.Contains("watch?v="))
            {
                return url.Replace("watch?v=", "embed/");
            }
            else if (url.Contains("youtu.be/"))
            {
                return url.Replace("youtu.be/", "www.youtube.com/embed/");
            }
            return url;
        }
    }
}