namespace TecLibrasApi.DTOs
{
    public class MidiaDto
    {
        public string Url { get; set; } = string.Empty;
        public string? Formato { get; set; }
        public long Tamanho { get; set; }
    }
}