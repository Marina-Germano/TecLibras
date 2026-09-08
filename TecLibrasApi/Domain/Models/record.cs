namespace TecLibrasApi.Domain.Models
{
    // O tipo 'record' já cria as propriedades e construtores automaticamente no C# 9+
    public record Midia(string Url, string Formato, long Tamanho);
}