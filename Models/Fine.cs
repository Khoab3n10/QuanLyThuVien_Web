using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class Fine
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ReaderId { get; set; }
        
        public int? BookId { get; set; } // Optional, for book-specific fines
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // Overdue, Damage, Lost, LateReturn
        
        public decimal Amount { get; set; }
        public DateTime IssueDate { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Paid, Waived, Overdue
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public int? IssuedByUserId { get; set; }
        public int? ProcessedByUserId { get; set; }
        
        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book? Book { get; set; }
        public User? IssuedByUser { get; set; }
        public User? ProcessedByUser { get; set; }
    }
} 