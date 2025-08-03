using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class BorrowTicket
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ReaderId { get; set; }
        
        [Required]
        public int BookId { get; set; }
        
        public DateTime BorrowDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        
        [StringLength(20)]
        public string Status { get; set; } = "Borrowed"; // Borrowed, Returned, Overdue, Lost
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public int? ProcessedByUserId { get; set; } // Librarian who processed the borrow
        
        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
        public User? ProcessedByUser { get; set; }
        public ICollection<RenewalTicket> RenewalTickets { get; set; } = new List<RenewalTicket>();
    }
} 