using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaoCaos",
                columns: table => new
                {
                    MaBaoCao = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LoaiBaoCao = table.Column<string>(type: "TEXT", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NoiDung = table.Column<string>(type: "TEXT", nullable: false),
                    FilePDF = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaoCaos", x => x.MaBaoCao);
                });

            migrationBuilder.CreateTable(
                name: "DocGias",
                columns: table => new
                {
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HoTen = table.Column<string>(type: "TEXT", nullable: false),
                    TenDG = table.Column<string>(type: "TEXT", nullable: true),
                    NgaySinh = table.Column<DateTime>(type: "TEXT", nullable: true),
                    GioiTinh = table.Column<string>(type: "TEXT", nullable: false),
                    DiaChi = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    SDT = table.Column<string>(type: "TEXT", nullable: false),
                    LoaiDocGia = table.Column<string>(type: "TEXT", nullable: true),
                    CapBac = table.Column<string>(type: "TEXT", nullable: true),
                    MemberStatus = table.Column<string>(type: "TEXT", nullable: true),
                    NgayDangKy = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NgayHetHan = table.Column<DateTime>(type: "TEXT", nullable: true),
                    PhiThanhVien = table.Column<decimal>(type: "TEXT", nullable: false),
                    NgayKhoa = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SoNgayKhoa = table.Column<int>(type: "INTEGER", nullable: false),
                    LyDoKhoa = table.Column<string>(type: "TEXT", nullable: true),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SoSachToiDa = table.Column<int>(type: "INTEGER", nullable: false),
                    SoNgayMuonToiDa = table.Column<int>(type: "INTEGER", nullable: false),
                    SoLanGiaHanToiDa = table.Column<int>(type: "INTEGER", nullable: false),
                    SoNgayGiaHan = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocGias", x => x.MaDG);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDungs",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TenDangNhap = table.Column<string>(type: "TEXT", nullable: false),
                    MatKhau = table.Column<string>(type: "TEXT", nullable: false),
                    ChucVu = table.Column<string>(type: "TEXT", nullable: false),
                    DocGiaId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDungs", x => x.MaND);
                });

            migrationBuilder.CreateTable(
                name: "PhanHoiNCCs",
                columns: table => new
                {
                    MaPhieu = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NhaCungCap = table.Column<string>(type: "TEXT", nullable: false),
                    NgayNhan = table.Column<DateTime>(type: "TEXT", nullable: true),
                    PhanHoi = table.Column<string>(type: "TEXT", nullable: false),
                    NgayGiaoDuKien = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhanHoiNCCs", x => x.MaPhieu);
                });

            migrationBuilder.CreateTable(
                name: "PhieuKiemKes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    KyKiemKe = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    NgayKiemKe = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NhanVienThucHien = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    TrangThai = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuKiemKes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhapKhos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaPhieu = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    NgayNhap = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NhaCungCap = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    TongTien = table.Column<decimal>(type: "TEXT", nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhapKhos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Saches",
                columns: table => new
                {
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TenSach = table.Column<string>(type: "TEXT", nullable: false),
                    TacGia = table.Column<string>(type: "TEXT", nullable: false),
                    TheLoai = table.Column<string>(type: "TEXT", nullable: false),
                    NamXB = table.Column<int>(type: "INTEGER", nullable: true),
                    ISBN = table.Column<string>(type: "TEXT", nullable: false),
                    SoLuong = table.Column<int>(type: "INTEGER", nullable: true),
                    GiaSach = table.Column<decimal>(type: "TEXT", nullable: true),
                    TrangThai = table.Column<string>(type: "TEXT", nullable: false),
                    ViTriLuuTru = table.Column<string>(type: "TEXT", nullable: false),
                    NhaXuatBan = table.Column<string>(type: "TEXT", nullable: false),
                    AnhBia = table.Column<string>(type: "TEXT", nullable: false),
                    KeSach = table.Column<string>(type: "TEXT", nullable: false),
                    MoTa = table.Column<string>(type: "TEXT", nullable: false),
                    NamXuatBan = table.Column<int>(type: "INTEGER", nullable: true),
                    NgayNhap = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Saches", x => x.MaSach);
                });

            migrationBuilder.CreateTable(
                name: "PhieuMuon",
                columns: table => new
                {
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    NgayMuon = table.Column<DateTime>(type: "TEXT", nullable: false),
                    HanTra = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayTra = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TrangThai = table.Column<string>(type: "TEXT", nullable: false),
                    NguoiLap = table.Column<string>(type: "TEXT", nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DocGiaMaDG = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuMuon", x => x.MaPhieuMuon);
                    table.ForeignKey(
                        name: "FK_PhieuMuon_DocGias_DocGiaMaDG",
                        column: x => x.DocGiaMaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG");
                    table.ForeignKey(
                        name: "FK_PhieuMuon_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PhieuPhats",
                columns: table => new
                {
                    MaPhieuPhat = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    LoaiPhat = table.Column<string>(type: "TEXT", nullable: false),
                    SoTien = table.Column<decimal>(type: "TEXT", nullable: true),
                    NgayLap = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuPhats", x => x.MaPhieuPhat);
                    table.ForeignKey(
                        name: "FK_PhieuPhats_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TheThuViens",
                columns: table => new
                {
                    MaThe = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    LoaiThe = table.Column<string>(type: "TEXT", nullable: false),
                    NgayDK = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NgayHetHan = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TrangThai = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TheThuViens", x => x.MaThe);
                    table.ForeignKey(
                        name: "FK_TheThuViens_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhatKyHoatDongs",
                columns: table => new
                {
                    MaNK = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaND = table.Column<int>(type: "INTEGER", nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "TEXT", nullable: true),
                    HanhDong = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhatKyHoatDongs", x => x.MaNK);
                    table.ForeignKey(
                        name: "FK_NhatKyHoatDongs_NguoiDungs_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuCapQuyens",
                columns: table => new
                {
                    MaPhieuQuyen = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaND = table.Column<int>(type: "INTEGER", nullable: false),
                    QuyenDuocCap = table.Column<string>(type: "TEXT", nullable: false),
                    ThoiHan = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuCapQuyens", x => x.MaPhieuQuyen);
                    table.ForeignKey(
                        name: "FK_PhieuCapQuyens_NguoiDungs_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhapKhos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PhieuNhapKhoId = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    TenSach = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    SoLuong = table.Column<int>(type: "INTEGER", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ThanhTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuNhapKhos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhapKhos_PhieuNhapKhos_PhieuNhapKhoId",
                        column: x => x.PhieuNhapKhoId,
                        principalTable: "PhieuNhapKhos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuKiemKes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PhieuKiemKeId = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    TenSach = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    SoLuongHeThong = table.Column<int>(type: "INTEGER", nullable: false),
                    SoLuongThucTe = table.Column<int>(type: "INTEGER", nullable: false),
                    ChenhLech = table.Column<int>(type: "INTEGER", nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuKiemKes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuKiemKes_PhieuKiemKes_PhieuKiemKeId",
                        column: x => x.PhieuKiemKeId,
                        principalTable: "PhieuKiemKes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuKiemKes_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_KiemKe",
                columns: table => new
                {
                    MaPhieuKK = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    PhieuKiemKeId = table.Column<int>(type: "INTEGER", nullable: false),
                    SachMaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    SL_HeThong = table.Column<int>(type: "INTEGER", nullable: true),
                    SL_ThucTe = table.Column<int>(type: "INTEGER", nullable: true),
                    ChenhLech = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_KiemKe", x => new { x.MaPhieuKK, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_KiemKe_PhieuKiemKes_PhieuKiemKeId",
                        column: x => x.PhieuKiemKeId,
                        principalTable: "PhieuKiemKes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_KiemKe_Saches_SachMaSach",
                        column: x => x.SachMaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuDatTruocs",
                columns: table => new
                {
                    MaPhieuDat = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    NgayDat = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TrangThai = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuDatTruocs", x => x.MaPhieuDat);
                    table.ForeignKey(
                        name: "FK_PhieuDatTruocs_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuDatTruocs_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuDeXuatMuaSachs",
                columns: table => new
                {
                    MaDeXuat = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TieuDe = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    MaNguoiDeXuat = table.Column<int>(type: "INTEGER", nullable: false),
                    NgayDeXuat = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MucDoUuTien = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    ChiPhiDuKien = table.Column<decimal>(type: "TEXT", nullable: false),
                    MoTa = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    NgayDuyet = table.Column<DateTime>(type: "TEXT", nullable: true),
                    MaNguoiDuyet = table.Column<int>(type: "INTEGER", nullable: true),
                    LyDoTuChoi = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SachMaSach = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuDeXuatMuaSachs", x => x.MaDeXuat);
                    table.ForeignKey(
                        name: "FK_PhieuDeXuatMuaSachs_NguoiDungs_MaNguoiDeXuat",
                        column: x => x.MaNguoiDeXuat,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuDeXuatMuaSachs_NguoiDungs_MaNguoiDuyet",
                        column: x => x.MaNguoiDuyet,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaND");
                    table.ForeignKey(
                        name: "FK_PhieuDeXuatMuaSachs_Saches_SachMaSach",
                        column: x => x.SachMaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach");
                });

            migrationBuilder.CreateTable(
                name: "BaoCaoViPhams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaViPham = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    MaDocGia = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: true),
                    MucDoViPham = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    SoNgayTre = table.Column<int>(type: "INTEGER", nullable: true),
                    MoTaViPham = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    NgayViPham = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    NgayXuLy = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NguoiXuLy = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    SoTienPhat = table.Column<decimal>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaoCaoViPhams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BaoCaoViPhams_DocGias_MaDocGia",
                        column: x => x.MaDocGia,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BaoCaoViPhams_PhieuMuon_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuon",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BaoCaoViPhams_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CT_PhieuMuons",
                columns: table => new
                {
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_PhieuMuons", x => new { x.MaPhieuMuon, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_PhieuMuons_PhieuMuon_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuon",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_PhieuMuons_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatTruocSaches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDatTruoc = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    MaDocGia = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    NgayDatTruoc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    HanLaySach = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    NgayXuLy = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NguoiXuLy = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatTruocSaches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatTruocSaches_DocGias_MaDocGia",
                        column: x => x.MaDocGia,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatTruocSaches_PhieuMuon_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuon",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatTruocSaches_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PhieuGiaHans",
                columns: table => new
                {
                    MaGiaHan = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    NgayGiaHan = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayHetHanCu = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayHetHanMoi = table.Column<DateTime>(type: "TEXT", nullable: false),
                    SoNgayGiaHan = table.Column<int>(type: "INTEGER", nullable: false),
                    LanGiaHan = table.Column<int>(type: "INTEGER", nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", nullable: false),
                    LyDoTuChoi = table.Column<string>(type: "TEXT", nullable: false),
                    NguoiDuyet = table.Column<string>(type: "TEXT", nullable: false),
                    NgayDuyet = table.Column<DateTime>(type: "TEXT", nullable: true),
                    GhiChu = table.Column<string>(type: "TEXT", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuGiaHans", x => x.MaGiaHan);
                    table.ForeignKey(
                        name: "FK_PhieuGiaHans_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuGiaHans_PhieuMuon_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuon",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuGiaHans_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuTras",
                columns: table => new
                {
                    MaPhieuTra = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    NgayTra = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NguoiLap = table.Column<string>(type: "TEXT", nullable: false),
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuTras", x => x.MaPhieuTra);
                    table.ForeignKey(
                        name: "FK_PhieuTras_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuTras_PhieuMuon_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuon",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietDeXuatMuaSachs",
                columns: table => new
                {
                    MaChiTiet = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaDeXuat = table.Column<int>(type: "INTEGER", nullable: false),
                    TenSach = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    TacGia = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ISBN = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    TheLoai = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    NhaXuatBan = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    NamXuatBan = table.Column<int>(type: "INTEGER", nullable: true),
                    SoLuong = table.Column<int>(type: "INTEGER", nullable: false),
                    DonGia = table.Column<decimal>(type: "TEXT", nullable: false),
                    LyDo = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietDeXuatMuaSachs", x => x.MaChiTiet);
                    table.ForeignKey(
                        name: "FK_ChiTietDeXuatMuaSachs_PhieuDeXuatMuaSachs_MaDeXuat",
                        column: x => x.MaDeXuat,
                        principalTable: "PhieuDeXuatMuaSachs",
                        principalColumn: "MaDeXuat",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuThus",
                columns: table => new
                {
                    MaPhieuThu = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NgayThu = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MaDG = table.Column<int>(type: "INTEGER", nullable: false),
                    LoaiThu = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    SoTien = table.Column<decimal>(type: "TEXT", nullable: false),
                    HinhThucThanhToan = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    GhiChu = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    NguoiThu = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LoaiViPham = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: true),
                    TenSach = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    SoNgayTre = table.Column<int>(type: "INTEGER", nullable: true),
                    MaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: true),
                    MaBaoCaoViPham = table.Column<int>(type: "INTEGER", nullable: true),
                    MaGiaoDich = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SachMaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    PhieuMuonMaPhieuMuon = table.Column<int>(type: "INTEGER", nullable: false),
                    BaoCaoViPhamId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuThus", x => x.MaPhieuThu);
                    table.ForeignKey(
                        name: "FK_PhieuThus_BaoCaoViPhams_BaoCaoViPhamId",
                        column: x => x.BaoCaoViPhamId,
                        principalTable: "BaoCaoViPhams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuThus_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuThus_PhieuMuon_PhieuMuonMaPhieuMuon",
                        column: x => x.PhieuMuonMaPhieuMuon,
                        principalTable: "PhieuMuon",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuThus_Saches_SachMaSach",
                        column: x => x.SachMaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_PhieuTras",
                columns: table => new
                {
                    MaPhieuTra = table.Column<int>(type: "INTEGER", nullable: false),
                    MaSach = table.Column<int>(type: "INTEGER", nullable: false),
                    SoNgayMuon = table.Column<int>(type: "INTEGER", nullable: true),
                    TienPhat = table.Column<decimal>(type: "TEXT", nullable: true),
                    TinhTrang = table.Column<string>(type: "TEXT", nullable: false),
                    NgayTraThucTe = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_PhieuTras", x => new { x.MaPhieuTra, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_PhieuTras_PhieuTras_MaPhieuTra",
                        column: x => x.MaPhieuTra,
                        principalTable: "PhieuTras",
                        principalColumn: "MaPhieuTra",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_PhieuTras_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaoCaoViPhams_MaDocGia",
                table: "BaoCaoViPhams",
                column: "MaDocGia");

            migrationBuilder.CreateIndex(
                name: "IX_BaoCaoViPhams_MaPhieuMuon",
                table: "BaoCaoViPhams",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_BaoCaoViPhams_MaSach",
                table: "BaoCaoViPhams",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDeXuatMuaSachs_MaDeXuat",
                table: "ChiTietDeXuatMuaSachs",
                column: "MaDeXuat");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuKiemKes_MaSach",
                table: "ChiTietPhieuKiemKes",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuKiemKes_PhieuKiemKeId",
                table: "ChiTietPhieuKiemKes",
                column: "PhieuKiemKeId");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapKhos_PhieuNhapKhoId",
                table: "ChiTietPhieuNhapKhos",
                column: "PhieuNhapKhoId");

            migrationBuilder.CreateIndex(
                name: "IX_CT_KiemKe_PhieuKiemKeId",
                table: "CT_KiemKe",
                column: "PhieuKiemKeId");

            migrationBuilder.CreateIndex(
                name: "IX_CT_KiemKe_SachMaSach",
                table: "CT_KiemKe",
                column: "SachMaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuMuons_MaSach",
                table: "CT_PhieuMuons",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuTras_MaSach",
                table: "CT_PhieuTras",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_DatTruocSaches_MaDocGia",
                table: "DatTruocSaches",
                column: "MaDocGia");

            migrationBuilder.CreateIndex(
                name: "IX_DatTruocSaches_MaPhieuMuon",
                table: "DatTruocSaches",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_DatTruocSaches_MaSach",
                table: "DatTruocSaches",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHoatDongs_MaND",
                table: "NhatKyHoatDongs",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuCapQuyens_MaND",
                table: "PhieuCapQuyens",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDatTruocs_MaDG",
                table: "PhieuDatTruocs",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDatTruocs_MaSach",
                table: "PhieuDatTruocs",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaNguoiDeXuat",
                table: "PhieuDeXuatMuaSachs",
                column: "MaNguoiDeXuat");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs",
                column: "MaNguoiDuyet");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDeXuatMuaSachs_SachMaSach",
                table: "PhieuDeXuatMuaSachs",
                column: "SachMaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGiaHans_MaDG",
                table: "PhieuGiaHans",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGiaHans_MaPhieuMuon",
                table: "PhieuGiaHans",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGiaHans_MaSach",
                table: "PhieuGiaHans",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuMuon_DocGiaMaDG",
                table: "PhieuMuon",
                column: "DocGiaMaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuMuon_MaDG",
                table: "PhieuMuon",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuPhats_MaDG",
                table: "PhieuPhats",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_BaoCaoViPhamId",
                table: "PhieuThus",
                column: "BaoCaoViPhamId");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_MaDG",
                table: "PhieuThus",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_PhieuMuonMaPhieuMuon",
                table: "PhieuThus",
                column: "PhieuMuonMaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_SachMaSach",
                table: "PhieuThus",
                column: "SachMaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTras_MaDG",
                table: "PhieuTras",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTras_MaPhieuMuon",
                table: "PhieuTras",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_TheThuViens_MaDG",
                table: "TheThuViens",
                column: "MaDG",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaoCaos");

            migrationBuilder.DropTable(
                name: "ChiTietDeXuatMuaSachs");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuKiemKes");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhapKhos");

            migrationBuilder.DropTable(
                name: "CT_KiemKe");

            migrationBuilder.DropTable(
                name: "CT_PhieuMuons");

            migrationBuilder.DropTable(
                name: "CT_PhieuTras");

            migrationBuilder.DropTable(
                name: "DatTruocSaches");

            migrationBuilder.DropTable(
                name: "NhatKyHoatDongs");

            migrationBuilder.DropTable(
                name: "PhanHoiNCCs");

            migrationBuilder.DropTable(
                name: "PhieuCapQuyens");

            migrationBuilder.DropTable(
                name: "PhieuDatTruocs");

            migrationBuilder.DropTable(
                name: "PhieuGiaHans");

            migrationBuilder.DropTable(
                name: "PhieuPhats");

            migrationBuilder.DropTable(
                name: "PhieuThus");

            migrationBuilder.DropTable(
                name: "TheThuViens");

            migrationBuilder.DropTable(
                name: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropTable(
                name: "PhieuNhapKhos");

            migrationBuilder.DropTable(
                name: "PhieuKiemKes");

            migrationBuilder.DropTable(
                name: "PhieuTras");

            migrationBuilder.DropTable(
                name: "BaoCaoViPhams");

            migrationBuilder.DropTable(
                name: "NguoiDungs");

            migrationBuilder.DropTable(
                name: "PhieuMuon");

            migrationBuilder.DropTable(
                name: "Saches");

            migrationBuilder.DropTable(
                name: "DocGias");
        }
    }
}
