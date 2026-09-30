using M.API;
using M.API.Middleware;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// File báo cáo tối đa 20MB (upload ảnh vẫn được giới hạn riêng trong API chấm công).
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 21 * 1024 * 1024;
});

var jwtKey = builder.Configuration["JwtSettings:Key"]
    ?? throw new InvalidOperationException("JWT Key not found");

builder.Services.AddEndpointsApiExplorer();

// Add all services to this
builder.Services.AddConfig(builder.Configuration);


var app = builder.Build();

await M.API.Seed.RoleSeeder.SeedAsync(app.Services);

//Catch error
//app.UseDeveloperExceptionPage();
app.UseMiddleware<ExceptionMiddleware>();
app.UseStaticFiles();
    

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("ReactPolicy");

// Ảnh chấm công đã upload -> /uploads (lưu trong wwwroot/uploads, ổn định)
var uploadDir = PhotoStore.GetRoot(app.Environment);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadDir),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
