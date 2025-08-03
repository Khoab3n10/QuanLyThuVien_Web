using Microsoft.EntityFrameworkCore;
using LibraryApi.Models;

namespace LibraryApi.Data
{
    public class LibraryDbContext : DbContext
    {
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Reader> Readers { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BorrowTicket> BorrowTickets { get; set; }
        public DbSet<ReturnTicket> ReturnTickets { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<RenewalTicket> RenewalTickets { get; set; }
        public DbSet<Fine> Fines { get; set; }
        public DbSet<InventoryCheck> InventoryChecks { get; set; }
        public DbSet<PurchaseProposal> PurchaseProposals { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                
                entity.HasOne(e => e.Reader)
                    .WithOne(e => e.User)
                    .HasForeignKey<Reader>(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Reader configuration
            modelBuilder.Entity<Reader>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.PhoneNumber).IsUnique();
            });

            // Book configuration
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasIndex(e => e.ISBN).IsUnique();
                entity.HasIndex(e => e.Title);
                entity.HasIndex(e => e.Author);
                entity.HasIndex(e => e.Category);
            });

            // BorrowTicket configuration
            modelBuilder.Entity<BorrowTicket>(entity =>
            {
                entity.HasOne(e => e.Reader)
                    .WithMany(e => e.BorrowTickets)
                    .HasForeignKey(e => e.ReaderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Book)
                    .WithMany(e => e.BorrowTickets)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ProcessedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ProcessedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ReturnTicket configuration
            modelBuilder.Entity<ReturnTicket>(entity =>
            {
                entity.HasOne(e => e.Reader)
                    .WithMany(e => e.ReturnTickets)
                    .HasForeignKey(e => e.ReaderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Book)
                    .WithMany(e => e.ReturnTickets)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ProcessedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ProcessedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Reservation configuration
            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasOne(e => e.Reader)
                    .WithMany(e => e.Reservations)
                    .HasForeignKey(e => e.ReaderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Book)
                    .WithMany(e => e.Reservations)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // RenewalTicket configuration
            modelBuilder.Entity<RenewalTicket>(entity =>
            {
                entity.HasOne(e => e.Reader)
                    .WithMany(e => e.RenewalTickets)
                    .HasForeignKey(e => e.ReaderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Book)
                    .WithMany()
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ProcessedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ProcessedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Fine configuration
            modelBuilder.Entity<Fine>(entity =>
            {
                entity.HasOne(e => e.Reader)
                    .WithMany(e => e.Fines)
                    .HasForeignKey(e => e.ReaderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Book)
                    .WithMany()
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.IssuedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.IssuedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.ProcessedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ProcessedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // InventoryCheck configuration
            modelBuilder.Entity<InventoryCheck>(entity =>
            {
                entity.HasOne(e => e.Book)
                    .WithMany(e => e.InventoryChecks)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CheckedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CheckedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // PurchaseProposal configuration
            modelBuilder.Entity<PurchaseProposal>(entity =>
            {
                entity.HasOne(e => e.ProposedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ProposedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.DecidedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.DecidedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Book)
                    .WithMany(e => e.PurchaseProposals)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ActivityLog configuration
            modelBuilder.Entity<ActivityLog>(entity =>
            {
                entity.HasOne(e => e.User)
                    .WithMany(e => e.ActivityLogs)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.Action);
                entity.HasIndex(e => e.Entity);
            });
        }
    }
} 