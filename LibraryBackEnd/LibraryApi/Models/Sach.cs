namespace LibraryApi.Models
{
    public class Sach
    {
        public int Id { get; set; }                     // Mã sách
        public string TenSach { get; set; }             // Tên sách
        public string TacGia { get; set; }              // Tác giả
        public string ISBN { get; set; }                // Mã ISBN
        public string TheLoai { get; set; }             // Thể loại sách
        public string NhaXuatBan { get; set; }          // Nhà xuất bản
        public int NamXuatBan { get; set; }             // Năm xuất bản
        public int SoLuong { get; set; }                // Tổng số lượng
        public int SoLuongCoSan { get; set; }           // Số lượng có sẵn
        public string ViTriLuuTru { get; set; }         // Vị trí lưu trữ

        public ICollection<ChiTietPhieuMuon> ChiTietPhieuMuons { get; set; }
    }
}
