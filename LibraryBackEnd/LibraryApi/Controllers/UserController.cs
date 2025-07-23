using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System.Security.Cryptography;
using System.Text;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireAdmin")]
    public class UserController : ControllerBase
    {
        private readonly LibraryContext _context;

        public UserController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.DocGia)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.CreatedAt,
                    u.LastLoginAt,
                    u.IsActive,
                    u.DocGiaId,
                    DocGiaName = u.DocGia != null ? u.DocGia.HoTen : null
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.DocGia)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserRequest request)
        {
            // Check if username or email already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                Role = request.Role,
                CreatedAt = DateTime.Now,
                IsActive = true,
                DocGiaId = request.DocGiaId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Check if username or email already exists (excluding current user)
            if (await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != id))
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            user.Username = request.Username;
            user.Email = request.Email;
            user.Role = request.Role;
            user.IsActive = request.IsActive;
            user.DocGiaId = request.DocGiaId;

            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = HashPassword(request.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Don't allow deleting the last admin
            if (user.Role == "Quản trị viên")
            {
                var adminCount = await _context.Users.CountAsync(u => u.Role == "Quản trị viên" && u.IsActive);
                if (adminCount <= 1)
                {
                    return BadRequest(new { message = "Không thể xóa quản trị viên cuối cùng" });
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }

    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int? DocGiaId { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public int? DocGiaId { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string NewPassword { get; set; }
    }
} 