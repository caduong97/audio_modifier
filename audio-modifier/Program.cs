using audio_modifier.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

var builder = WebApplication.CreateBuilder(args);

IConfiguration configuration = builder.Configuration;
IWebHostEnvironment environment = builder.Environment;

// Add services to the container.


// Configure frontend built path
builder.Services.AddSpaStaticFiles(configuration => {
    configuration.RootPath = "ClientApp/" + builder.Configuration.GetValue<string>("Client:BuildFolder");
});

CorsPolicy corsPolicy = new CorsPolicyBuilder()
    .WithOrigins(new[] { "https://localhost:3333" })
    .AllowAnyHeader()
    .AllowCredentials()
    .AllowAnyMethod()
    .WithExposedHeaders("Content-Disposition")
    .Build();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDev", corsPolicy);
});

builder.Services.AddControllers();


builder.Services.AddScoped<IAudioBasicService, AudioBasicService>();
builder.Services.AddScoped<IMergeService, MergeService>();
builder.Services.AddScoped<ITrimService, TrimService>();
builder.Services.AddScoped<IChannelService, ChannelService>();

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

app.UseCors("AllowDev");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();

