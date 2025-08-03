using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(LibraryContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Users/by-username/{username}
        [HttpGet("by-username/{username}")]
        public async Task<ActionResult<UserDto>> GetUserByUsername(string username)
        {
            try
            {
                var user = await _context.NguoiDungs
                    .FirstOrDefaultAsync(u => u.TenDangNhap == username);

                if (user == null)
                {
                    return NotFound(new { message = $"User with username '{username}' not found" });
                }

                var userDto = new UserDto
                {
                    MaND = user.MaND,
                    TenDangNhap = user.TenDangNhap,
                    ChucVu = user.ChucVu,
                    DocGiaId = user.DocGiaId
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user by username {username}: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the user");
            }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var users = await _context.NguoiDungs
                    .Select(u => new UserDto
                    {
                        MaND = u.MaND,
                        TenDangNhap = u.TenDangNhap,
                        ChucVu = u.ChucVu,
                        DocGiaId = u.DocGiaId
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting users: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving users");
            }
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _context.NguoiDungs.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = $"User with id {id} not found" });
                }

                var userDto = new UserDto
                {
                    MaND = user.MaND,
                    TenDangNhap = user.TenDangNhap,
                    ChucVu = user.ChucVu,
                    DocGiaId = user.DocGiaId
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user with id {id}: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the user");
            }
        }
    }

    // DTO class for returning user data
    public class UserDto
    {
        public int MaND { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string ChucVu { get; set; } = string.Empty;
        public int? DocGiaId { get; set; }
    }
}