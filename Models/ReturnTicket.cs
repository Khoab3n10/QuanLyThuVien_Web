using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class ReturnTicket
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ReaderId { get; set; }
        
        [Required]
        public int BookId { get; set; }
        
        public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
        public DateTime OriginalDueDate { get; set; }
        
        [StringLength(20)]
        public string ReturnCondition { get; set; } = "Good"; // Good, Damaged, Lost
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public int? ProcessedByUserId { get; set; } // Librarian who processed the return
        
        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
        public User? ProcessedByUser { get; set; }
    }
} 