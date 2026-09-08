using Microsoft.EntityFrameworkCore;
using TecLibrasApi.Infra;

var builder = WebApplication.CreateBuilder(args);

// Controllers da API
builder.Services.AddControllers();
// >>>Configuração do Swagger <<<
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<TecLibrasApi.Data.ISinalRepository, TecLibrasApi.Data.SinalRepository>();
// >>> 1. ADICIONAR A POLÍTICA DE CORS AQUI <<<
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontEnd", policy =>
    {
        policy.AllowAnyOrigin()  // Permite qualquer origem (seu HTML)
              .AllowAnyMethod()  // Permite GET, POST, PUT, DELETE
              .AllowAnyHeader(); // Permite qualquer cabeçalho
    });
});

// Conexão banco / serviços
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(
    builder.Configuration.GetConnectionString("DefaultConnection")
)));


var app = builder.Build();

// >>>Configuração do Swagger <<<
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware
// if (!app.Environment.IsDevelopment())
// {
//     app.UseExceptionHandler("/Home/Error");
//     app.UseHsts();
// }

// app.UseHttpsRedirection();

// Permitir acesso arquivos wwwroot
app.UseStaticFiles();

app.UseRouting();

// >>> 2. ATIVAR O CORS AQUI (Deve ficar EXATAMENTE entre o UseRouting e o UseAuthorization) <<<
app.UseCors("PermitirFrontEnd");

app.UseAuthorization();

// Mapear controllers API
app.MapControllers();

app.Run();