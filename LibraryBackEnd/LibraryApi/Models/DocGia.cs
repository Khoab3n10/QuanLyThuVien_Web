using System;
using System.Collections.Generic;

namespace LibraryApi.Models
{
    public class DocGia
    {
        public int Id { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string DiaChi { get; set; }
        public DateTime NgayDangKy { get; set; }
        public string TrangThai { get; set; }

        // Thống kê
        public int TongLuotMuon { get; set; }
        public int SachDangMuon { get; set; }

        public ICollection<PhieuMuon> PhieuMuons { get; set; }
    }
}
