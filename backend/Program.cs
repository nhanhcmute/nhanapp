using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Repositories.Implementations;
using ECommerceAI.Services.Interfaces;
using ECommerceAI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Memory Cache cho OTP
builder.Services.AddMemoryCache();

// Add MongoDB context
builder.Services.AddSingleton<MongoContext>();

// Add Repositories
builder.Services.AddScoped<ICatRepo, CatRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IProductRepo, ProductRepo>();
builder.Services.AddScoped<IOTPRepo, OTPRepo>();

// Add Services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<IOTPCacheService, OTPCacheService>();

// Configure CORS
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Run the app on the port assigned by Render (or default 5000)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();
