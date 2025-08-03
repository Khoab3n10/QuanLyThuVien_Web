using LibraryApi.DTOs;

namespace LibraryApi.Services
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<bool> RegisterAsync(RegisterRequest request);
        Task<bool> ChangePasswordAsync(ChangePasswordRequest request);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }
} 