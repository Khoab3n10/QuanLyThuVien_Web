using System;

namespace LibraryApi.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int DocGiaId { get; set; }
        public DocGia DocGia { get; set; }
        public int SachId { get; set; }
        public Sach Sach { get; set; }
        public DateTime NgayDat { get; set; }
        public DateTime? NgayHetHan { get; set; } // Tự động hủy sau 24h
        public string TrangThai { get; set; } // Đang chờ, Đã nhận, Đã hủy
    }
} 