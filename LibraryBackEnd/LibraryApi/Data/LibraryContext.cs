using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

        public DbSet<Sach> Saches { get; set; }
        public DbSet<DocGia> DocGias { get; set; }
        public DbSet<PhieuMuon> PhieuMuons { get; set; }
        public DbSet<ChiTietPhieuMuon> ChiTietPhieuMuons { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - DocGia
            modelBuilder.Entity<User>()
                .HasOne(u => u.DocGia)
                .WithMany()
                .HasForeignKey(u => u.DocGiaId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // PhieuMuon - DocGia
            modelBuilder.Entity<PhieuMuon>()
                .HasOne(pm => pm.DocGia)
                .WithMany(dg => dg.PhieuMuons)
                .HasForeignKey(pm => pm.DocGiaId)
                .OnDelete(DeleteBehavior.Cascade);

            // ChiTietPhieuMuon - PhieuMuon
            modelBuilder.Entity<ChiTietPhieuMuon>()
                .HasOne(ct => ct.PhieuMuon)
                .WithMany(pm => pm.ChiTietPhieuMuons)
                .HasForeignKey(ct => ct.PhieuMuonId)
                .OnDelete(DeleteBehavior.Cascade);

            // ChiTietPhieuMuon - Sach
            modelBuilder.Entity<ChiTietPhieuMuon>()
                .HasOne(ct => ct.Sach)
                .WithMany(s => s.ChiTietPhieuMuons)
                .HasForeignKey(ct => ct.SachId)
                .OnDelete(DeleteBehavior.Restrict);

            // Reservation - DocGia
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.DocGia)
                .WithMany()
                .HasForeignKey(r => r.DocGiaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Reservation - Sach
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Sach)
                .WithMany()
                .HasForeignKey(r => r.SachId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
