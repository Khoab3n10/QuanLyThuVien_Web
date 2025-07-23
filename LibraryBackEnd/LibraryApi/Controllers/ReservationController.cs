using LibraryApi.Data;
using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireReader")]
    public class ReservationController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ReservationService _reservationService;

        public ReservationController(LibraryContext context, ReservationService reservationService)
        {
            _context = context;
            _reservationService = reservationService;
        }

        // POST: api/Reservation
        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationRequest request)
        {
            var result = await _reservationService.CreateReservation(request.DocGiaId, request.SachId);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(result.Reservation);
        }

        // GET: api/Reservation
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _context.Reservations
                .Include(r => r.DocGia)
                .Include(r => r.Sach)
                .OrderByDescending(r => r.NgayDat)
                .ToListAsync();
            return Ok(reservations);
        }

        // POST: api/Reservation/auto-cancel
        [HttpPost("auto-cancel")]
        [AllowAnonymous]
        public async Task<IActionResult> AutoCancelExpired()
        {
            await _reservationService.AutoCancelExpiredReservations();
            return Ok(new { message = "Đã tự động hủy các đặt trước quá hạn" });
        }
    }

    public class CreateReservationRequest
    {
        public int DocGiaId { get; set; }
        public int SachId { get; set; }
    }
} 