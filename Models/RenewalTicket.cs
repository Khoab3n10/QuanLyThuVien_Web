using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class RenewalTicket
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ReaderId { get; set; }
        
        [Required]
        public int BookId { get; set; }
        
        public DateTime RenewalDate { get; set; } = DateTime.UtcNow;
        public DateTime OldDueDate { get; set; }
        public DateTime NewDueDate { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public int? ProcessedByUserId { get; set; } // Librarian who processed the renewal
        
        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
        public User? ProcessedByUser { get; set; }
    }
} 