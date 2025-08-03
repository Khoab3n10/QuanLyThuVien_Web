using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using LibraryApi.Data;
using LibraryApi.Services;
using LibraryApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Library Management API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Database configuration
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "YourSuperSecretKeyHereMakeItLongEnoughForSecurityPurposes");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("LibrarianOnly", policy => policy.RequireRole("Librarian"));
    options.AddPolicy("ReaderOnly", policy => policy.RequireRole("Reader"));
    options.AddPolicy("AccountantOnly", policy => policy.RequireRole("Accountant"));
    options.AddPolicy("WarehouseOnly", policy => policy.RequireRole("Warehouse"));
});

// Service registrations
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Library Management API v1"));
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Database creation and seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LibraryDbContext>();
    context.Database.EnsureCreated();
    
    // Wait a moment for the database to be fully created
    await Task.Delay(1000);
    
    try
    {
        await SeedDataAsync(context);
    }
    catch (Exception ex)
    {
        // Log the error but don't crash the application
        Console.WriteLine($"Error seeding data: {ex.Message}");
    }
}

app.Run();

async Task SeedDataAsync(LibraryDbContext context)
{
    try
    {
        if (!context.Users.Any())
        {
        // Create admin user
        var adminUser = new User
        {
            Username = "admin",
            Password = "admin123", // In production, this should be hashed
            Role = "Admin",
            Email = "admin@library.com",
            IsActive = true
        };
        context.Users.Add(adminUser);

        // Create librarian user
        var librarianUser = new User
        {
            Username = "librarian",
            Password = "librarian123",
            Role = "Librarian",
            Email = "librarian@library.com",
            IsActive = true
        };
        context.Users.Add(librarianUser);

        // Create reader user
        var readerUser = new User
        {
            Username = "reader",
            Password = "reader123",
            Role = "Reader",
            Email = "reader@library.com",
            IsActive = true
        };
        context.Users.Add(readerUser);

        await context.SaveChangesAsync();
    }

    if (!context.Books.Any())
    {
        var books = new List<Book>
        {
            new Book
            {
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Category = "Fiction",
                Publisher = "Scribner",
                PublicationYear = 1925,
                ISBN = "978-0743273565",
                TotalCopies = 5,
                AvailableCopies = 5,
                Description = "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
                Price = 9.99m
            },
            new Book
            {
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                Category = "Fiction",
                Publisher = "Grand Central Publishing",
                PublicationYear = 1960,
                ISBN = "978-0446310789",
                TotalCopies = 3,
                AvailableCopies = 3,
                Description = "The story of young Scout Finch and her father Atticus in a racially divided Alabama town.",
                Price = 12.99m
            },
            new Book
            {
                Title = "1984",
                Author = "George Orwell",
                Category = "Fiction",
                Publisher = "Signet",
                PublicationYear = 1949,
                ISBN = "978-0451524935",
                TotalCopies = 4,
                AvailableCopies = 4,
                Description = "A dystopian novel about totalitarianism and surveillance society.",
                Price = 8.99m
            }
        };

        foreach (var book in books)
        {
            context.Books.Add(book);
        }
        await context.SaveChangesAsync();
    }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in seeding: {ex.Message}");
    }
}
