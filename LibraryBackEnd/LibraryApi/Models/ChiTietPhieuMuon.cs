using System;

namespace LibraryApi.Models
{
    public class ChiTietPhieuMuon
    {
        public int Id { get; set; }
        public int PhieuMuonId { get; set; }
        public PhieuMuon PhieuMuon { get; set; }
        public int SachId { get; set; }
        public Sach Sach { get; set; }

        public DateTime NgayMuon { get; set; }
        public DateTime NgayHenTra { get; set; }
        public DateTime? NgayTra { get; set; }

        public string TrangThai { get; set; } // Đang mượn, Đã trả, Quá hạn, Hư hỏng
        public string GhiChu { get; set; }
        public int? PhiPhat { get; set; } // Phí phạt nếu có
    }
} 