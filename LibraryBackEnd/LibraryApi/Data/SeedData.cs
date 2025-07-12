using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Data
{
    public static class SeedData
    {
        public static void Initialize(LibraryContext context)
        {
            if (context.Saches.Any()) return;

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

            context.SaveChanges();
        }
    }
}
