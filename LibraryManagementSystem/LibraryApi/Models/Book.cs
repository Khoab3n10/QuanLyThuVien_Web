using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Author { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Publisher { get; set; }

        public int? PublicationYear { get; set; }

        [StringLength(20)]
        public string? ISBN { get; set; }

        public int TotalCopies { get; set; } = 1;
        public int AvailableCopies { get; set; } = 1;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? Location { get; set; }

        [StringLength(200)]
        public string? CoverImagePath { get; set; }

        public decimal? Price { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Available";

        // Navigation properties
        public ICollection<BorrowTicket> BorrowTickets { get; set; } = new List<BorrowTicket>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<ReturnTicket> ReturnTickets { get; set; } = new List<ReturnTicket>();
        public ICollection<InventoryCheck> InventoryChecks { get; set; } = new List<InventoryCheck>();
        public ICollection<PurchaseProposal> PurchaseProposals { get; set; } = new List<PurchaseProposal>();
    }
} 