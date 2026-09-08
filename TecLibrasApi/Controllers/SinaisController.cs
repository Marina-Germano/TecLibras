using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TecLibrasApi.Data;
using TecLibrasApi.DTOs;

namespace TecLibrasApi.Controllers // Ajuste para o namespace do seu projeto
{
    [ApiController]
    [Route("api/[controller]")] // A URL ficará: /api/sinais
    public class SinaisController : ControllerBase
    {
        private readonly ISinalRepository _repository;

        // Injeção de dependência do repositório
        public SinaisController(ISinalRepository repository)
        {
            _repository = repository;
        }

        // ==========================================
        // 1. GET: api/sinais (Buscar todos)
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SinalResponseDto>>> GetTodos()
        {
            var sinais = await _repository.ObterTodosAsync();
            return Ok(sinais); // Retorna 200 OK com a lista de sinais
        }

        // ==========================================
        // 2. GET: api/sinais/{id} (Buscar por ID)
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<SinalResponseDto>> GetPorId(int id)
        {
            var sinal = await _repository.ObterPorIdAsync(id);
            
            if (sinal == null)
            {
                return NotFound(new { mensagem = "Sinal não encontrado." }); // Retorna 404 Not Found
            }

            return Ok(sinal); // Retorna 200 OK com o sinal
        }

        // ==========================================
        // 3. POST: api/sinais (Cadastrar)
        // ==========================================
        [HttpPost]
        public async Task<ActionResult> Cadastrar([FromForm] SalvarSinalDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna 400 Bad Request se faltar vídeo, imagem, etc.
            }

            var idGerado = await _repository.AdicionarAsync(dto);
            
            // Retorna 201 Created apontando para a rota de GET do item criado
            return CreatedAtAction(nameof(GetPorId), new { id = idGerado }, new { id = idGerado, mensagem = "Sinal cadastrado com sucesso!" });
        }

        // ==========================================
        // 4. PUT: api/sinais/{id} (Atualizar)
        // ==========================================
        [HttpPut("{id}")]
        public async Task<ActionResult> Atualizar(int id, [FromForm] SalvarSinalDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var atualizado = await _repository.AtualizarAsync(id, dto);

            if (!atualizado)
            {
                return NotFound(new { mensagem = "Sinal não encontrado para atualização." });
            }

            return NoContent(); // Retorna 204 No Content (sucesso sem corpo de resposta)
        }

         // ==========================================
        // 5. DELETE: api/sinais/{id} (Excluir)
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<ActionResult> Excluir(int id)
        {
            var excluido = await _repository.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound(new { mensagem = "Sinal não encontrado para exclusão." });
            }

            return NoContent(); // Retorna 204 No Content
        }
    }
}