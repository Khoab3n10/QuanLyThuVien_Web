using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class ReservationService
    {
        private readonly LibraryContext _context;
        public ReservationService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message)> CheckReservationConditions(int docGiaId, int sachId)
        {
            var docGia = await _context.DocGias.FindAsync(docGiaId);
            if (docGia == null)
                return (false, "Độc giả không tồn tại");
            if (docGia.TrangThai != "Hoạt động")
                return (false, "Tài khoản độc giả đang bị khóa hoặc không hoạt động");
            var count = await _context.Reservations.CountAsync(r => r.DocGiaId == docGiaId && r.TrangThai == "Đang chờ");
            if (count >= 3)
                return (false, "Chỉ được đặt trước tối đa 3 cuốn");
            var exist = await _context.Reservations.AnyAsync(r => r.DocGiaId == docGiaId && r.SachId == sachId && r.TrangThai == "Đang chờ");
            if (exist)
                return (false, "Bạn đã đặt trước cuốn này rồi");
            return (true, "OK");
        }

        public async Task<(bool Success, string Message, Reservation? Reservation)> CreateReservation(int docGiaId, int sachId)
        {
            var check = await CheckReservationConditions(docGiaId, sachId);
            if (!check.Success)
                return (false, check.Message, null);
            var now = DateTime.Now;
            var reservation = new Reservation
            {
                DocGiaId = docGiaId,
                SachId = sachId,
                NgayDat = now,
                NgayHetHan = now.AddHours(24),
                TrangThai = "Đang chờ"
            };
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return (true, "Đặt trước thành công", reservation);
        }

        public async Task AutoCancelExpiredReservations()
        {
            var now = DateTime.Now;
            var expired = await _context.Reservations
                .Where(r => r.TrangThai == "Đang chờ" && r.NgayHetHan < now)
                .ToListAsync();
            foreach (var r in expired)
            {
                r.TrangThai = "Đã hủy";
            }
            await _context.SaveChangesAsync();
        }
    }
} 