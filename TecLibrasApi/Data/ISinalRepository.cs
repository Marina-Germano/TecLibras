using System.Collections.Generic;
using System.Threading.Tasks;
using TecLibrasApi.DTOs;

namespace TecLibrasApi.Data
{
    public interface ISinalRepository
    {
        Task<IEnumerable<SinalResponseDto>> ObterTodosAsync();
        Task<SinalResponseDto?> ObterPorIdAsync(int id);
        Task<int> AdicionarAsync(SalvarSinalDto dto);
        Task<bool> AtualizarAsync(int id, SalvarSinalDto dto);
        Task<bool> ExcluirAsync(int id);
    }
}