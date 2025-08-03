using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LibraryApi.Data;
using LibraryApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyHereMakeItLongEnoughForSecurity";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LibraryApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LibraryApi";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("RequireLibrarian", policy => policy.RequireRole("Librarian"));
    options.AddPolicy("RequireReader", policy => policy.RequireRole("Reader"));
    options.AddPolicy("RequireAccountant", policy => policy.RequireRole("Accountant"));
    options.AddPolicy("RequireWarehouse", policy => policy.RequireRole("Warehouse"));
});

// Service registrations
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAll");

// Use static files for serving images
app.UseStaticFiles();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LibraryDbContext>();
    context.Database.EnsureCreated();
    
    // Seed data if database is empty
    if (!context.Users.Any())
    {
        await SeedDataAsync(context);
    }
}

app.Run();

// Seed data method
async Task SeedDataAsync(LibraryDbContext context)
{
    // Create admin user
    var adminUser = new Models.User
    {
        Username = "admin",
        Password = "admin123", // In production, this should be hashed
        Role = "Admin",
        Email = "admin@library.com",
        CreatedAt = DateTime.UtcNow,
        IsActive = true
    };

    // Create librarian user
    var librarianUser = new Models.User
    {
        Username = "librarian",
        Password = "librarian123",
        Role = "Librarian",
        Email = "librarian@library.com",
        CreatedAt = DateTime.UtcNow,
        IsActive = true
    };

    // Create reader user
    var readerUser = new Models.User
    {
        Username = "reader",
        Password = "reader123",
        Role = "Reader",
        Email = "reader@library.com",
        CreatedAt = DateTime.UtcNow,
        IsActive = true
    };

    context.Users.AddRange(adminUser, librarianUser, readerUser);
    await context.SaveChangesAsync();

    // Create reader profile
    var reader = new Models.Reader
    {
        FullName = "John Doe",
        Gender = "Male",
        Address = "123 Main St, City",
        Email = "reader@library.com",
        PhoneNumber = "1234567890",
        RegistrationDate = DateTime.UtcNow,
        MembershipType = "Regular",
        Status = "Active",
        UserId = readerUser.Id
    };

    context.Readers.Add(reader);
    await context.SaveChangesAsync();

    // Update reader user with reader ID
    readerUser.Reader = reader;
    await context.SaveChangesAsync();

    // Create sample books
    var books = new List<Models.Book>
    {
        new Models.Book
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
            Location = "A1-B1",
            Status = "Available",
            DateAdded = DateTime.UtcNow
        },
        new Models.Book
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
            Location = "A1-B2",
            Status = "Available",
            DateAdded = DateTime.UtcNow
        },
        new Models.Book
        {
            Title = "1984",
            Author = "George Orwell",
            Category = "Fiction",
            Publisher = "Signet Classic",
            PublicationYear = 1949,
            ISBN = "978-0451524935",
            TotalCopies = 4,
            AvailableCopies = 4,
            Description = "A dystopian novel about totalitarianism and surveillance society.",
            Location = "A1-B3",
            Status = "Available",
            DateAdded = DateTime.UtcNow
        }
    };

    context.Books.AddRange(books);
    await context.SaveChangesAsync();
} 