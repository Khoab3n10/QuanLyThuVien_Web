using System;
using System.Collections.Generic;

namespace LibraryApi.Models
{
    public class PhieuMuon
    {
        public int Id { get; set; }                     // Mã phiếu
        public int DocGiaId { get; set; }
        public DocGia DocGia { get; set; }

        public DateTime NgayMuon { get; set; }          // Ngày mượn
        public DateTime NgayHenTra { get; set; }         // Ngày hẹn trả
        public DateTime? NgayTraThuc { get; set; }      // Ngày trả thực (nullable nếu chưa trả)

        public string TrangThai { get; set; }           // Đang mượn, Đã trả hết, Còn sách chưa trả
        public string GhiChu { get; set; }              // Ghi chú thêm

        public ICollection<ChiTietPhieuMuon> ChiTietPhieuMuons { get; set; }
    }
}