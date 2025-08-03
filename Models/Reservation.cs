using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ReaderId { get; set; }
        
        [Required]
        public int BookId { get; set; }
        
        public DateTime ReservationDate { get; set; } = DateTime.UtcNow;
        public DateTime ExpiryDate { get; set; } // When reservation expires
        
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Fulfilled, Expired, Cancelled
        
        public int QueuePosition { get; set; } = 1;
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        // Navigation properties
        public Reader Reader { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
} 