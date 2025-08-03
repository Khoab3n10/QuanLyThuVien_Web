using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PurchaseProposal
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string BookTitle { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Author { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? Publisher { get; set; }
        
        public int? PublicationYear { get; set; }
        
        [StringLength(20)]
        public string? ISBN { get; set; }
        
        public int ProposedQuantity { get; set; } = 1;
        public decimal? EstimatedPrice { get; set; }
        
        [StringLength(500)]
        public string? Reason { get; set; }
        
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Purchased
        
        public DateTime ProposalDate { get; set; } = DateTime.UtcNow;
        public DateTime? DecisionDate { get; set; }
        
        public int? ProposedByUserId { get; set; }
        public int? DecidedByUserId { get; set; }
        
        // Navigation properties
        public User? ProposedByUser { get; set; }
        public User? DecidedByUser { get; set; }
        public Book? Book { get; set; } // If book was created from this proposal
    }
} 