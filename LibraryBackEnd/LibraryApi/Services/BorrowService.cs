using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class BorrowService
    {
        private readonly LibraryContext _context;
        public BorrowService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message)> CheckBorrowConditions(int docGiaId, List<int> sachIds)
        {
            var docGia = await _context.DocGias.FindAsync(docGiaId);
            if (docGia == null)
                return (false, "Độc giả không tồn tại");
            if (docGia.TrangThai != "Hoạt động")
                return (false, "Tài khoản độc giả đang bị khóa hoặc không hoạt động");
            if (docGia.SachDangMuon >= 5)
                return (false, "Độc giả đã mượn tối đa 5 cuốn sách");
            if (sachIds.Count > 5)
                return (false, "Chỉ được mượn tối đa 5 cuốn/lần");

            // TODO: Kiểm tra nợ phí, quá hạn (nếu có bảng phí/phạt)

            foreach (var sachId in sachIds)
            {
                var sach = await _context.Saches.FindAsync(sachId);
                if (sach == null)
                    return (false, $"Sách ID {sachId} không tồn tại");
                if (sach.SoLuongCoSan <= 0)
                    return (false, $"Sách '{sach.TenSach}' đã hết, không thể mượn");
            }
            return (true, "OK");
        }

        public async Task<(bool Success, string Message, PhieuMuon? PhieuMuon)> CreateBorrow(int docGiaId, List<int> sachIds, int soNgayMuon = 14, string? ghiChu = null)
        {
            var check = await CheckBorrowConditions(docGiaId, sachIds);
            if (!check.Success)
                return (false, check.Message, null);

            var now = DateTime.Now;
            var ngayHenTra = now.AddDays(soNgayMuon);

            var phieu = new PhieuMuon
            {
                DocGiaId = docGiaId,
                NgayMuon = now,
                NgayHenTra = ngayHenTra,
                TrangThai = "Đang mượn",
                GhiChu = ghiChu ?? string.Empty,
                ChiTietPhieuMuons = new List<ChiTietPhieuMuon>()
            };

            foreach (var sachId in sachIds)
            {
                var sach = await _context.Saches.FindAsync(sachId);
                if (sach == null || sach.SoLuongCoSan <= 0)
                    continue;
                phieu.ChiTietPhieuMuons.Add(new ChiTietPhieuMuon
                {
                    SachId = sachId,
                    NgayMuon = now,
                    NgayHenTra = ngayHenTra,
                    TrangThai = "Đang mượn",
                    GhiChu = string.Empty
                });
                sach.SoLuongCoSan--;
            }

            _context.PhieuMuons.Add(phieu);
            var docGia = await _context.DocGias.FindAsync(docGiaId);
            if (docGia != null)
            {
                docGia.SachDangMuon += phieu.ChiTietPhieuMuons.Count;
                docGia.TongLuotMuon += phieu.ChiTietPhieuMuons.Count;
            }
            await _context.SaveChangesAsync();
            return (true, "Tạo phiếu mượn thành công", phieu);
        }

        public async Task<(bool Success, string Message)> ReturnBook(int chiTietPhieuMuonId, bool isDamaged = false)
        {
            var chitiet = await _context.ChiTietPhieuMuons
                .Include(ct => ct.PhieuMuon)
                .Include(ct => ct.Sach)
                .FirstOrDefaultAsync(ct => ct.Id == chiTietPhieuMuonId);
            if (chitiet == null)
                return (false, "Không tìm thấy chi tiết phiếu mượn");
            if (chitiet.TrangThai == "Đã trả")
                return (false, "Sách này đã được trả");

            var now = DateTime.Now;
            chitiet.NgayTra = now;
            chitiet.TrangThai = isDamaged ? "Hư hỏng" : (now > chitiet.NgayHenTra ? "Quá hạn" : "Đã trả");

            // Tính phí phạt nếu quá hạn
            int phiPhat = 0;
            if (now > chitiet.NgayHenTra)
            {
                var daysLate = (now.Date - chitiet.NgayHenTra.Date).Days;
                phiPhat += daysLate * 5; // 5.000đ/ngày
            }
            // Phí hư hỏng (ví dụ: 100% giá trị sách, có thể điều chỉnh)
            if (isDamaged)
            {
                phiPhat += 100; // Giả sử 100.000đ/sách hư (cần lấy giá trị thực tế nếu có)
            }
            chitiet.PhiPhat = phiPhat;

            // Cập nhật số lượng sách
            if (chitiet.Sach != null)
                chitiet.Sach.SoLuongCoSan++;

            // Cập nhật số sách đang mượn của độc giả
            if (chitiet.PhieuMuon != null)
            {
                var docGia = await _context.DocGias.FindAsync(chitiet.PhieuMuon.DocGiaId);
                if (docGia != null && docGia.SachDangMuon > 0)
                    docGia.SachDangMuon--;
            }

            // Nếu tất cả sách trong phiếu đã trả thì cập nhật trạng thái phiếu
            if (chitiet.PhieuMuon != null)
            {
                var allReturned = await _context.ChiTietPhieuMuons
                    .Where(ct => ct.PhieuMuonId == chitiet.PhieuMuonId)
                    .AllAsync(ct => ct.TrangThai == "Đã trả" || ct.TrangThai == "Hư hỏng" || ct.TrangThai == "Quá hạn");
                if (allReturned)
                {
                    chitiet.PhieuMuon.TrangThai = "Đã trả hết";
                    chitiet.PhieuMuon.NgayTraThuc = now;
                }
                else
                {
                    chitiet.PhieuMuon.TrangThai = "Còn sách chưa trả";
                }
            }

            await _context.SaveChangesAsync();
            return (true, "Trả sách thành công");
        }

        public async Task<(bool Success, string Message)> RenewBook(int chiTietPhieuMuonId)
        {
            var chitiet = await _context.ChiTietPhieuMuons
                .Include(ct => ct.Sach)
                .FirstOrDefaultAsync(ct => ct.Id == chiTietPhieuMuonId);
            if (chitiet == null)
                return (false, "Không tìm thấy chi tiết phiếu mượn");
            if (chitiet.TrangThai != "Đang mượn")
                return (false, "Chỉ có thể gia hạn sách đang mượn");
            if (chitiet.NgayHenTra.AddDays(7) < DateTime.Now)
                return (false, "Đã quá hạn, không thể gia hạn");
            // Giả sử có trường RenewCount để kiểm tra số lần gia hạn
            if (chitiet.GhiChu != null && chitiet.GhiChu.Contains("Đã gia hạn"))
                return (false, "Mỗi sách chỉ được gia hạn 1 lần");
            // TODO: Kiểm tra nếu đã có người đặt trước sách này (nếu có bảng đặt trước)

            chitiet.NgayHenTra = chitiet.NgayHenTra.AddDays(7);
            chitiet.GhiChu = (chitiet.GhiChu ?? "") + " | Đã gia hạn";
            await _context.SaveChangesAsync();
            return (true, "Gia hạn thành công thêm 7 ngày");
        }
    }
} 