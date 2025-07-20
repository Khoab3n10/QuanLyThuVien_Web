namespace LibraryApi.Models
{
    public class PhieuMuon
    {
        public int Id { get; set; }                     // Mã phiếu
        public string TenDocGia { get; set; }           // Tên độc giả 
        public string TenSach { get; set; }             // Tên sách 

        public DateTime NgayMuon { get; set; }          // Ngày mượn
        public DateTime HanTra { get; set; }            // Hạn trả
        public DateTime? NgayTraThuc { get; set; }      // Ngày trả thực (nullable nếu chưa trả)

        public string TrangThai { get; set; }           // Đang mượn, Đã trả, Quá hạn
        public string GhiChu { get; set; }              // Ghi chú thêm
    }
}