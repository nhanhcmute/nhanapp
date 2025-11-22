using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Repositories.Implementations;
using ECommerceAI.Services.Interfaces;
using ECommerceAI.Services.Implementations;
using ECommerceAI.Services;
using ECommerceAI.Repositories; 




var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Memory Cache cho OTP và caching
builder.Services.AddMemoryCache();

// Add Response Caching
builder.Services.AddResponseCaching();

// Add MongoDB context
builder.Services.AddSingleton<MongoContext>();

// Add Repositories
builder.Services.AddScoped<ICatRepo, CatRepo>();
builder.Services.AddScoped<IDogRepo, DogRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IProductRepo, ProductRepo>();
builder.Services.AddScoped<IOTPRepo, OTPRepo>();
builder.Services.AddScoped<IAddressRepo, AddressRepo>();
builder.Services.AddScoped<ICartRepo, CartRepo>();
builder.Services.AddScoped<IOrderRepo, OrderRepo>();
builder.Services.AddScoped<IPaymentRepo, PaymentRepo>();
builder.Services.AddScoped<IShippingRepo, ShippingRepo>();
builder.Services.AddScoped<ICouponRepo, CouponRepo>();
builder.Services.AddScoped<IInventoryRepo, InventoryRepo>();
builder.Services.AddScoped<INotificationRepo, NotificationRepo>();

// Add Services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddSingleton<IOTPCacheService, OTPCacheService>();
builder.Services.AddScoped<ImportPetsDataService>();

// Configure CORS
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
var isDevelopment = builder.Environment.IsDevelopment();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            // Use configured origins if available
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Allow all origins in production if no specific origins configured
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

// Import pets data if needed
using (var scope = app.Services.CreateScope())
{
    var importService = scope.ServiceProvider.GetRequiredService<ImportPetsDataService>();
    await importService.ImportDataIfNeededAsync();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must be before other middleware
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// Response Caching
app.UseResponseCaching();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

// Run the app on the port assigned by Render (or default 5000)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();
