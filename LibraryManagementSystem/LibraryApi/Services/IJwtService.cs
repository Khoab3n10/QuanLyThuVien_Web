using LibraryApi.Models;

namespace LibraryApi.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        bool ValidateToken(string token);
    }
} 