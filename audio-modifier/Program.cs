using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

var builder = WebApplication.CreateBuilder(args);

IConfiguration configuration = builder.Configuration;
IWebHostEnvironment environment = builder.Environment;

// Add services to the container.

builder.Services.AddControllers();

// Configure frontend built path
builder.Services.AddSpaStaticFiles(configuration => {
    configuration.RootPath = "ClientApp/" + builder.Configuration.GetValue<string>("Client:BuildFolder");
});

CorsPolicy corsPolicy = new CorsPolicyBuilder()
    .WithOrigins(new[] { "http://localhost:3333" })
    .AllowAnyHeader()
    .AllowCredentials()
    .AllowAnyMethod()
    .Build();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDev", corsPolicy);
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();

