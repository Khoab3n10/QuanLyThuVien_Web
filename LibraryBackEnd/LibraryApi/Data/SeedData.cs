using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Data
{
    public static class SeedData
    {
        public static void Initialize(LibraryContext context)
        {
            if (!context.Saches.Any())
            {
                context.Saches.AddRange(
                    new Sach
                    {
                        TenSach = "Đắc Nhân Tâm",
                        TacGia = "Dale Carnegie",
                        ISBN = "978-604-1-00001-1",
                        TheLoai = "Kỹ năng sống",
                        NhaXuatBan = "NXB Tổng hợp TP.HCM",
                        NamXuatBan = 2019,
                        SoLuong = 5,
                        SoLuongCoSan = 3,
                        ViTriLuuTru = "Kệ A1"
                    },
                    new Sach
                    {
                        TenSach = "Nhà Giả Kim",
                        TacGia = "Paulo Coelho",
                        ISBN = "978-604-1-00002-2",
                        TheLoai = "Tiểu thuyết",
                        NhaXuatBan = "NXB Văn học",
                        NamXuatBan = 2020,
                        SoLuong = 3,
                        SoLuongCoSan = 1,
                        ViTriLuuTru = "Kệ B2"
                    },
                    new Sach
                    {
                        TenSach = "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                        TacGia = "Rosie Nguyễn",
                        ISBN = "978-604-1-00003-3",
                        TheLoai = "Kỹ năng sống",
                        NhaXuatBan = "NXB Hội nhà văn",
                        NamXuatBan = 2018,
                        SoLuong = 4,
                        SoLuongCoSan = 2,
                        ViTriLuuTru = "Kệ A3"
                    }
                );
            }
            else return;

            if (!context.DocGias.Any())
            {
                context.DocGias.AddRange(
                new DocGia
                {
                    HoTen = "Nguyễn Văn A",
                    Email = "nguyenvana@email.com",
                    SoDienThoai = "0123456789",
                    DiaChi = "123 Lê Lợi, Q1",
                    NgayDangKy = DateTime.Now.AddDays(-10),
                    TrangThai = "Hoạt động",
                    TongLuotMuon = 15,
                    SachDangMuon = 2
                },
                new DocGia
                {
                    HoTen = "Trần Thị B",
                    Email = "tranthib@email.com",
                    SoDienThoai = "0987654321",
                    DiaChi = "456 Nguyễn Trãi, Q5",
                    NgayDangKy = DateTime.Now.AddDays(-10),
                    TrangThai = "Hoạt động",
                    TongLuotMuon = 8,
                    SachDangMuon = 0
                },
                new DocGia
                {
                    HoTen = "Lê Văn C",
                    Email = "levanc@email.com",
                    SoDienThoai = "0987654321",
                    DiaChi = "456 Nguyễn Trãi, Q5",
                    NgayDangKy = DateTime.Now.AddDays(-10),
                    TrangThai = "Không hoạt động",
                    TongLuotMuon = 3,
                    SachDangMuon = 1
                },
                new DocGia
                {
                    HoTen = "Phạm Thị D",
                    Email = "phamthid@email.com",
                    SoDienThoai = "0987654321",
                    DiaChi = "456 Nguyễn Trãi, Q5",
                    NgayDangKy = DateTime.Now.AddDays(-10),
                    TrangThai = "Hoạt động",
                    TongLuotMuon = 22,
                    SachDangMuon = 3
                },
                new DocGia
                {
                    HoTen = "Hoàng Văn E",
                    Email = "hoangvane@email.com",
                    SoDienThoai = "0444555666",
                    DiaChi = "456 Nguyễn Trãi, Q5",
                    NgayDangKy = DateTime.Now.AddDays(-10),
                    TrangThai = "Hoạt động",
                    TongLuotMuon = 5,
                    SachDangMuon = 0
                }
            );
            }
            else return;
            context.SaveChanges();
        }
    }
}
