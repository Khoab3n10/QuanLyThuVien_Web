using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class ActivityLog
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // Login, Logout, Create, Update, Delete, etc.
        
        [Required]
        [StringLength(100)]
        public string Entity { get; set; } = string.Empty; // User, Book, Reader, etc.
        
        public int? EntityId { get; set; } // ID of the affected entity
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        [StringLength(200)]
        public string? UserAgent { get; set; }
        
        // Navigation properties
        public User User { get; set; } = null!;
    }
} 